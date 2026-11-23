import { useCallback, useEffect, useRef, useState } from 'react';

import { useGameLoop } from './useGameLoop';
import { useGamePause } from './useGamePause';
import { useKeyboardControls } from './useKeyboardControls';
import {
  distance,
  findCollidingWall,
  findFirstUncollectedWithinRadius,
} from '../helper/collision';
import { pickRandomDirection } from '../helper/directionUtil';
import { playSound } from '../helper/soundManager';
import { tickSpeedSecondsLeft } from '../helper/speedTimer';
import { GAME_RULES, STAGE_HEIGHT, STAGE_WIDTH } from '../helper/stageConfig';
import type { Point, StageConfig } from '../helper/stageConfig';
import type { RobotDirection } from '../helper/types';

export type StageStatus = 'playing' | 'clear' | 'fail';
export type UspKind = 'corner' | 'speed' | null;

const STAGE_FPS = 48;

/**
 * 스테이지 공통 게임 로직. `kitchen|living|bed`의 `RoboKing.as` + `StageMain.as`를
 * `StageConfig`로 일반화해 옮긴다. `config.dog`가 있으면(침실) `bed/Dog.as`의
 * 로밍 + 이벤트 먼지 산포 로직도 같이 처리한다.
 */
export function useStageGame(config: StageConfig) {
  const { isPaused: isTabPaused } = useGamePause();

  const [status, setStatus] = useState<StageStatus>('playing');
  const [usp, setUsp] = useState<UspKind>(null);

  const [robotPos, setRobotPos] = useState<Point>(config.robotStart);
  const robotPosRef = useRef<Point>(config.robotStart);

  const [collectedDust, setCollectedDust] = useState<ReadonlySet<number>>(
    new Set(),
  );

  const [eventDustPoints, setEventDustPoints] = useState<Point[]>(
    config.eventDust,
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

  const [dogPos, setDogPos] = useState<Point | null>(config.dog?.start ?? null);
  const [dogVisible, setDogVisible] = useState(false);

  const speedSecondsLeftRef = useRef(0);
  const touchingEventDustRef = useRef(false);

  const dogPosRef = useRef<Point | null>(config.dog?.start ?? null);
  const dogDirectionRef = useRef<RobotDirection>(pickRandomDirection());
  const dogDropAccumulatorRef = useRef(0);

  const isPlaying = status === 'playing' && usp === null && !isTabPaused;

  const collectedCount = collectedDust.size + collectedEventDust.size;
  const scorePercent = Math.floor((collectedCount / config.totalDust) * 100);
  const totalSeconds =
    GAME_RULES.endTimeUnits / GAME_RULES.timeUnitsPerTick / STAGE_FPS;
  const timeLeftSeconds = Math.max(
    0,
    Math.ceil(
      (GAME_RULES.endTimeUnits - gameTimeUnits) /
        GAME_RULES.timeUnitsPerTick /
        STAGE_FPS,
    ),
  );
  // CLEAR/TIME 게이지 UI(#86)에 쓰는 퍼센트. 시간은 남은 비율(가득 찬 상태로 시작해 줄어듦)로
  // 보여준다.
  const timePercent = Math.max(
    0,
    Math.round((timeLeftSeconds / totalSeconds) * 100),
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

  // 코너/캐럿/펫 아이콘은 원본처럼 시작 4초 후 등장(실제 시간 기준 setTimeout).
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

  // 침실 Dog: 5초 후 등장(원본 setTimeout(startMakeEventDust, 5000)).
  useEffect(() => {
    if (!config.dog) return;
    const timer = setTimeout(() => setDogVisible(true), config.dog.showDelayMs);
    return () => clearTimeout(timer);
  }, [config.dog]);

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
        eventDustPoints,
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

      if (config.dog && dogVisible && dogPosRef.current) {
        const dogSpeed = config.dog.speed;
        const candidate = { ...dogPosRef.current };
        if (dogDirectionRef.current === 'left') candidate.x -= dogSpeed;
        else if (dogDirectionRef.current === 'right') candidate.x += dogSpeed;
        else if (dogDirectionRef.current === 'up') candidate.y -= dogSpeed;
        else if (dogDirectionRef.current === 'down') candidate.y += dogSpeed;

        const isOutOfStageBounds =
          candidate.x < 0 ||
          candidate.x > STAGE_WIDTH ||
          candidate.y < 0 ||
          candidate.y > STAGE_HEIGHT;

        if (isOutOfStageBounds || findCollidingWall(candidate, config.walls)) {
          dogDirectionRef.current = pickRandomDirection();
        } else {
          dogPosRef.current = candidate;
          setDogPos(candidate);
        }

        dogDropAccumulatorRef.current += tickSeconds;
        if (dogDropAccumulatorRef.current >= config.dog.dustIntervalMs / 1000) {
          dogDropAccumulatorRef.current = 0;
          const dropPosition = dogPosRef.current;
          setEventDustPoints((prev) => {
            if (prev.length >= (config.dog?.maxDust ?? 0)) return prev;
            const next = [...prev, dropPosition];
            if (next.length >= (config.dog?.maxDust ?? 0)) setDogVisible(false);
            return next;
          });
        }
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
    if (status === 'playing' && collectedCount >= config.totalDust) {
      setStatus('clear');
    }
  }, [collectedCount, config.totalDust, status]);

  return {
    status,
    usp,
    closeUsp,
    direction,
    robotPos,
    // id = 원본 배열 인덱스. 좌표가 아니라 인덱스로 key를 주는 이유: bed는 Dog가 같은
    // 좌표에 이벤트 먼지를 두 번 떨어뜨릴 수 있어(벽에 막혀 제자리인 경우) 좌표 기반 key가
    // 중복될 수 있다.
    remainingDust: config.dust
      .map((point, id) => ({ id, ...point }))
      .filter(({ id }) => !collectedDust.has(id)),
    remainingEventDust: eventDustPoints
      .map((point, id) => ({ id, ...point }))
      .filter(({ id }) => !collectedEventDust.has(id)),
    cornerIconVisible: cornerIconVisible && !cornerIconCollected,
    speedIconVisible: speedIconVisible && !speedIconCollected,
    isSpeedActive,
    dogPos: dogVisible ? dogPos : null,
    scorePercent,
    timeLeftSeconds,
    timePercent,
  };
}
