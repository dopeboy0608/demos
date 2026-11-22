import { VONIN_SLIDES } from '../helper/voninMainData';

// Slide.as 그대로의 정적 렌더링(1번째 배너만 표시). 자동 롤링/좌우 버튼은 서브태스크 04/05에서 연결.
export function VoninSlide() {
  return (
    <div className="vonin-slide">
      <img
        src={VONIN_SLIDES[0].img}
        alt="이벤트 배너"
        className="vonin-slide-img"
      />
      <div className="vonin-slide-dots">
        {VONIN_SLIDES.map((slide) => (
          <span
            key={slide.id}
            className={`vonin-slide-dot${slide.id === 0 ? ' vonin-slide-dot-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
