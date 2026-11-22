import { describe, expect, it } from 'vitest';

import {
  createAreaPolygon,
  createBoundaryRing,
  createNaturalPolygon,
  naturalRadius,
} from './naturalPolygon';

const TEST_RADIUS = 0.08;

describe('createNaturalPolygon', () => {
  it('중심좌표 기준으로 닫힌 다각형(첫 점 = 마지막 점)을 생성한다', () => {
    const result = createNaturalPolygon(
      { lat: 37.5, lng: 127.0 },
      0,
      TEST_RADIUS,
    );
    const ring = result[0][0];

    expect(ring[0]).toEqual(ring[ring.length - 1]);
    expect(ring.length).toBeGreaterThan(4);
  });

  it('동일한 center/seed로 호출하면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 5, TEST_RADIUS);
    const b = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 5, TEST_RADIUS);

    expect(a).toEqual(b);
  });

  it('seed가 다르면 서로 다른 모양을 생성한다 (단순 사각형이 아님)', () => {
    const a = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 1, TEST_RADIUS);
    const b = createNaturalPolygon({ lat: 37.5, lng: 127.0 }, 2, TEST_RADIUS);

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

describe('naturalRadius', () => {
  it('각도만 같으면 seed가 같을 때 항상 같은 값을 반환한다 (결정적)', () => {
    expect(naturalRadius(4, 1.2, TEST_RADIUS)).toBe(
      naturalRadius(4, 1.2, TEST_RADIUS),
    );
  });

  it('2π 주기로 반복된다 (각도 0과 2π는 같은 값)', () => {
    const atZero = naturalRadius(7, 0, TEST_RADIUS);
    const atFullCircle = naturalRadius(7, Math.PI * 2, TEST_RADIUS);

    expect(atFullCircle).toBeCloseTo(atZero, 10);
  });
});

describe('createAreaPolygon', () => {
  it('같은 seed/baseRadius라면 각도 구간의 경계에서 정확히 같은 좌표를 공유한다 (경계 일치)', () => {
    const center = { lat: 37.5, lng: 127.0 };
    const seed = 2;
    const cutAngle = Math.PI / 2;

    const [[firstSlice]] = createAreaPolygon(
      center,
      seed,
      0,
      cutAngle,
      TEST_RADIUS,
    );
    const [[secondSlice]] = createAreaPolygon(
      center,
      seed,
      cutAngle,
      Math.PI,
      TEST_RADIUS,
    );

    // firstSlice의 마지막 경계점(센터 직전)과 secondSlice의 첫 경계점(센터 다음)이
    // 정확히 같은 cutAngle 지점을 가리켜야 한다 — 두 조각을 합쳤을 때 틈/겹침이 없다는 뜻.
    expect(firstSlice[firstSlice.length - 2]).toEqual(secondSlice[1]);
  });
});

describe('createBoundaryRing', () => {
  it('center 없이 경계점만으로 이루어진 열린 고리를 반환한다', () => {
    const ring = createBoundaryRing({ lat: 37.5, lng: 127.0 }, 1, TEST_RADIUS);

    expect(ring.length).toBeGreaterThan(8);
    expect(ring[0]).not.toEqual(ring[ring.length - 1]);
  });

  it('동일한 입력이면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = createBoundaryRing({ lat: 37.5, lng: 127.0 }, 3, TEST_RADIUS);
    const b = createBoundaryRing({ lat: 37.5, lng: 127.0 }, 3, TEST_RADIUS);

    expect(a).toEqual(b);
  });
});
