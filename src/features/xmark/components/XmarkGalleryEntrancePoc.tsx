import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import { XMARK_GALLERY_ITEMS } from '../helper/xmarkGalleryData';

import '../xmark.css';

// Portfolio/gallery/Thumb.as의 inThumb()/ThumbManager.as 그대로 옮긴 값.
// - 시작 상태: y=500(아래), alpha=0 (Thumb.as의 setting())
// - 트윈: 2초, rotationX 360, rotationY는 1바퀴 또는 2바퀴 랜덤(Math.ceil(Math.random()*1+1) * 360),
//   ease Back.easeOut, 목표 x/y/alpha:1 (Thumb.as의 inThumb())
// - 순서: ArrayUtil.shuffle 후 2프레임(30fps 기준 약 66.7ms)마다 한 개씩 시작 (ThumbManager.as)
const ENTRANCE_DURATION_SECONDS = 2;
const ENTRANCE_STAGGER_SECONDS = 2 / 30; // 30fps에서 2프레임 간격
const START_Y_OFFSET = 60; // 원본의 절대 y=500과 동일한 효과(아래에서 떠오르며 등장)를 상대 오프셋으로 표현

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function XmarkGalleryEntrancePoc() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const thumbs = Array.from(
      container.querySelectorAll<HTMLElement>('.xmark-poc-thumb'),
    );
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });

    gsap.set(thumbs, {
      y: START_Y_OFFSET,
      autoAlpha: 0,
      rotationX: 0,
      rotationY: 0,
    });

    const order = shuffle(thumbs);
    order.forEach((el, i) => {
      timeline.to(
        el,
        {
          y: 0,
          autoAlpha: 1,
          rotationX: 360,
          rotationY: Math.ceil(Math.random() * 1 + 1) * 360,
          duration: ENTRANCE_DURATION_SECONDS,
          ease: 'back.out(1.7)',
        },
        i * ENTRANCE_STAGGER_SECONDS,
      );
    });

    return () => {
      timeline.kill();
    };
  }, []);

  const sampleItems = XMARK_GALLERY_ITEMS.slice(0, 12);

  return (
    <div className="xmark-poc-wrapper">
      <p className="xmark-poc-label">
        갤러리 썸네일 3D 등장 (Thumb.as inThumb / ThumbManager.as 타이밍 재현,
        2초 반복)
      </p>
      <div ref={containerRef} className="xmark-poc-grid">
        {sampleItems.map((item) => (
          <div key={item.id} className="xmark-poc-thumb">
            <img src={item.thumb} alt={item.title} />
          </div>
        ))}
      </div>
    </div>
  );
}
