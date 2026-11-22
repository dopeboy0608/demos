import { pseudoRandom } from './pseudoRandom';

const ARC_SAMPLE_COUNT = 4;

// 상위 영역 반경 대비 하위 분할 영역이 차지할 수 있는 최대 비율. createNaturalPolygon의
// radiusVariance 최솟값(0.6)보다 작게 잡아, 하위 분할 영역이 상위 영역 경계를 벗어나지
// 않도록 보수적으로 설정한다(#47/#49).
const SUBDIVISION_RADIUS_RATIO = 0.55;

// 소분류 안에서 다시 세분류로 나눌 때 적용하는 추가 비율. 소분류 영역 자체가 이미
// radiusVariance(0.6~1.1)만큼 들쭉날쭉하므로, 그 최솟값(0.6)보다도 더 보수적으로 잡아야
// 중첩 분할이 상위(소분류) 영역을 벗어나지 않는다(#50).
const SUB_SUBDIVISION_RADIUS_RATIO = 0.5;

function createArcPolygon(
  center: { lat: number; lng: number },
  seed: number,
  salt: number,
  startAngle: number,
  endAngle: number,
  maxRadius: number,
): number[][][][] {
  const arcPoints: number[][] = [];
  for (let i = 0; i <= ARC_SAMPLE_COUNT; i++) {
    const angle = startAngle + ((endAngle - startAngle) * i) / ARC_SAMPLE_COUNT;
    const radiusVariance = 0.6 + pseudoRandom(seed, salt * 100 + i) * 0.5;
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

  return createArcPolygon(
    center,
    seed,
    sectorIndex,
    startAngle,
    endAngle,
    maxRadius,
  );
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

/**
 * 소분류(parentSectorIndex번째 부채꼴) 안을 subCount개의 더 작은 부채꼴(세분류)로 다시
 * 나눈다. 같은 중심점에서, 상위 부채꼴과 같은 각도 구간의 부분 구간 + 더 작은 반경으로
 * 생성하므로 항상 상위 영역 안에 포함된다.
 */
export function createNestedSectorDivisions(
  center: { lat: number; lng: number },
  seed: number,
  parentSectorIndex: number,
  parentSectorCount: number,
  subCount: number,
  baseRadius: number,
): number[][][][][] {
  const parentStartAngle =
    (Math.PI * 2 * parentSectorIndex) / parentSectorCount;
  const parentEndAngle =
    (Math.PI * 2 * (parentSectorIndex + 1)) / parentSectorCount;
  const maxRadius =
    baseRadius * SUBDIVISION_RADIUS_RATIO * SUB_SUBDIVISION_RADIUS_RATIO;

  return Array.from({ length: subCount }, (_, i) => {
    const startAngle =
      parentStartAngle + ((parentEndAngle - parentStartAngle) * i) / subCount;
    const endAngle =
      parentStartAngle +
      ((parentEndAngle - parentStartAngle) * (i + 1)) / subCount;
    const salt = parentSectorIndex * 1000 + i;
    return createArcPolygon(
      center,
      seed,
      salt,
      startAngle,
      endAngle,
      maxRadius,
    );
  });
}

/**
 * total을 groups개의 그룹에 시드 기반으로 임의 분배한다(합계는 항상 total과 일치).
 * total이 groups 이상이면 각 그룹에 최소 1개씩 먼저 배정한 뒤 나머지를 임의로 나눈다.
 */
export function distributeCount(
  total: number,
  groups: number,
  seed: number,
): number[] {
  if (groups <= 0) return [];

  const counts = new Array(groups).fill(0);
  const guaranteed = Math.min(total, groups);
  for (let i = 0; i < guaranteed; i++) counts[i] = 1;

  let remaining = total - guaranteed;
  let salt = 0;
  while (remaining > 0) {
    const index = Math.floor(pseudoRandom(seed, salt) * groups);
    counts[index] += 1;
    remaining -= 1;
    salt += 1;
  }

  return counts;
}
