import { Button } from 'antd';

import { useStageGame } from '../hooks/useStageGame';
import { WALL_HEIGHT, WALL_WIDTH } from '../helper/stageConfig';
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
          <span>TIME: {game.timeLeftSeconds}</span>
          <span>SCORE: {game.scorePercent}%</span>
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
          {game.remainingDust.map((dust) => (
            <div
              key={dust.id}
              className="roboking-dust"
              style={{ left: dust.x, top: dust.y }}
            />
          ))}
          {game.remainingEventDust.map((dust) => (
            <div
              key={dust.id}
              className="roboking-event-dust"
              style={{ left: dust.x, top: dust.y }}
            />
          ))}
          {game.cornerIconVisible && (
            <div
              className="roboking-event-item"
              style={{ left: config.eventItem.x, top: config.eventItem.y }}
              title={config.eventItem.name}
            />
          )}
          {game.speedIconVisible && (
            <div
              className="roboking-speed-item"
              style={{ left: config.speedIcon.x, top: config.speedIcon.y }}
              title="speed_icon"
            />
          )}
          {game.dogPos && (
            <div
              className="roboking-dog"
              style={{ left: game.dogPos.x, top: game.dogPos.y }}
            />
          )}
          <div
            className={
              game.isSpeedActive
                ? 'roboking-robot roboking-robot-speed'
                : 'roboking-robot'
            }
            style={{ left: game.robotPos.x, top: game.robotPos.y }}
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
