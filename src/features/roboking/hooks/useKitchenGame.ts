import { useCallback, useEffect, useRef, useState } from 'react';

import { useGameLoop } from './useGameLoop';
import { useGamePause } from './useGamePause';
import { useKeyboardControls } from './useKeyboardControls';
import {
  distance,
  findCollidingWall,
  findFirstUncollectedWithinRadius,
} from '../helper/collision';
import { playSound } from '../helper/soundManager';
import { tickSpeedSecondsLeft } from '../helper/speedTimer';
import { GAME_RULES } from '../helper/stageConfig';
import type { Point, StageConfig } from '../helper/stageConfig';

export type StageStatus = 'playing' | 'clear' | 'fail';
export type UspKind = 'corner' | 'speed' | null;

const STAGE_FPS = 48;

/**
 * 주방 스테이지의 실제 게임 로직. `kitchen/RoboKing.as` + `kitchen/StageMain.as`의
 * 이동/충돌/먼지 흡입/이벤트 아이템/스피드업/타이머/클리어·실패 판정을 옮긴다.
 */
export function useKitchenGame(config: StageConfig) {
  const { isPaused: isTabPaused } = useGamePause();

  const [status, setStatus] = useState<StageStatus>('playing');
  const [usp, setUsp] = useState<UspKind>(null);

  const [robotPos, setRobotPos] = useState<Point>(config.robotStart);
  const robotPosRef = useRef<Point>(config.robotStart);

  const [collectedDust, setCollectedDust] = useState<ReadonlySet<number>>(
    new Set(),
  );
  const [collectedEventDust, setCollectedEventDust] = useState<
    ReadonlySet<number>
  >(new Set());

  const [cornerIconVisible, setCornerIconVisible] = useState(false);
  const [cornerIconCollected, setCornerIconCollected] = useState(false);
  const [cornerUspClosedOnce, setCornerUspClosedOnce] = useState(false);
  const [speedIconVisible, setSpeedIconVisible] = useState(false);
  const [speedIconCollected, setSpeedIconCollected] = useState(false);
  const [isSpeedActive, setIsSpeedActive] = useState(false);

  const [gameTimeUnits, setGameTimeUnits] = useState(0);

  const speedSecondsLeftRef = useRef(0);
  const touchingEventDustRef = useRef(false);

  const isPlaying = status === 'playing' && usp === null && !isTabPaused;

  const totalDustCount = config.dust.length + config.eventDust.length;
  const collectedCount = collectedDust.size + collectedEventDust.size;
  const scorePercent = Math.floor((collectedCount / totalDustCount) * 100);
  const timeLeftSeconds = Math.max(
    0,
    Math.ceil(
      (GAME_RULES.endTimeUnits - gameTimeUnits) /
        GAME_RULES.timeUnitsPerTick /
        STAGE_FPS,
    ),
  );

  const handleSpaceDown = useCallback(() => {
    if (speedIconCollected && !isSpeedActive) {
      setIsSpeedActive(true);
      speedSecondsLeftRef.current = GAME_RULES.speedUpDurationSeconds;
    }
  }, [speedIconCollected, isSpeedActive]);

  const { direction } = useKeyboardControls({ onSpaceDown: handleSpaceDown });

  const closeUsp = useCallback(() => {
    setUsp((current) => {
      if (current === 'corner') setCornerUspClosedOnce(true);
      return null;
    });
  }, []);

  // 코너 아이콘은 원본처럼 시작 4초 후 등장(실제 시간 기준 setTimeout).
  useEffect(() => {
    const timer = setTimeout(
      () => setCornerIconVisible(true),
      GAME_RULES.cornerIconShowDelayMs,
    );
    return () => clearTimeout(timer);
  }, []);

  // 코너 USP를 닫은 뒤 10초 후 스피드 아이콘 등장(원본 gameResumeAndShowSpeedIcon).
  useEffect(() => {
    if (!cornerUspClosedOnce) return;
    const timer = setTimeout(
      () => setSpeedIconVisible(true),
      GAME_RULES.speedIconShowDelayMs,
    );
    return () => clearTimeout(timer);
  }, [cornerUspClosedOnce]);

  useGameLoop(
    (tickSeconds) => {
      const speed = isSpeedActive
        ? GAME_RULES.speedUpSpeed
        : GAME_RULES.normalSpeed;
      const prevPos = robotPosRef.current;
      let nextPos = prevPos;

      if (direction !== 'stop') {
        const candidate = { ...prevPos };
        if (direction === 'left') candidate.x -= speed;
        else if (direction === 'right') candidate.x += speed;
        else if (direction === 'up') candidate.y -= speed;
        else if (direction === 'down') candidate.y += speed;

        nextPos = findCollidingWall(candidate, config.walls)
          ? prevPos
          : candidate;
      }

      robotPosRef.current = nextPos;
      setRobotPos(nextPos);

      if (isSpeedActive) {
        speedSecondsLeftRef.current = tickSpeedSecondsLeft(
          speedSecondsLeftRef.current,
          tickSeconds,
        );
        if (speedSecondsLeftRef.current <= 0) setIsSpeedActive(false);
      }

      const dustIndex = findFirstUncollectedWithinRadius(
        nextPos,
        config.dust,
        collectedDust,
        GAME_RULES.pickupRadius,
      );
      if (dustIndex !== null) {
        setCollectedDust((prev) => new Set(prev).add(dustIndex));
      }

      if (
        cornerIconVisible &&
        !cornerIconCollected &&
        distance(nextPos, config.eventItem) <= GAME_RULES.pickupRadius
      ) {
        setCornerIconCollected(true);
        setUsp('corner');
      }

      if (
        speedIconVisible &&
        !speedIconCollected &&
        distance(nextPos, config.speedIcon) <= GAME_RULES.pickupRadius
      ) {
        setSpeedIconCollected(true);
        setUsp('speed');
      }

      const eventDustIndex = findFirstUncollectedWithinRadius(
        nextPos,
        config.eventDust,
        collectedEventDust,
        GAME_RULES.pickupRadius,
      );
      if (eventDustIndex !== null) {
        if (cornerIconCollected) {
          setCollectedEventDust((prev) => new Set(prev).add(eventDustIndex));
          touchingEventDustRef.current = true;
        } else if (!touchingEventDustRef.current) {
          touchingEventDustRef.current = true;
          playSound('oops');
        }
      } else {
        touchingEventDustRef.current = false;
      }

      setGameTimeUnits((prev) => {
        const next = prev + GAME_RULES.timeUnitsPerTick;
        if (next >= GAME_RULES.endTimeUnits) {
          setStatus('fail');
          return GAME_RULES.endTimeUnits;
        }
        return next;
      });
    },
    { fps: STAGE_FPS, paused: !isPlaying },
  );

  useEffect(() => {
    if (status === 'playing' && collectedCount >= totalDustCount) {
      setStatus('clear');
    }
  }, [collectedCount, totalDustCount, status]);

  return {
    status,
    usp,
    closeUsp,
    direction,
    robotPos,
    remainingDust: config.dust.filter((_, i) => !collectedDust.has(i)),
    remainingEventDust: config.eventDust.filter(
      (_, i) => !collectedEventDust.has(i),
    ),
    cornerIconVisible: cornerIconVisible && !cornerIconCollected,
    speedIconVisible: speedIconVisible && !speedIconCollected,
    isSpeedActive,
    scorePercent,
    timeLeftSeconds,
  };
}
