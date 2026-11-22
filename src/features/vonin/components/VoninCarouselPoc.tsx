import { useRef, useState } from 'react';

import { VONIN_CAROUSEL_PRODUCTS } from '../helper/voninCarouselData';
import { rotateCarousel } from '../helper/voninCarouselRotation';
import { useFlipRotation } from '../hooks/useFlipRotation';

import '../vonin.css';

const VISIBLE_SLOTS = 7;

// 서브태스크 03 PoC: Ruffle 녹화 대신 Contents.as 소스에서 추출한 타이밍(위치 0.5초,
// 알파 0.3초)을 FLIP 기법으로 재현해 실현 가능성을 검증한다. 좌우 버튼으로 캐러셀을 회전시키며
// 애니메이션을 확인한다.
export function VoninCarouselPoc() {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visible = rotateCarousel(VONIN_CAROUSEL_PRODUCTS, offset).slice(
    0,
    VISIBLE_SLOTS,
  );

  useFlipRotation(containerRef, [offset]);

  return (
    <div className="vonin-poc-wrapper">
      <p className="vonin-poc-label">
        캐러셀 회전 PoC (Contents.as의 0.5초 위치/0.3초 알파 타이밍을 FLIP
        기법으로 재현)
      </p>
      <div className="vonin-poc-controls">
        <button type="button" onClick={() => setOffset((prev) => prev - 1)}>
          ◀ 이전
        </button>
        <button type="button" onClick={() => setOffset((prev) => prev + 1)}>
          다음 ▶
        </button>
      </div>
      <div ref={containerRef} className="vonin-carousel">
        {visible.map((product, index) => (
          <div
            key={product.id}
            data-flip-id={product.id}
            className={`vonin-carousel-item${index === 0 ? ' vonin-carousel-item-front' : ''}`}
          >
            <img src={product.img} alt={product.label} />
            <span>{product.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
