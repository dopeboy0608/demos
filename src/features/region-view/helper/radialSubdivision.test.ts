import { describe, expect, it } from 'vitest';

import {
  createSectorDivisions,
  createSectorPolygon,
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
