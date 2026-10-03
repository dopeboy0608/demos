import { difference, intersection, union, xor } from 'polygon-clipping';

import type { LatLng } from './types';

export type OperationType = 'union' | 'intersection' | 'xor' | 'difference';

const OPERATIONS = { union, intersection, xor, difference } as const;

type Pair = [number, number];
type Ring = Pair[];
type PolygonGeom = Ring[];

function toRing(path: LatLng[]): Ring {
  const ring: Ring = path.map((point) => [point.lng, point.lat]);
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (lastLng !== firstLng || lastLat !== firstLat) {
    ring.push([firstLng, firstLat]);
  }
  return ring;
}

function fromMultiPolygon(multiPolygon: PolygonGeom[]): LatLng[][] {
  return multiPolygon.map((polygon) => {
    const outerRing = polygon[0];
    const withoutClosingPoint = outerRing.slice(0, -1);
    return withoutClosingPoint.map(([lng, lat]) => ({ lat, lng }));
  });
}

/**
 * union/intersection/xor/difference는 모두 결과가 여러 개의 분리된 폴리곤일 수 있어
 * (예: xor) MultiPolygon을 그대로 LatLng[][]로 변환해 반환한다 — 겹치는 영역이 없으면
 * 빈 배열을 반환한다 (spec.md Edge Cases).
 */
export function applyPolygonOperation(
  type: OperationType,
  pathA: LatLng[],
  pathB: LatLng[],
): LatLng[][] {
  const polygonA: PolygonGeom = [toRing(pathA)];
  const polygonB: PolygonGeom = [toRing(pathB)];
  const result = OPERATIONS[type](polygonA, polygonB);
  return fromMultiPolygon(result);
}
