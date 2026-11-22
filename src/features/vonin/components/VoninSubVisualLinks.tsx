import { Link } from '@tanstack/react-router';

import { VONIN_SUB_VISUALS } from '../helper/voninSubVisualData';

// 서브 비주얼 5종은 원본 호스트 페이지가 없어 가상의 서브 페이지로 배치했다(결정 사항 참고).
// 데모에서 바로 찾아볼 수 있도록 홈 화면에 링크를 모아 둔다.
export function VoninSubVisualLinks() {
  return (
    <div className="vonin-sub-visual-links">
      <span className="vonin-sub-visual-links-label">서브 비주얼</span>
      {VONIN_SUB_VISUALS.map((visual) => (
        <Link
          key={visual.id}
          to="/vonin-sub-visual/$id"
          params={{ id: String(visual.id) }}
          className="vonin-sub-visual-link"
        >
          {visual.title}
        </Link>
      ))}
    </div>
  );
}
