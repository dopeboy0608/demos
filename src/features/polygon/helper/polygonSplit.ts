import polygonSplitter from 'polygon-splitter';

import type { LatLng } from './types';

type Position = [number, number];

function toClosedRing(path: LatLng[]): Position[] {
  const ring: Position[] = path.map((point) => [point.lng, point.lat]);
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (lastLng !== firstLng || lastLat !== firstLat) {
    ring.push([firstLng, firstLat]);
  }
  return ring;
}

function toLineCoordinates(path: LatLng[]): Position[] {
  return path.map((point) => [point.lng, point.lat]);
}

/**
 * 분할선이 폴리곤을 실제로 가로지르지 않으면 polygon-splitter가 원본 Polygon을 그대로
 * 반환한다(MultiPolygon이 아님) — 이 경우 빈 배열을 반환해 "분할 실패"를 알린다
 * (spec.md Edge Cases, FR-008).
 */
export function splitPolygon(path: LatLng[], linePath: LatLng[]): LatLng[][] {
  const polygonGeom = {
    type: 'Polygon' as const,
    coordinates: [toClosedRing(path)],
  };
  const lineGeom = {
    type: 'LineString' as const,
    coordinates: toLineCoordinates(linePath),
  };

  const result = polygonSplitter(polygonGeom, lineGeom);
  const geometry = result.type === 'Feature' ? result.geometry : result;

  if (geometry.type !== 'MultiPolygon' || geometry.coordinates.length < 2) {
    return [];
  }

  return geometry.coordinates.map((polygon) => {
    const outerRing = polygon[0];
    const withoutClosingPoint = outerRing.slice(0, -1);
    return withoutClosingPoint.map(([lng, lat]) => ({ lat, lng }));
  });
}
