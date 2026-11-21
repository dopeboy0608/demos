import { describe, expect, it } from 'vitest';

import { boundsToRectangle, getTolerance } from './geometry';

describe('boundsToRectangle', () => {
  it('카카오맵 bounds를 [lng,lat] 순서의 폐곡선 5점으로 변환한다', () => {
    const bounds = {
      getNorthEast: () => ({ getLng: () => 127.1, getLat: () => 37.6 }),
      getSouthWest: () => ({ getLng: () => 126.9, getLat: () => 37.4 }),
    };

    expect(boundsToRectangle(bounds)).toEqual([
      [127.1, 37.6],
      [127.1, 37.4],
      [126.9, 37.4],
      [126.9, 37.6],
      [127.1, 37.6],
    ]);
  });
});

describe('getTolerance', () => {
  it('줌 레벨 4 미만이면 0을 반환한다', () => {
    expect(getTolerance(3)).toBe(0);
  });

  it('줌 레벨이 높을수록 허용오차가 커진다', () => {
    const level5 = getTolerance(5);
    const level7 = getTolerance(7);

    expect(level5).toBeGreaterThan(0);
    expect(level7).toBeGreaterThan(level5);
  });
});
