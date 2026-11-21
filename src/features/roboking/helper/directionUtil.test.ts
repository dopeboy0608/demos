import { describe, expect, it } from 'vitest';

import { directionToRotationDeg, pickRandomDirection } from './directionUtil';

describe('pickRandomDirection', () => {
  it('random()이 0에 가까우면 첫 방향(left)을 고른다', () => {
    expect(pickRandomDirection(() => 0)).toBe('left');
  });

  it('random()이 1에 가까우면 마지막 방향(down)을 고른다', () => {
    expect(pickRandomDirection(() => 0.9999)).toBe('down');
  });

  it('네 방향 중 하나만 반환한다', () => {
    const directions = [0, 0.26, 0.51, 0.76].map((r) =>
      pickRandomDirection(() => r),
    );
    expect(new Set(directions)).toEqual(
      new Set(['left', 'right', 'up', 'down']),
    );
  });
});

describe('directionToRotationDeg', () => {
  it('원본 RoboKing.as의 this.rotation 값과 동일하게 매핑한다', () => {
    expect(directionToRotationDeg('left')).toBe(-90);
    expect(directionToRotationDeg('right')).toBe(90);
    expect(directionToRotationDeg('up')).toBe(0);
    expect(directionToRotationDeg('down')).toBe(180);
    expect(directionToRotationDeg('stop')).toBe(0);
  });
});
