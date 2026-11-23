import { Button } from 'antd';

import { useStageGame } from '../hooks/useStageGame';
import { directionToRotationDeg } from '../helper/directionUtil';
import {
  BACKGROUND_HEIGHT,
  BACKGROUND_OFFSET,
  BACKGROUND_WIDTH,
  DUST_HEIGHT,
  DUST_IMAGE,
  DUST_WIDTH,
  ICON_SIZE,
  ROBOT_HEIGHT,
  ROBOT_IMAGE,
  ROBOT_WIDTH,
  SPEED_ICON_IMAGE,
  WALL_HEIGHT,
  WALL_WIDTH,
} from '../helper/stageConfig';
import type { StageConfig } from '../helper/stageConfig';

import '../roboking.css';

interface GameStageProps {
  config: StageConfig;
  clearLabel: string;
  onClear: (scorePercent: number) => void;
  onRetry: () => void;
  onExitToMain: () => void;
}

export function GameStage({
  config,
  clearLabel,
  onClear,
  onRetry,
  onExitToMain,
}: GameStageProps) {
  const game = useStageGame(config);

  return (
    <div className="roboking-stage">
      <div className="roboking-stage-inner roboking-game-stage">
        <div className="roboking-game-hud">
          <div className="roboking-hud-gauge">
            <span className="roboking-hud-label">CLEAR</span>
            <div className="roboking-hud-bar">
              <div
                className="roboking-hud-bar-fill roboking-hud-bar-fill--clear"
                style={{ width: `${game.scorePercent}%` }}
              />
            </div>
            <span className="roboking-hud-value">{game.scorePercent}%</span>
          </div>
          <div className="roboking-hud-gauge">
            <span className="roboking-hud-label">TIME</span>
            <div className="roboking-hud-bar">
              <div
                className="roboking-hud-bar-fill roboking-hud-bar-fill--time"
                style={{ width: `${game.timePercent}%` }}
              />
            </div>
            <span className="roboking-hud-value">{game.timeLeftSeconds}s</span>
          </div>
        </div>
        <div className="roboking-game-field">
          <img
            src={config.backgroundImage}
            alt=""
            className="roboking-stage-bg"
            style={{
              left: BACKGROUND_OFFSET.x,
              top: BACKGROUND_OFFSET.y,
              width: BACKGROUND_WIDTH,
              height: BACKGROUND_HEIGHT,
            }}
          />
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
          {game.remainingDust.map((dust) => (
            <img
              key={dust.id}
              src={DUST_IMAGE}
              alt=""
              className="roboking-dust"
              width={DUST_WIDTH}
              height={DUST_HEIGHT}
              style={{ left: dust.x, top: dust.y }}
            />
          ))}
          {game.remainingEventDust.map((dust) => (
            <img
              key={dust.id}
              src={DUST_IMAGE}
              alt=""
              className="roboking-event-dust"
              width={DUST_WIDTH}
              height={DUST_HEIGHT}
              style={{ left: dust.x, top: dust.y }}
            />
          ))}
          {game.cornerIconVisible && (
            <img
              src={config.eventItem.image}
              alt={config.eventItem.name}
              className="roboking-event-item"
              width={ICON_SIZE}
              height={ICON_SIZE}
              style={{ left: config.eventItem.x, top: config.eventItem.y }}
            />
          )}
          {game.speedIconVisible && (
            <img
              src={SPEED_ICON_IMAGE}
              alt="speed_icon"
              className="roboking-speed-item"
              width={ICON_SIZE}
              height={ICON_SIZE}
              style={{ left: config.speedIcon.x, top: config.speedIcon.y }}
            />
          )}
          {game.dogPos && (
            <div
              className="roboking-dog"
              style={{ left: game.dogPos.x, top: game.dogPos.y }}
            />
          )}
          <img
            src={ROBOT_IMAGE}
            alt="robot"
            width={ROBOT_WIDTH}
            height={ROBOT_HEIGHT}
            className={
              game.isSpeedActive
                ? 'roboking-robot roboking-robot-speed'
                : 'roboking-robot'
            }
            style={{
              left: game.robotPos.x,
              top: game.robotPos.y,
              transform: `translate(-50%, -50%) rotate(${directionToRotationDeg(game.direction)}deg)`,
            }}
          />
        </div>

        {game.usp && (
          <div className="roboking-popup-overlay">
            <div className="roboking-popup">
              <p>
                {game.usp === 'corner'
                  ? '아이템을 획득했습니다! 이제 이벤트 먼지를 흡입할 수 있습니다.'
                  : '스피드업 아이템을 획득했습니다! 스페이스바로 10초간 빠르게 이동할 수 있습니다.'}
              </p>
              <Button type="primary" onClick={game.closeUsp}>
                확인
              </Button>
            </div>
          </div>
        )}

        {game.status === 'clear' && (
          <div className="roboking-popup-overlay">
            <div className="roboking-popup">
              <p>STAGE CLEAR! (SCORE {game.scorePercent}%)</p>
              <Button type="primary" onClick={() => onClear(game.scorePercent)}>
                {clearLabel}
              </Button>
            </div>
          </div>
        )}

        {game.status === 'fail' && (
          <div className="roboking-popup-overlay">
            <div className="roboking-popup">
              <p>TIME OVER</p>
              <Button type="primary" onClick={onRetry}>
                재도전
              </Button>
              <Button onClick={onExitToMain}>메인으로</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
