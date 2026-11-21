import { Typography } from 'antd';

import type { TopRankingEntry } from '../helper/types';

const { Title } = Typography;

interface RankingListProps {
  entries: TopRankingEntry[];
}

export function RankingList({ entries }: RankingListProps) {
  return (
    <section className="roboking-panel">
      <Title level={4} className="roboking-panel-title">
        RANKING TOP 10
      </Title>
      <ol className="roboking-ranking-list">
        {entries.map((entry, index) => (
          <li key={entry.id} className="roboking-ranking-item">
            <span className="roboking-ranking-rank">{index + 1}</span>
            <img src={entry.thumb} alt={entry.id} width={18} height={18} />
            <span className="roboking-ranking-id">{entry.id}</span>
            <span className="roboking-ranking-score">{entry.score}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
