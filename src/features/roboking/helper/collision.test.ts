import { describe, expect, it } from 'vitest';

import {
  distance,
  findFirstUncollectedWithinRadius,
  findNearestIndexWithinRadius,
  isPointInWall,
} from './collision';
import type { WallConfig } from './stageConfig';

describe('isPointInWall', () => {
  it('축 정렬(회전 없음) 벽: 사각형 안의 점은 true, 밖은 false', () => {
    const wall: WallConfig = {
      name: 'w',
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 100,
      ty: 100,
    };

    expect(isPointInWall({ x: 120, y: 150 }, wall)).toBe(true);
    expect(isPointInWall({ x: 90, y: 90 }, wall)).toBe(false);
  });

  it('kitchenStageConfig의 실제 wall0(회전+반전 매트릭스)에 대해서도 정확히 판정한다', () => {
    // wall0: a=-1.752685546875, d=-3.33377075195313, tx=148.15, ty=772.45 (실제 추출값)
    const wall0: WallConfig = {
      name: 'wall0',
      a: -1.752685546875,
      b: 0,
      c: 0,
      d: -3.33377075195313,
      tx: 148.15,
      ty: 772.45,
    };

    // 로컬 중심(27.5, 77.5)을 정방향 변환한 좌표 — 벽 안쪽이어야 한다.
    const insidePoint = {
      x: wall0.tx + wall0.a * 27.5,
      y: wall0.ty + wall0.d * 77.5,
    };
    expect(isPointInWall(insidePoint, wall0)).toBe(true);

    // 주방 스테이지의 로봇 시작 위치는 wall0 바깥(열린 바닥)이어야 한다.
    expect(isPointInWall({ x: 185.2, y: 728.4 }, wall0)).toBe(false);
  });
});

describe('distance / findNearestIndexWithinRadius', () => {
  it('반경 안에 있는 첫 점의 인덱스를 반환하고, 없으면 null', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 10, y: 0 },
    ];

    expect(findNearestIndexWithinRadius({ x: 9, y: 0 }, points, 5)).toBe(2);
    expect(
      findNearestIndexWithinRadius({ x: 500, y: 500 }, points, 5),
    ).toBeNull();
  });

  it('distance는 두 점 사이 유클리드 거리를 반환한다', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});

describe('findFirstUncollectedWithinRadius', () => {
  it('이미 수집한 인덱스는 건너뛰고 다음 미수집 인덱스를 반환한다', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    const collected = new Set([0, 1]);

    expect(
      findFirstUncollectedWithinRadius({ x: 0, y: 0 }, points, collected, 5),
    ).toBe(2);
  });

  it('모두 수집됐거나 반경 밖이면 null', () => {
    const points = [{ x: 0, y: 0 }];
    expect(
      findFirstUncollectedWithinRadius({ x: 0, y: 0 }, points, new Set([0]), 5),
    ).toBeNull();
    expect(
      findFirstUncollectedWithinRadius(
        { x: 100, y: 100 },
        points,
        new Set(),
        5,
      ),
    ).toBeNull();
  });
});
