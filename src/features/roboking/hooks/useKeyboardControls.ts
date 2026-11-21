import { useEffect, useRef, useState } from 'react';

import type { RobotDirection } from '../helper/types';

const ARROW_KEY_DIRECTION: Record<number, RobotDirection> = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};
const SPACE_KEY_CODE = 32;

interface UseKeyboardControlsOptions {
  onSpaceDown?: () => void;
}

/**
 * 원본 `kitchen/RoboKing.as`의 `keyDownUpHandler`를 그대로 따른다: keydown으로만
 * 방향을 갱신하고, keyup으로 "stop"으로 되돌리지 않는다(다른 방향키를 누르기 전까지
 * 마지막 방향을 유지) — 원본의 의도된 동작인지 버그인지 불명이나 재현도를 우선한다.
 */
export function useKeyboardControls(options: UseKeyboardControlsOptions = {}) {
  const [direction, setDirection] = useState<RobotDirection>('stop');

  const onSpaceDownRef = useRef(options.onSpaceDown);
  onSpaceDownRef.current = options.onSpaceDown;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const mappedDirection = ARROW_KEY_DIRECTION[event.keyCode];
      if (mappedDirection) {
        setDirection(mappedDirection);
        return;
      }
      if (event.keyCode === SPACE_KEY_CODE) {
        onSpaceDownRef.current?.();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { direction };
}
