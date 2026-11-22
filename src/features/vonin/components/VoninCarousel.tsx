import { useRef, useState } from 'react';

import { VONIN_CAROUSEL_PRODUCTS } from '../helper/voninCarouselData';
import { rotateCarousel } from '../helper/voninCarouselRotation';
import { useAutoRotate } from '../hooks/useAutoRotate';
import { useCarouselWheel } from '../hooks/useCarouselWheel';
import { useFlipRotation } from '../hooks/useFlipRotation';

// Contents.as의 roll()/slide()/backslide() 그대로: 3초마다 자동으로 한 칸 회전하고,
// 캐러셀 영역 위에서 휠을 돌리면(deltaY>0=다음/deltaY<0=이전) 한 칸씩 더 이동한다. 휠 입력이
// 들어오면 자동 회전을 잠시 멈췄다가(원본의 timer.stop()) 전환이 끝나면 다시 재개한다
// (원본의 mcControl()에서 timer.start()).
const VISIBLE_SLOTS = 7;
const AUTO_ROTATE_INTERVAL_MS = 3000;
const WHEEL_PAUSE_RESUME_DELAY_MS = 500;

export function VoninCarousel() {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visible = rotateCarousel(VONIN_CAROUSEL_PRODUCTS, offset).slice(
    0,
    VISIBLE_SLOTS,
  );

  const { pause, resume } = useAutoRotate(AUTO_ROTATE_INTERVAL_MS, () => {
    setOffset((prev) => prev + 1);
  });

  const wheelRef = useCarouselWheel((direction) => {
    pause();
    setOffset((prev) => prev + direction);
    setTimeout(resume, WHEEL_PAUSE_RESUME_DELAY_MS);
  });

  useFlipRotation(containerRef, [offset]);

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        wheelRef(el);
      }}
      className="vonin-carousel"
    >
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
  );
}
