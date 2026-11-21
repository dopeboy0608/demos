import { Typography } from 'antd';

import type { HombotWinner, PrizeWinner } from '../helper/types';

const { Title } = Typography;

interface WinnerListProps {
  hombotWinner: HombotWinner;
  prizeWinners: PrizeWinner[];
}

export function WinnerList({ hombotWinner, prizeWinners }: WinnerListProps) {
  return (
    <section className="roboking-panel">
      <Title level={4} className="roboking-panel-title">
        WINNERS
      </Title>
      <div className="roboking-hombot-winner">
        <img
          src={hombotWinner.thumb}
          alt={hombotWinner.id}
          width={34}
          height={34}
        />
        <span>{hombotWinner.id}</span>
        <span className="roboking-hombot-winner-label">HOM-BOT</span>
      </div>
      <ul className="roboking-prize-winner-list">
        {prizeWinners.map((winner) => (
          <li key={winner.id} className="roboking-prize-winner-item">
            <img src={winner.thumb} alt={winner.id} width={34} height={34} />
            <span>{winner.id}</span>
            <span className="roboking-prize-winner-date">{winner.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
