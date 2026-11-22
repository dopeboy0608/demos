import { describe, expect, it } from 'vitest';

import { createAreaDivisions, distributeCount } from './radialSubdivision';

const CENTER = { lat: 37.5, lng: 127.0 };
const BASE_RADIUS = 0.08;

function bbox(ring: number[][]) {
  const lngs = ring.map(([lng]) => lng);
  const lats = ring.map(([, lat]) => lat);
  return {
    width: Math.max(...lngs) - Math.min(...lngs),
    height: Math.max(...lats) - Math.min(...lats),
  };
}

describe('createAreaDivisions', () => {
  it('count개의 조각을 생성한다', () => {
    const result = createAreaDivisions(CENTER, 0, 4, BASE_RADIUS);

    expect(result).toHaveLength(4);
  });

  it('count가 1이면 전체 영역 그대로 하나의 조각을 반환한다', () => {
    const result = createAreaDivisions(CENTER, 0, 1, BASE_RADIUS);

    expect(result).toHaveLength(1);
    expect(result[0][0][0].length).toBeGreaterThan(8);
  });

  it('조각들은 상위 영역 반경 이내에 있다 (상위 영역을 벗어나지 않음)', () => {
    const result = createAreaDivisions(CENTER, 1, 5, BASE_RADIUS);

    for (const [[ring]] of result) {
      for (const [lng, lat] of ring) {
        expect(Math.abs(lng - CENTER.lng)).toBeLessThanOrEqual(
          BASE_RADIUS * 1.4,
        );
        expect(Math.abs(lat - CENTER.lat)).toBeLessThanOrEqual(
          BASE_RADIUS * 1.4,
        );
      }
    }
  });

  it('조각 하나의 가로·세로 폭 모두 전체(count=1)보다 좁다 (양쪽 축 모두 촘촘해짐)', () => {
    const [whole] = createAreaDivisions(CENTER, 2, 1, BASE_RADIUS);
    const pieces = createAreaDivisions(CENTER, 2, 6, BASE_RADIUS);
    const wholeBox = bbox(whole[0][0]);

    for (const piece of pieces) {
      const box = bbox(piece[0][0]);
      expect(box.width).toBeLessThan(wholeBox.width);
      expect(box.height).toBeLessThan(wholeBox.height);
    }
  });

  it('동일한 입력이면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = createAreaDivisions(CENTER, 1, 3, BASE_RADIUS);
    const b = createAreaDivisions(CENTER, 1, 3, BASE_RADIUS);

    expect(a).toEqual(b);
  });
});

describe('distributeCount', () => {
  it('합계가 total과 정확히 일치하는 groups개의 배열을 반환한다', () => {
    const result = distributeCount(12, 4, 0);

    expect(result).toHaveLength(4);
    expect(result.reduce((sum, n) => sum + n, 0)).toBe(12);
  });

  it('total이 groups 이상이면 각 그룹에 최소 1개씩 배정한다', () => {
    const result = distributeCount(12, 4, 1);

    for (const count of result) {
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  it('동일한 입력이면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = distributeCount(14, 5, 7);
    const b = distributeCount(14, 5, 7);

    expect(a).toEqual(b);
  });

  it('groups가 0이면 빈 배열을 반환한다', () => {
    expect(distributeCount(0, 0, 0)).toEqual([]);
  });

  it('total이 groups보다 작으면 일부 그룹은 0개를 받는다', () => {
    const result = distributeCount(2, 4, 0);

    expect(result).toHaveLength(4);
    expect(result.reduce((sum, n) => sum + n, 0)).toBe(2);
    expect(result.filter((n) => n === 0)).toHaveLength(2);
  });
});
