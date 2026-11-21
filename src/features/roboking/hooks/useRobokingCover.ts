import { useCallback } from 'react';

// START 클릭 시 스테이지 전환 로직은 02(주방 레이아웃)에서 연결한다.
export function useRobokingCover() {
  const handleStart = useCallback(() => {
    console.log('[roboking] START clicked');
  }, []);

  return { handleStart };
}
