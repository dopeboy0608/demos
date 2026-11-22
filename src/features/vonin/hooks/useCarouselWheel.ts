import { useCallback, useRef } from 'react';

// Contents.as의 click() 핸들러 그대로: 캐러셀 영역 안에서만 휠을 가로채 1회당 한 칸만 이동시키고
// 500ms 동안 추가 입력을 무시한다(페이지 스크롤과 충돌하지 않도록 네이티브 리스너를
// passive:false로 등록 — JSX onWheel은 passive라 preventDefault가 동작하지 않는다).
const WHEEL_DEBOUNCE_MS = 500;

export function useCarouselWheel(onStep: (direction: 1 | -1) => void) {
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  const lockedRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback((el: HTMLElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!el) return;

    const listener = (event: WheelEvent) => {
      event.preventDefault();
      if (lockedRef.current) return;

      lockedRef.current = true;
      onStepRef.current(event.deltaY > 0 ? 1 : -1);
      setTimeout(() => {
        lockedRef.current = false;
      }, WHEEL_DEBOUNCE_MS);
    };

    el.addEventListener('wheel', listener, { passive: false });
    cleanupRef.current = () => {
      el.removeEventListener('wheel', listener);
    };
  }, []);
}
