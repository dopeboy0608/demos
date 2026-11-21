import { useEffect, useRef } from 'react';

const MAX_FRAME_DELTA_SECONDS = 0.25;

interface UseGameLoopOptions {
  fps: number;
  paused?: boolean;
}

/**
 * 원본이 프레임 기반 타이머/속도였으므로, 주사율과 무관하게 동일한 난이도가 되도록
 * requestAnimationFrame 위에 고정 타임스텝 누적(accumulator)을 올린다.
 * 탭이 백그라운드에 있다가 돌아오는 등 큰 델타가 들어오면 폭주(spiral of death)하지
 * 않도록 프레임당 델타를 clamp한다.
 */
export function useGameLoop(
  onTick: (tickSeconds: number) => void,
  options: UseGameLoopOptions,
) {
  const { fps, paused = false } = options;

  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (paused) return;

    const tickSeconds = 1 / fps;
    let accumulator = 0;
    let lastTime = performance.now();
    let rafId = requestAnimationFrame(loop);

    function loop(now: number) {
      const deltaSeconds = Math.min(
        (now - lastTime) / 1000,
        MAX_FRAME_DELTA_SECONDS,
      );
      lastTime = now;
      accumulator += deltaSeconds;

      while (accumulator >= tickSeconds) {
        onTickRef.current(tickSeconds);
        accumulator -= tickSeconds;
      }

      rafId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(rafId);
  }, [fps, paused]);
}
