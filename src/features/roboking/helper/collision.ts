import { WALL_HEIGHT, WALL_WIDTH } from './stageConfig';
import type { Point, WallConfig } from './stageConfig';

/**
 * 벽은 `matrix(a,b,c,d,tx,ty)`로 변환된 55x155 사각형이다. 점을 벽의 역행렬로
 * 되돌려 로컬 좌표([0,55]x[0,155]) 안에 있는지로 충돌을 판정한다 — 회전된
 * 사각형과의 충돌을 삼각함수 없이 정확하게 계산할 수 있다.
 */
export function isPointInWall(point: Point, wall: WallConfig): boolean {
  const det = wall.a * wall.d - wall.b * wall.c;
  if (det === 0) return false;

  const dx = point.x - wall.tx;
  const dy = point.y - wall.ty;
  const localX = (wall.d * dx - wall.c * dy) / det;
  const localY = (-wall.b * dx + wall.a * dy) / det;

  return (
    localX >= 0 && localX <= WALL_WIDTH && localY >= 0 && localY <= WALL_HEIGHT
  );
}

export function findCollidingWall(
  point: Point,
  walls: WallConfig[],
): WallConfig | null {
  return walls.find((wall) => isPointInWall(point, wall)) ?? null;
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 반경 안에 있는 첫 번째 점의 인덱스를 돌려준다(원본 hitTestObject를 거리 기반으로 단순화). */
export function findNearestIndexWithinRadius(
  point: Point,
  points: Point[],
  radius: number,
): number | null {
  for (let i = 0; i < points.length; i++) {
    if (distance(point, points[i]) <= radius) return i;
  }
  return null;
}

/** 이미 먹은(collected) 인덱스는 건너뛰고, 반경 안의 첫 번째 미수집 인덱스를 돌려준다. */
export function findFirstUncollectedWithinRadius(
  point: Point,
  points: Point[],
  collectedIndices: ReadonlySet<number>,
  radius: number,
): number | null {
  for (let i = 0; i < points.length; i++) {
    if (collectedIndices.has(i)) continue;
    if (distance(point, points[i]) <= radius) return i;
  }
  return null;
}
