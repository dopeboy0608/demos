import { useEffect, useRef } from 'react';

// Slide.as의 `myTimer`(5초)/Contents.as의 `timer`(3초) 패턴 공용화: 일정 간격으로 onTick을
// 호출하고, pause/resume으로 원본의 ROLL_OVER(정지)/ROLL_OUT(재개)를 그대로 재현한다.
export function useAutoRotate(intervalMs: number, onTick: () => void) {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const isPausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPausedRef.current) onTickRef.current();
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  return {
    pause: () => {
      isPausedRef.current = true;
    },
    resume: () => {
      isPausedRef.current = false;
    },
  };
}
