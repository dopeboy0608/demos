import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';

// Contents.as의 slide()/backslide()/roll()이 각 아이템을 0.5초(x/y)·0.3초(alpha) 트윈으로
// 새 위치로 옮기는 것과 동일한 결과를 FLIP(First-Last-Invert-Play) 기법으로 재현한다.
// 원본은 구형 바이너리 FLA라 정확한 좌표를 추출할 수 없어(알려진 한계), 레이아웃이 이미
// 정해 놓은 최종 위치로 DOM이 재배치된 뒤 "그 전 위치에서 왔다"는 착시만 애니메이션으로 만든다.
const POSITION_DURATION_SECONDS = 0.5;
const ALPHA_DURATION_SECONDS = 0.3;

export function useFlipRotation(
  containerRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList,
) {
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const isFirstRunRef = useRef(true);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>('[data-flip-id]'),
    );
    const prevRects = prevRectsRef.current;

    if (!isFirstRunRef.current) {
      for (const el of items) {
        const id = el.dataset.flipId;
        if (!id) continue;
        const prevRect = prevRects.get(id);
        const nextRect = el.getBoundingClientRect();

        if (prevRect) {
          const dx = prevRect.left - nextRect.left;
          const dy = prevRect.top - nextRect.top;
          gsap.fromTo(
            el,
            { x: dx, y: dy },
            {
              x: 0,
              y: 0,
              duration: POSITION_DURATION_SECONDS,
              ease: 'power2.out',
            },
          );
        } else {
          // 새로 들어온 아이템(배열 끝/앞에서 진입): Contents.as의 alpha 0→1과 동일.
          gsap.fromTo(
            el,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: ALPHA_DURATION_SECONDS,
              ease: 'power2.out',
            },
          );
        }
      }
    }

    const nextRects = new Map<string, DOMRect>();
    for (const el of items) {
      const id = el.dataset.flipId;
      if (id) nextRects.set(id, el.getBoundingClientRect());
    }
    prevRectsRef.current = nextRects;
    isFirstRunRef.current = false;
  }, [containerRef, ...deps]);
}
