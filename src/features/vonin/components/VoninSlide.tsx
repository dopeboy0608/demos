import { useState } from 'react';

import { useAutoRotate } from '../hooks/useAutoRotate';
import { VONIN_SLIDES } from '../helper/voninMainData';

// Slide.as 그대로: 5초 자동 롤링(ROLL_OVER 시 정지/ROLL_OUT 시 재개), 좌우/번호 버튼으로
// 전환, 0.5초 슬라이드 트윈(Tweener.addTween time:0.5). 폭 359px 필름스트립을 translateX로
// 밀어내는 방식으로 재현.
const SLIDE_INTERVAL_MS = 5000;
const SLIDE_WIDTH_PX = 359;

export function VoninSlide() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % VONIN_SLIDES.length);
  const goPrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + VONIN_SLIDES.length) % VONIN_SLIDES.length,
    );

  const { pause, resume } = useAutoRotate(SLIDE_INTERVAL_MS, goNext);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 호버로 자동 롤링을 멈추는 마우스 전용 편의 기능(원본의 ROLL_OVER/ROLL_OUT)이고, 좌우/번호 버튼으로 키보드 조작이 가능하다.
    <div className="vonin-slide" onMouseEnter={pause} onMouseLeave={resume}>
      <div className="vonin-slide-viewport">
        <div
          className="vonin-slide-track"
          style={{
            transform: `translateX(${-activeIndex * SLIDE_WIDTH_PX}px)`,
          }}
        >
          {VONIN_SLIDES.map((slide) => (
            <img
              key={slide.id}
              src={slide.img}
              alt="이벤트 배너"
              className="vonin-slide-img"
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="vonin-slide-arrow vonin-slide-arrow-left"
        onClick={goPrev}
      >
        ◀
      </button>
      <button
        type="button"
        className="vonin-slide-arrow vonin-slide-arrow-right"
        onClick={goNext}
      >
        ▶
      </button>

      <div className="vonin-slide-dots">
        {VONIN_SLIDES.map((slide) => (
          <button
            key={slide.id}
            type="button"
            className={`vonin-slide-dot${slide.id === activeIndex ? ' vonin-slide-dot-active' : ''}`}
            onClick={() => setActiveIndex(slide.id)}
          />
        ))}
      </div>
    </div>
  );
}
