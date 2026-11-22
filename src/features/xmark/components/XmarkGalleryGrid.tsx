import { gsap } from 'gsap';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { XmarkGalleryThumb } from './XmarkGalleryThumb';
import { shuffleArray } from '../helper/shuffleArray';
import type { XmarkGalleryItem } from '../helper/xmarkGalleryData';

// Portfolio/gallery/Thumb.as(inThumb/outThumb)와 ThumbManager.as(enterFrameHandler) 그대로 옮긴 값.
// 등장: 2초, rotationX 360, rotationY 1~2바퀴 랜덤, ease Back.easeOut.
// 퇴장: 0.5초, rotationX+180, alpha 0, ease Cubic.easeOut(gsap power2.out).
// 등장/퇴장 모두 셔플 후 2프레임(30fps 기준 약 66.7ms) 간격으로 하나씩 시작.
const ENTER_DURATION_SECONDS = 2;
const EXIT_DURATION_SECONDS = 0.5;
const STAGGER_SECONDS = 2 / 30;
const ENTER_START_Y = 60;

export interface XmarkGalleryGridHandle {
  playExit: (onComplete: () => void) => void;
}

interface XmarkGalleryGridProps {
  items: XmarkGalleryItem[];
  onThumbClick: (item: XmarkGalleryItem) => void;
}

export const XmarkGalleryGrid = forwardRef<
  XmarkGalleryGridHandle,
  XmarkGalleryGridProps
>(function XmarkGalleryGrid({ items, onThumbClick }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    playExit(onComplete: () => void) {
      const container = containerRef.current;
      const thumbs = container
        ? shuffleArray(
            Array.from(
              container.querySelectorAll<HTMLElement>('.xmark-gallery-thumb'),
            ),
          )
        : [];

      if (thumbs.length === 0) {
        onComplete();
        return;
      }

      const timeline = gsap.timeline({ onComplete });
      thumbs.forEach((el, i) => {
        timeline.to(
          el,
          {
            rotationX: '+=180',
            autoAlpha: 0,
            duration: EXIT_DURATION_SECONDS,
            ease: 'power2.out',
          },
          i * STAGGER_SECONDS,
        );
      });
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const thumbs = Array.from(
      container.querySelectorAll<HTMLElement>('.xmark-gallery-thumb'),
    );
    if (thumbs.length !== items.length) return;

    gsap.set(thumbs, {
      y: ENTER_START_Y,
      autoAlpha: 0,
      rotationX: 0,
      rotationY: 0,
    });

    const timeline = gsap.timeline();
    const order = shuffleArray(thumbs);
    order.forEach((el, i) => {
      timeline.to(
        el,
        {
          y: 0,
          autoAlpha: 1,
          rotationX: 360,
          rotationY: Math.ceil(Math.random() * 1 + 1) * 360,
          duration: ENTER_DURATION_SECONDS,
          ease: 'back.out(1.7)',
        },
        i * STAGGER_SECONDS,
      );
    });

    return () => {
      timeline.kill();
    };
  }, [items]);

  return (
    <div ref={containerRef} className="xmark-gallery-grid">
      {items.map((item) => (
        <XmarkGalleryThumb key={item.id} item={item} onClick={onThumbClick} />
      ))}
    </div>
  );
});
