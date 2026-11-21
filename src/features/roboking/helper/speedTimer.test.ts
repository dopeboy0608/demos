import { describe, expect, it } from 'vitest';

import { tickSpeedSecondsLeft } from './speedTimer';

describe('tickSpeedSecondsLeft', () => {
  it('48fps로 10초를 480틱 소진하면 정확히 0이 된다', () => {
    let left = 10;
    const tickSeconds = 1 / 48;
    for (let i = 0; i < 480; i++) {
      left = tickSpeedSecondsLeft(left, tickSeconds);
    }
    expect(left).toBeCloseTo(0);
  });

  it('0 아래로 내려가지 않는다', () => {
    expect(tickSpeedSecondsLeft(0.01, 1 / 48)).toBe(0);
  });
});
