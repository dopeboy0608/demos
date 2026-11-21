import { WALL_HEIGHT, WALL_WIDTH } from '../helper/stageConfig';
import type { StageConfig } from '../helper/stageConfig';

import '../roboking.css';

interface GameStageProps {
  config: StageConfig;
}

export function GameStage({ config }: GameStageProps) {
  return (
    <div className="roboking-stage">
      <div className="roboking-stage-inner roboking-game-stage">
        <div className="roboking-game-hud">
          <span>TIME: 60</span>
          <span>SCORE: 0</span>
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
