import { describe, expect, it } from 'vitest';

import { createNaturalPolygon } from './naturalPolygon';

describe('createNaturalPolygon', () => {
  it('중심좌표 기준으로 닫힌 다각형(첫 점 = 마지막 점)을 생성한다', () => {
    const result = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 0);
    const ring = result[0][0];

    expect(ring[0]).toEqual(ring[ring.length - 1]);
    expect(ring.length).toBeGreaterThan(4);
  });

  it('동일한 center/seed로 호출하면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 5);
    const b = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 5);

    expect(a).toEqual(b);
  });

  it('seed가 다르면 서로 다른 모양을 생성한다 (단순 사각형이 아님)', () => {
    const a = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 1);
    const b = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 2);

    expect(a).not.toEqual(b);
  });

  it('생성된 좌표는 중심좌표 근처(반경 이내)에 위치한다', () => {
    const center = { lat: 37.5, lng: 127.0 };
    const baseRadius = 0.02;
    const [[ring]] = createNaturalPolygon(center, 3, baseRadius);

    for (const [lng, lat] of ring) {
      expect(Math.abs(lng - center.lng)).toBeLessThanOrEqual(baseRadius * 1.5);
      expect(Math.abs(lat - center.lat)).toBeLessThanOrEqual(baseRadius * 1.5);
    }
  });
});
