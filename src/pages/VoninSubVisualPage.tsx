import { Link, useParams } from '@tanstack/react-router';

import { VoninSubVisualTemplate } from '@/features/vonin/components/VoninSubVisualTemplate';
import { VONIN_SUB_VISUALS } from '@/features/vonin/helper/voninSubVisualData';

export function VoninSubVisualPage() {
  const { id } = useParams({ from: '/vonin-sub-visual/$id' });
  const visual = VONIN_SUB_VISUALS.find((item) => item.id === Number(id));

  if (!visual) {
    return (
      <div className="vonin-sub-visual-list">
        <h2>서브 비주얼을 찾을 수 없습니다</h2>
        <ul>
          {VONIN_SUB_VISUALS.map((item) => (
            <li key={item.id}>
              <Link to="/vonin-sub-visual/$id" params={{ id: String(item.id) }}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <VoninSubVisualTemplate title={visual.title} />;
}
