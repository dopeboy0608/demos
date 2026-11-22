import { pseudoRandom } from './pseudoRandom';

const ARC_SAMPLE_COUNT = 8;

/**
 * 각도(angle)에 대한 연속 함수로 반경을 정의한다. 이산적인 꼭짓점 + 직선 보간 대신 연속
 * 함수를 쓰면, 어떤 각도 구간을 잘라도(radialSubdivision.ts) 항상 부모와 정확히 같은
 * 경계선을 공유하게 되어, 하위 영역을 모두 합치면 상위 영역과 정확히 일치한다(#50/#51).
 */
export function naturalRadius(
  seed: number,
  angle: number,
  baseRadius: number,
): number {
  const phase1 = pseudoRandom(seed, 1) * Math.PI * 2;
  const phase2 = pseudoRandom(seed, 2) * Math.PI * 2;
  const amplitude1 = 0.12 + pseudoRandom(seed, 3) * 0.08;
  const amplitude2 = 0.08 + pseudoRandom(seed, 4) * 0.08;
  const variance =
    1 +
    amplitude1 * Math.sin(angle * 2 + phase1) +
    amplitude2 * Math.sin(angle * 3 + phase2);

  return baseRadius * variance;
}

/**
 * 중심좌표에서 startAngle~endAngle 구간(라디안)에 걸친 부채꼴 모양의 영역 폴리곤을 만든다.
 * startAngle=0, endAngle=2π를 넘기면 센터 전체 영역이 되고, 더 좁은 구간을 넘기면 그 구간만의
 * 하위 영역이 된다 — 같은 seed/baseRadius로 구간만 나눠 호출하면 경계가 항상 정확히 맞물린다.
 */
export function createAreaPolygon(
  center: { lat: number; lng: number },
  seed: number,
  startAngle: number,
  endAngle: number,
  baseRadius: number,
  sampleCount = ARC_SAMPLE_COUNT,
): number[][][][] {
  const arcPoints: number[][] = [];
  for (let i = 0; i <= sampleCount; i++) {
    const angle = startAngle + ((endAngle - startAngle) * i) / sampleCount;
    const radius = naturalRadius(seed, angle, baseRadius);
    const lng = center.lng + radius * Math.cos(angle);
    const lat = center.lat + radius * Math.sin(angle) * 0.8;
    arcPoints.push([lng, lat]);
  }

  const points = [
    [center.lng, center.lat],
    ...arcPoints,
    [center.lng, center.lat],
  ];

  return [[points]];
}

/**
 * 중심좌표 주변에 단순 사각형이 아닌 불규칙한 다각형을 만든다. 실제 난수 대신 seed 기반
 * 의사난수를 써서, 같은 center/seed면 항상 같은 모양이 나온다(mock fixture로 쓰기 위함).
 */
export function createNaturalPolygon(
  center: { lat: number; lng: number },
  seed: number,
  baseRadius: number,
): number[][][][] {
  return createAreaPolygon(center, seed, 0, Math.PI * 2, baseRadius);
}

/**
 * createAreaPolygon과 같은 모양이지만, 중심점 없이 경계선만 도는 열린 고리(ring)를 만든다.
 * 격자 분할(areaGrid.ts)이 이 경계선을 직선으로 잘라 소분류/세분류 조각을 만드는 데 쓴다.
 */
export function createBoundaryRing(
  center: { lat: number; lng: number },
  seed: number,
  baseRadius: number,
  sampleCount = ARC_SAMPLE_COUNT * 3,
): number[][] {
  const points: number[][] = [];
  for (let i = 0; i < sampleCount; i++) {
    const angle = (Math.PI * 2 * i) / sampleCount;
    const radius = naturalRadius(seed, angle, baseRadius);
    const lng = center.lng + radius * Math.cos(angle);
    const lat = center.lat + radius * Math.sin(angle) * 0.8;
    points.push([lng, lat]);
  }
  return points;
}
