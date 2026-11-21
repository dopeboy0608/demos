import { useCallback } from 'react';

export function useRobokingCover(onStart: () => void) {
  const handleStart = useCallback(() => {
    onStart();
  }, [onStart]);

  return { handleStart };
}
