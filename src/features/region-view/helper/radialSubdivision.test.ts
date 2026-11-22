import { describe, expect, it } from 'vitest';

import {
  createNestedSectorDivisions,
  createSectorDivisions,
  distributeCount,
} from './radialSubdivision';

const CENTER = { lat: 37.5, lng: 127.0 };
const BASE_RADIUS = 0.08;

describe('createSectorDivisions', () => {
  it('count개의 부채꼴 폴리곤을 생성한다', () => {
    const result = createSectorDivisions(CENTER, 0, 4, BASE_RADIUS);

    expect(result).toHaveLength(4);
  });

  it('count가 0이면 빈 배열을 반환한다', () => {
    expect(createSectorDivisions(CENTER, 0, 0, BASE_RADIUS)).toEqual([]);
  });

  it('인접한 두 조각은 경계에서 정확히 같은 좌표를 공유한다 (합치면 전체 영역과 일치)', () => {
    const [first, second] = createSectorDivisions(CENTER, 3, 4, BASE_RADIUS);
    const firstRing = first[0][0];
    const secondRing = second[0][0];

    // 각 조각은 [중심, ...호 위의 점들, 중심] 형태이므로, first의 마지막 호 점(끝 각도)과
    // second의 첫 호 점(시작 각도)이 같은 경계를 가리켜야 한다.
    expect(firstRing[firstRing.length - 2]).toEqual(secondRing[1]);
  });

  it('동일한 입력이면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = createSectorDivisions(CENTER, 1, 3, BASE_RADIUS);
    const b = createSectorDivisions(CENTER, 1, 3, BASE_RADIUS);

    expect(a).toEqual(b);
  });
});

describe('distributeCount', () => {
  it('합계가 total과 정확히 일치하는 groups개의 배열을 반환한다', () => {
    const result = distributeCount(12, 4, 0);

    expect(result).toHaveLength(4);
    expect(result.reduce((sum, n) => sum + n, 0)).toBe(12);
  });

  it('total이 groups 이상이면 각 그룹에 최소 1개씩 배정한다', () => {
    const result = distributeCount(12, 4, 1);

    for (const count of result) {
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  it('동일한 입력이면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = distributeCount(14, 5, 7);
    const b = distributeCount(14, 5, 7);

    expect(a).toEqual(b);
  });

  it('groups가 0이면 빈 배열을 반환한다', () => {
    expect(distributeCount(0, 0, 0)).toEqual([]);
  });

  it('total이 groups보다 작으면 일부 그룹은 0개를 받는다', () => {
    const result = distributeCount(2, 4, 0);

    expect(result).toHaveLength(4);
    expect(result.reduce((sum, n) => sum + n, 0)).toBe(2);
    expect(result.filter((n) => n === 0)).toHaveLength(2);
  });
});

describe('createNestedSectorDivisions', () => {
  it('subCount개의 부채꼴 폴리곤을 생성한다', () => {
    const result = createNestedSectorDivisions(CENTER, 0, 0, 4, 3, BASE_RADIUS);

    expect(result).toHaveLength(3);
  });

  it('부모 부채꼴과 똑같은 각도 구간·반경 함수를 공유해, 합치면 부모와 정확히 일치한다', () => {
    const [parent] = createSectorDivisions(CENTER, 2, 4, BASE_RADIUS);
    const nested = createNestedSectorDivisions(CENTER, 2, 0, 4, 3, BASE_RADIUS);

    const parentRing = parent[0][0];
    const firstNestedRing = nested[0][0][0];
    const lastNestedRing = nested[nested.length - 1][0][0];

    // 중첩 분할의 첫 경계점은 부모 부채꼴의 시작 경계점과, 마지막 경계점은 부모의 끝
    // 경계점과 정확히 같아야 한다(부모의 각도 범위를 그대로 나눠 쓰기 때문).
    expect(firstNestedRing[1]).toEqual(parentRing[1]);
    expect(lastNestedRing[lastNestedRing.length - 2]).toEqual(
      parentRing[parentRing.length - 2],
    );
  });

  it('동일한 입력이면 항상 동일한 결과를 반환한다 (결정적)', () => {
    const a = createNestedSectorDivisions(CENTER, 3, 1, 4, 2, BASE_RADIUS);
    const b = createNestedSectorDivisions(CENTER, 3, 1, 4, 2, BASE_RADIUS);

    expect(a).toEqual(b);
  });
});
