import { describe, expect, it } from 'vitest';

import { splitPolygon } from './polygonSplit';
import type { LatLng } from './types';

// lat/lng 0~2 정사각형
const SQUARE: LatLng[] = [
  { lat: 0, lng: 0 },
  { lat: 0, lng: 2 },
  { lat: 2, lng: 2 },
  { lat: 2, lng: 0 },
];

// 정사각형을 lng=1 기준으로 세로로 가로지르는 선
const CROSSING_LINE: LatLng[] = [
  { lat: -1, lng: 1 },
  { lat: 3, lng: 1 },
];

// 정사각형과 전혀 교차하지 않는 선
const NON_CROSSING_LINE: LatLng[] = [
  { lat: 5, lng: 5 },
  { lat: 6, lng: 6 },
];

describe('splitPolygon', () => {
  it('폴리곤을 가로지르는 선으로 2개의 폴리곤으로 나눈다', () => {
    const result = splitPolygon(SQUARE, CROSSING_LINE);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([
      { lat: 0, lng: 1 },
      { lat: 0, lng: 2 },
      { lat: 2, lng: 2 },
      { lat: 2, lng: 1 },
    ]);
    expect(result[1]).toEqual([
      { lat: 2, lng: 1 },
      { lat: 2, lng: 0 },
      { lat: 0, lng: 0 },
      { lat: 0, lng: 1 },
    ]);
  });

  it('폴리곤을 가로지르지 않는 선이면 빈 배열을 반환한다 (Edge Case)', () => {
    const result = splitPolygon(SQUARE, NON_CROSSING_LINE);
    expect(result).toEqual([]);
  });
});
