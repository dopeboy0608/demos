import { createAreaPolygon } from './naturalPolygon';
import { pseudoRandom } from './pseudoRandom';

/**
 * 상위 영역(전체 원, 0~2π)을 count개의 부채꼴로 등분한다. 모두 같은 center/seed/baseRadius로
 * createAreaPolygon을 호출하므로(각도 구간만 다름), 조각들을 합치면 전체 원과 정확히 일치한다.
 */
export function createSectorDivisions(
  center: { lat: number; lng: number },
  seed: number,
  count: number,
  baseRadius: number,
): number[][][][][] {
  return Array.from({ length: count }, (_, i) => {
    const startAngle = (Math.PI * 2 * i) / count;
    const endAngle = (Math.PI * 2 * (i + 1)) / count;
    return createAreaPolygon(center, seed, startAngle, endAngle, baseRadius);
  });
}

/**
 * 소분류(parentSectorIndex번째 부채꼴, 전체를 parentSectorCount등분한 것 중 하나)의 각도
 * 구간을 다시 subCount개로 등분한다. 부모와 같은 center/seed/baseRadius를 쓰고 각도 구간만
 * 부모 구간의 부분집합이므로, 세분류를 모두 합치면 소분류와 정확히 일치한다.
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

  return Array.from({ length: subCount }, (_, i) => {
    const startAngle =
      parentStartAngle + ((parentEndAngle - parentStartAngle) * i) / subCount;
    const endAngle =
      parentStartAngle +
      ((parentEndAngle - parentStartAngle) * (i + 1)) / subCount;
    return createAreaPolygon(center, seed, startAngle, endAngle, baseRadius);
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
