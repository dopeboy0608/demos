import { pseudoRandom } from './pseudoRandom';

const ARC_SAMPLE_COUNT = 4;

// 상위 영역 반경 대비 하위 분할 영역이 차지할 수 있는 최대 비율. createNaturalPolygon의
// radiusVariance 최솟값(0.6)보다 작게 잡아, 하위 분할 영역이 상위 영역 경계를 벗어나지
// 않도록 보수적으로 설정한다(#47/#49).
const SUBDIVISION_RADIUS_RATIO = 0.55;

/**
 * 상위 영역 중심에서 방사형으로 뻗어나가는 부채꼴 모양의 하위 영역 폴리곤을 만든다.
 * sectorIndex/sectorCount로 전체 원을 등분한 각도 구간을 맡고, 그 구간 안에서
 * seed 기반 의사난수로 바깥 경계를 자연스럽게 흔든다.
 */
export function createSectorPolygon(
  center: { lat: number; lng: number },
  seed: number,
  sectorIndex: number,
  sectorCount: number,
  baseRadius: number,
): number[][][][] {
  const startAngle = (Math.PI * 2 * sectorIndex) / sectorCount;
  const endAngle = (Math.PI * 2 * (sectorIndex + 1)) / sectorCount;
  const maxRadius = baseRadius * SUBDIVISION_RADIUS_RATIO;

  const arcPoints: number[][] = [];
  for (let i = 0; i <= ARC_SAMPLE_COUNT; i++) {
    const angle = startAngle + ((endAngle - startAngle) * i) / ARC_SAMPLE_COUNT;
    const radiusVariance =
      0.6 + pseudoRandom(seed, sectorIndex * 100 + i) * 0.5;
    const radius = maxRadius * radiusVariance;
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

/** 상위 영역을 count개의 부채꼴 하위 영역으로 등분한다. */
export function createSectorDivisions(
  center: { lat: number; lng: number },
  seed: number,
  count: number,
  baseRadius: number,
): number[][][][][] {
  return Array.from({ length: count }, (_, i) =>
    createSectorPolygon(center, seed, i, count, baseRadius),
  );
}
