import { useCallback, useRef } from 'react';

// React의 JSX onWheel은 passive 리스너로 등록되어 preventDefault()가 동작하지 않는다.
// 원본처럼 휠로 페이지/스크롤을 직접 제어하려면 네이티브 리스너를 passive:false로 등록해야 한다.
// 콜백 ref로 구현한 이유: 갤러리↔리스트 스타일 전환처럼 대상 엘리먼트가 조건부 렌더링으로
// 마운트/언마운트를 반복하면, useEffect(deps:[])는 그 리마운트를 감지하지 못해 리스너가
// 한 번만 붙고 이후 갱신되지 않는다.
export function useNonPassiveWheel<T extends HTMLElement>(
  onWheel: (event: WheelEvent) => void,
) {
  const handlerRef = useRef(onWheel);
  handlerRef.current = onWheel;

  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback((el: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!el) return;

    const listener = (event: WheelEvent) => handlerRef.current(event);
    el.addEventListener('wheel', listener, { passive: false });
    cleanupRef.current = () => {
      el.removeEventListener('wheel', listener);
    };
  }, []);
}
