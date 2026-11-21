import { useEffect, useState } from 'react';

/** 브라우저 탭 비활성(visibilitychange)·창 포커스 아웃(blur)을 게임 일시정지로 취급한다. */
export function useGamePause() {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    function pause() {
      setIsPaused(true);
    }
    function resume() {
      if (document.visibilityState === 'visible') {
        setIsPaused(false);
      }
    }
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        pause();
      } else {
        resume();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', pause);
    window.addEventListener('focus', resume);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', pause);
      window.removeEventListener('focus', resume);
    };
  }, []);

  return { isPaused };
}
