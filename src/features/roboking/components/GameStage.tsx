import { useRef, useState } from 'react';

import { useGameLoop } from '../hooks/useGameLoop';
import { useGamePause } from '../hooks/useGamePause';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { playSound } from '../helper/soundManager';
import { WALL_HEIGHT, WALL_WIDTH } from '../helper/stageConfig';
import type { StageConfig } from '../helper/stageConfig';

import '../roboking.css';

interface GameStageProps {
  config: StageConfig;
}

const STAGE_FPS = 48;

export function GameStage({ config }: GameStageProps) {
  const { isPaused } = useGamePause();
  const { direction } = useKeyboardControls({
    onSpaceDown: () => playSound('oops'),
  });

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const elapsedRef = useRef(0);

  useGameLoop(
    (tickSeconds) => {
      elapsedRef.current += tickSeconds;
      setElapsedSeconds(Math.floor(elapsedRef.current * 10) / 10);
    },
    { fps: STAGE_FPS, paused: isPaused },
  );

  return (
    <div className="roboking-stage">
      <div className="roboking-stage-inner roboking-game-stage">
        <div className="roboking-game-hud">
          <span>TIME: 60</span>
          <span>SCORE: 0</span>
        </div>
        <div className="roboking-game-debug-hud">
          DEBUG(04) — elapsed: {elapsedSeconds.toFixed(1)}s / direction:{' '}
          {direction} / paused: {String(isPaused)} (스페이스로 OOPS 사운드
          테스트)
        </div>
        <div className="roboking-game-field">
          {config.walls.map((wall) => (
            <div
              key={wall.name}
              className="roboking-wall"
              style={{
                width: WALL_WIDTH,
                height: WALL_HEIGHT,
                transform: `matrix(${wall.a}, ${wall.b}, ${wall.c}, ${wall.d}, ${wall.tx}, ${wall.ty})`,
              }}
            />
          ))}
          {config.dust.map((dust) => (
            <div
              key={`dust-${dust.x}-${dust.y}`}
              className="roboking-dust"
              style={{ left: dust.x, top: dust.y }}
            />
          ))}
          {config.eventDust.map((dust) => (
            <div
              key={`event-dust-${dust.x}-${dust.y}`}
              className="roboking-event-dust"
              style={{ left: dust.x, top: dust.y }}
            />
          ))}
          <div
            className="roboking-event-item"
            style={{ left: config.eventItem.x, top: config.eventItem.y }}
            title={config.eventItem.name}
          />
          <div
            className="roboking-robot"
            style={{ left: config.robotStart.x, top: config.robotStart.y }}
          />
        </div>
      </div>
    </div>
  );
}
