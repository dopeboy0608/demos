import { describe, expect, it } from 'vitest';

import {
  createNestedSectorDivisions,
  createSectorDivisions,
  createSectorPolygon,
  distributeCount,
} from './radialSubdivision';

const CENTER = { lat: 37.5, lng: 127.0 };
const BASE_RADIUS = 0.08;

describe('createSectorPolygon', () => {
  it('중심점에서 시작해 중심점으로 끝나는 닫힌 다각형(부채꼴)을 생성한다', () => {
    const [[ring]] = createSectorPolygon(CENTER, 0, 0, 4, BASE_RADIUS);

    expect(ring[0]).toEqual([CENTER.lng, CENTER.lat]);
    expect(ring[ring.length - 1]).toEqual([CENTER.lng, CENTER.lat]);
    expect(ring.length).toBeGreaterThan(2);
  });

  it('동일한 입력이면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = createSectorPolygon(CENTER, 3, 1, 4, BASE_RADIUS);
    const b = createSectorPolygon(CENTER, 3, 1, 4, BASE_RADIUS);

    expect(a).toEqual(b);
  });

  it('sectorIndex가 다르면 서로 다른 각도 범위의 부채꼴을 생성한다', () => {
    const a = createSectorPolygon(CENTER, 1, 0, 4, BASE_RADIUS);
    const b = createSectorPolygon(CENTER, 1, 1, 4, BASE_RADIUS);

    expect(a).not.toEqual(b);
  });

  it('생성된 좌표는 상위 영역(baseRadius) 반경 이내에 위치한다', () => {
    const [[ring]] = createSectorPolygon(CENTER, 2, 2, 4, BASE_RADIUS);

    for (const [lng, lat] of ring) {
      expect(Math.abs(lng - CENTER.lng)).toBeLessThanOrEqual(BASE_RADIUS);
      expect(Math.abs(lat - CENTER.lat)).toBeLessThanOrEqual(BASE_RADIUS);
    }
  });
});

describe('createSectorDivisions', () => {
  it('count개의 부채꼴 폴리곤을 생성한다', () => {
    const result = createSectorDivisions(CENTER, 0, 4, BASE_RADIUS);

    expect(result).toHaveLength(4);
  });

  it('count가 0이면 빈 배열을 반환한다', () => {
    expect(createSectorDivisions(CENTER, 0, 0, BASE_RADIUS)).toEqual([]);
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

describe('createNestedSectorDivisions', () => {
  // SUBDIVISION_RADIUS_RATIO(0.55)의 최소 보장 반경(0.6배)을 그대로 계산한 값.
  // 중첩 분할 결과가 이보다 항상 작아야 상위(소분류) 영역을 벗어나지 않는다.
  const PARENT_SAFE_INNER_RADIUS = BASE_RADIUS * 0.55 * 0.6;

  it('subCount개의 부채꼴 폴리곤을 생성한다', () => {
    const result = createNestedSectorDivisions(CENTER, 0, 0, 4, 3, BASE_RADIUS);

    expect(result).toHaveLength(3);
  });

  it('생성된 좌표는 상위(소분류) 영역의 안전 반경 이내에 위치한다', () => {
    const result = createNestedSectorDivisions(CENTER, 2, 1, 4, 3, BASE_RADIUS);

    for (const [[ring]] of result) {
      for (const [lng, lat] of ring) {
        expect(Math.abs(lng - CENTER.lng)).toBeLessThanOrEqual(
          PARENT_SAFE_INNER_RADIUS,
        );
        expect(Math.abs(lat - CENTER.lat)).toBeLessThanOrEqual(
          PARENT_SAFE_INNER_RADIUS,
        );
      }
    }
  });

  it('동일한 입력이면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = createNestedSectorDivisions(CENTER, 3, 1, 4, 2, BASE_RADIUS);
    const b = createNestedSectorDivisions(CENTER, 3, 1, 4, 2, BASE_RADIUS);

    expect(a).toEqual(b);
  });
});
