import { VONIN_NOTICES } from '../helper/voninMainData';
import { truncateText } from '../helper/voninTruncate';

// Noticeboard.as 그대로: 16자 초과 말줄임, NEW 아이콘(new="y").
export function VoninNoticeboard() {
  return (
    <div className="vonin-noticeboard">
      <div className="vonin-noticeboard-header">
        <span>공지사항</span>
        <span className="vonin-noticeboard-more">more</span>
      </div>
      <ul className="vonin-noticeboard-list">
        {VONIN_NOTICES.map((notice) => (
          <li key={notice.txt} className="vonin-noticeboard-item">
            {notice.isNew && <span className="vonin-noticeboard-new">NEW</span>}
            <span>{truncateText(notice.txt, 16)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
