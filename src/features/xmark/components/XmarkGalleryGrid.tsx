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
// #71 FR-06~08: 카드가 뷰포트 위/아래(화면 밖)에서 나타나거나 사라지도록, 각 카드의 실제 화면상
// y좌표 기준으로 "뷰포트 경계 + 여유값"까지의 거리를 오프셋으로 계산한다(행마다 필요한 거리가 달라
// 고정값 하나로는 표현할 수 없음). 등장 시작 위치(아래/위)와 퇴장 목표 위치(위/아래)에 동일한
// 계산을 재사용한다.
const OFFSCREEN_BUFFER_PX = 40;

function computeOffscreenOffset(
  target: HTMLElement,
  towards: 'below' | 'above',
): number {
  const rect = target.getBoundingClientRect();
  return towards === 'below'
    ? window.innerHeight - rect.top + OFFSCREEN_BUFFER_PX
    : -(rect.top + rect.height + OFFSCREEN_BUFFER_PX);
}
// #71 FR-05: 마우스 위치에 따른 컨테이너 3D 패럴럭스. 컨테이너 중심에서 가장자리까지 이동했을 때
// 도달하는 최대 회전각(과하지 않으면서 입체감은 느껴지는 수준으로 임의 조정 가능한 값).
const MOUSE_TILT_MAX_DEGREES = 12;
const MOUSE_TILT_DURATION_SECONDS = 0.6;

// 휠업(다음 페이지)은 기존 카드가 위로 사라지고 새 카드가 아래에서 올라옴(FR-07),
// 휠다운(이전 페이지)은 그 반대로 아래로 사라지고 위에서 내려옴(FR-08).
export type XmarkGalleryTransitionDirection = 'forward' | 'backward';

export interface XmarkGalleryGridHandle {
  playExit: (
    onComplete: () => void,
    direction: XmarkGalleryTransitionDirection,
  ) => void;
}

interface XmarkGalleryGridProps {
  items: XmarkGalleryItem[];
  onThumbClick: (item: XmarkGalleryItem) => void;
  enterDirection: XmarkGalleryTransitionDirection;
}

export const XmarkGalleryGrid = forwardRef<
  XmarkGalleryGridHandle,
  XmarkGalleryGridProps
>(function XmarkGalleryGrid({ items, onThumbClick, enterDirection }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    playExit(onComplete, direction) {
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

      // forward(다음 페이지)는 위로, backward(이전 페이지)는 아래로 사라진다.
      const exitTowards = direction === 'forward' ? 'above' : 'below';

      const timeline = gsap.timeline({ onComplete });
      thumbs.forEach((el, i) => {
        timeline.to(
          el,
          {
            y: computeOffscreenOffset(el, exitTowards),
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

    // forward(다음 페이지로 이동했거나 최초 진입)는 아래에서, backward(이전 페이지로
    // 이동)는 위에서 등장한다.
    const enterFrom = enterDirection === 'forward' ? 'below' : 'above';

    gsap.set(thumbs, {
      y: (_index, target: HTMLElement) =>
        computeOffscreenOffset(target, enterFrom),
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
  }, [items, enterDirection]);

  // 마우스 위치에 따라 카드 10장을 담는 컨테이너(.xmark-gallery-grid) 전체를 3D로 기울인다.
  // 회전 중심(피벗)은 transform-origin 기본값(50% 50%, 컨테이너 중앙)을 그대로 사용한다.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const quickSetRotationX = gsap.quickTo(container, 'rotationX', {
      duration: MOUSE_TILT_DURATION_SECONDS,
      ease: 'power3.out',
    });
    const quickSetRotationY = gsap.quickTo(container, 'rotationY', {
      duration: MOUSE_TILT_DURATION_SECONDS,
      ease: 'power3.out',
    });

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const offsetX =
        (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const offsetY =
        (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const clampedX = Math.max(-1, Math.min(1, offsetX));
      const clampedY = Math.max(-1, Math.min(1, offsetY));

      quickSetRotationY(clampedX * MOUSE_TILT_MAX_DEGREES);
      quickSetRotationX(-clampedY * MOUSE_TILT_MAX_DEGREES);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="xmark-gallery-grid">
      {items.map((item) => (
        <XmarkGalleryThumb key={item.id} item={item} onClick={onThumbClick} />
      ))}
    </div>
  );
});
