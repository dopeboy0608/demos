import { useState } from 'react';

import {
  VONIN_BEST_REMARK,
  VONIN_BM,
  VONIN_QA,
  VONIN_RSS,
} from '../helper/voninMainData';
import { truncateText } from '../helper/voninTruncate';

// Best.as/Bm.as/Rss.as/Qa.as/Write.as 그대로: 각 영역별 말줄임 글자수(후기 30자/상품평 10자/
// BM 22자/RSS 20자/QA 18자)와 별점(1~5). Write는 화면만 표시, 실제 전송(goWrite) 없음
// (결정 사항 참고).
export function VoninCafeView() {
  const [writeText, setWriteText] = useState('');

  return (
    <div className="vonin-cafe">
      <div className="vonin-cafe-best">
        <img src={VONIN_BEST_REMARK.img} alt={VONIN_BEST_REMARK.title} />
        <div className="vonin-cafe-best-title">{VONIN_BEST_REMARK.title}</div>
        <p className="vonin-cafe-best-txt">
          {truncateText(VONIN_BEST_REMARK.txt, 30)}
        </p>
        <ul className="vonin-cafe-best-products">
          {VONIN_BEST_REMARK.products.map((product) => (
            <li key={product.id}>
              <span className="vonin-cafe-star">
                {'★'.repeat(product.star)}
              </span>
              <strong>{product.title}</strong>
              <span>{truncateText(product.txt, 10, '..')}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="vonin-cafe-column">
        <h4>Talk with BM</h4>
        <ul>
          {VONIN_BM.map((item) => (
            <li key={item.id}>{truncateText(item.txt, 22)}</li>
          ))}
        </ul>
      </div>

      <div className="vonin-cafe-column">
        <h4>Vonin RSS</h4>
        <ul>
          {VONIN_RSS.map((item) => (
            <li key={item.id}>{truncateText(item.txt, 20, '..')}</li>
          ))}
        </ul>
      </div>

      <div className="vonin-cafe-column">
        <h4>Grooming QA</h4>
        <ul>
          {VONIN_QA.map((item) => (
            <li key={item.id}>{truncateText(item.txt, 18)}</li>
          ))}
        </ul>
      </div>

      <div className="vonin-cafe-write">
        <h4>글쓰기</h4>
        <textarea
          value={writeText}
          onChange={(event) => setWriteText(event.target.value)}
          placeholder="내용을 입력하세요"
        />
        <button type="button">등록</button>
      </div>
    </div>
  );
}
