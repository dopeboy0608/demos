import { createBoundaryRing } from './naturalPolygon';
import { pseudoRandom } from './pseudoRandom';

type Axis = 0 | 1; // 0 = lng, 1 = lat

// Sutherland-Hodgman 알고리즘으로, 닫힌 고리(ring)를 축에 평행한 반평면(axis 기준 value
// 이상 또는 이하) 하나로 자른다. 이 함수를 두 번(min/max) 이어 부르면 "띠(strip)" 하나를
// 정확히 잘라낼 수 있다 — 격자 분할(촘촘한 소분류/세분류, #51)의 기반이 된다.
function clipAxis(
  ring: number[][],
  axis: Axis,
  value: number,
  keepGreaterOrEqual: boolean,
): number[][] {
  if (ring.length === 0) return [];

  const inside = (p: number[]) =>
    keepGreaterOrEqual ? p[axis] >= value : p[axis] <= value;
  const intersect = (a: number[], b: number[]) => {
    const t = (value - a[axis]) / (b[axis] - a[axis]);
    return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
  };

  const result: number[][] = [];
  for (let i = 0; i < ring.length; i++) {
    const curr = ring[i];
    const prev = ring[(i - 1 + ring.length) % ring.length];
    const currIn = inside(curr);
    const prevIn = inside(prev);

    if (currIn) {
      if (!prevIn) result.push(intersect(prev, curr));
      result.push(curr);
    } else if (prevIn) {
      result.push(intersect(prev, curr));
    }
  }
  return result;
}

function clipStrip(
  ring: number[][],
  axis: Axis,
  min: number,
  max: number,
): number[][] {
  return clipAxis(clipAxis(ring, axis, min, true), axis, max, false);
}

function boundingRange(ring: number[][], axis: Axis): [number, number] {
  const values = ring.map((p) => p[axis]);
  return [Math.min(...values), Math.max(...values)];
}

function closeRing(ring: number[][]): number[][][][] {
  if (ring.length === 0) return [[[]]];
  return [[[...ring, ring[0]]]];
}

/**
 * 영역(ring)을 count개의 조각으로 재귀적으로 "반으로 쪼개기(slice-and-dice treemap)"
 * 방식으로 나눈다. 매번 현재 바운딩박스가 더 넓은 축을 골라 자르므로, 조각들이 가로·세로
 * 어느 한쪽으로 치우치지 않고 고르게 작아진다(줌을 깊이 했을 때도 화면에 잘 들어맞도록,
 * #51). 쪼개기만 할 뿐 버리는 부분이 없어 조각을 모두 합치면 항상 원래 영역과 정확히
 * 일치한다.
 */
function splitAreaIntoPieces(ring: number[][], count: number): number[][][] {
  if (count <= 1 || ring.length === 0) return [ring];

  const leftCount = Math.floor(count / 2);
  const rightCount = count - leftCount;

  const [minLng, maxLng] = boundingRange(ring, 0);
  const [minLat, maxLat] = boundingRange(ring, 1);
  const width = maxLng - minLng;
  const height = maxLat - minLat;

  const axis: Axis = width >= height ? 0 : 1;
  const min = axis === 0 ? minLng : minLat;
  const max = axis === 0 ? maxLng : maxLat;
  const cut = min + ((max - min) * leftCount) / count;

  const firstHalf = clipStrip(ring, axis, min, cut);
  const secondHalf = clipStrip(ring, axis, cut, max);

  return [
    ...splitAreaIntoPieces(firstHalf, leftCount),
    ...splitAreaIntoPieces(secondHalf, rightCount),
  ];
}

/**
 * 센터 영역을 count개의 조각으로 나눈다(위 splitAreaIntoPieces 참고). 소분류(regionCount)와
 * 세분류(subRegionCount) 모두 이 함수로 직접 나눈다 — 합치면 센터 영역과 정확히 일치하고,
 * 가로·세로 모두 균형 있게 작아져 줌을 깊이 했을 때도 화면에 잘 들어맞는다(#47, #51).
 */
export function createAreaDivisions(
  center: { lat: number; lng: number },
  seed: number,
  count: number,
  baseRadius: number,
): number[][][][][] {
  const ring = createBoundaryRing(center, seed, baseRadius);
  return createAreaDivisionsFromRing(ring, count);
}

/**
 * 이미 만들어진(절차적이든 실제 경계든) ring을 count개의 조각으로 나눈다. 실제 행정동
 * 경계(#64)처럼 createBoundaryRing으로 생성되지 않은 ring도 동일하게 분할할 수 있도록
 * createAreaDivisions에서 ring 생성 부분만 분리했다.
 */
export function createAreaDivisionsFromRing(
  ring: number[][],
  count: number,
): number[][][][][] {
  return splitAreaIntoPieces(ring, count).map(closeRing);
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
