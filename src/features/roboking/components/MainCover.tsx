import { Button, Typography } from 'antd';

import { GameVideo } from './GameVideo';
import { HowToPlay } from './HowToPlay';
import { RankingList } from './RankingList';
import { WinnerList } from './WinnerList';
import { useRobokingCover } from '../hooks/useRobokingCover';
import { topWinnerList } from '../api/topWinnerList';

import '../roboking.css';

const { Title } = Typography;

interface MainCoverProps {
  onStart: () => void;
}

export function MainCover({ onStart }: MainCoverProps) {
  const { handleStart } = useRobokingCover(onStart);

  return (
    <div className="roboking-stage">
      <div className="roboking-stage-inner">
        <Title level={2} className="roboking-title">
          HOM-BOT ROBOKING
        </Title>
        <div className="roboking-panel-grid">
          <RankingList entries={topWinnerList.top} />
          <WinnerList
            hombotWinner={topWinnerList.hombotWinner}
            prizeWinners={topWinnerList.prizeWinner}
          />
          <HowToPlay />
          <GameVideo />
        </div>
        <Button
          type="primary"
          size="large"
          className="roboking-start-button"
          onClick={handleStart}
        >
          START
        </Button>
      </div>
    </div>
  );
}
