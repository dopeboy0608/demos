import { describe, expect, it } from 'vitest';

import { applyPolygonOperation } from './polygonOperations';
import type { LatLng } from './types';

// 두 정사각형이 부분적으로 겹치는 고정 픽스처.
// A: lat/lng 0~2 정사각형, B: lat/lng 1~3 정사각형 (겹치는 영역: lat/lng 1~2)
const SQUARE_A: LatLng[] = [
  { lat: 0, lng: 0 },
  { lat: 0, lng: 2 },
  { lat: 2, lng: 2 },
  { lat: 2, lng: 0 },
];

const SQUARE_B: LatLng[] = [
  { lat: 1, lng: 1 },
  { lat: 1, lng: 3 },
  { lat: 3, lng: 3 },
  { lat: 3, lng: 1 },
];

// A와 전혀 겹치지 않는 정사각형
const SQUARE_C: LatLng[] = [
  { lat: 10, lng: 10 },
  { lat: 10, lng: 11 },
  { lat: 11, lng: 11 },
  { lat: 11, lng: 10 },
];

describe('applyPolygonOperation', () => {
  it('union: 겹치는 두 폴리곤을 하나의 폴리곤으로 합친다', () => {
    const result = applyPolygonOperation('union', SQUARE_A, SQUARE_B);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([
      { lat: 0, lng: 0 },
      { lat: 0, lng: 2 },
      { lat: 1, lng: 2 },
      { lat: 1, lng: 3 },
      { lat: 3, lng: 3 },
      { lat: 3, lng: 1 },
      { lat: 2, lng: 1 },
      { lat: 2, lng: 0 },
    ]);
  });

  it('intersection: 겹치는 영역만 남긴 폴리곤을 반환한다', () => {
    const result = applyPolygonOperation('intersection', SQUARE_A, SQUARE_B);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([
      { lat: 1, lng: 1 },
      { lat: 1, lng: 2 },
      { lat: 2, lng: 2 },
      { lat: 2, lng: 1 },
    ]);
  });

  it('intersection: 겹치는 영역이 없으면 빈 배열을 반환한다 (Edge Case)', () => {
    const result = applyPolygonOperation('intersection', SQUARE_A, SQUARE_C);
    expect(result).toEqual([]);
  });

  it('xor: 겹치지 않는 두 영역을 각각 독립된 폴리곤으로 반환한다', () => {
    const result = applyPolygonOperation('xor', SQUARE_A, SQUARE_B);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([
      { lat: 0, lng: 0 },
      { lat: 0, lng: 2 },
      { lat: 1, lng: 2 },
      { lat: 1, lng: 1 },
      { lat: 2, lng: 1 },
      { lat: 2, lng: 0 },
    ]);
    expect(result[1]).toEqual([
      { lat: 2, lng: 1 },
      { lat: 2, lng: 2 },
      { lat: 1, lng: 2 },
      { lat: 1, lng: 3 },
      { lat: 3, lng: 3 },
      { lat: 3, lng: 1 },
    ]);
  });

  it('difference: A에서 B와 겹치는 부분을 제외한 영역을 반환한다', () => {
    const result = applyPolygonOperation('difference', SQUARE_A, SQUARE_B);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual([
      { lat: 0, lng: 0 },
      { lat: 0, lng: 2 },
      { lat: 1, lng: 2 },
      { lat: 1, lng: 1 },
      { lat: 2, lng: 1 },
      { lat: 2, lng: 0 },
    ]);
  });
});
