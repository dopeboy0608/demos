export interface Point {
  x: number;
  y: number;
}

/**
 * 벽 하나의 배치. 원본 FLA의 `wall_mc`(55x155 사각형, 로컬 원점은 좌상단)를
 * CSS `matrix(a, b, c, d, tx, ty)`와 동일한 어파인 변환으로 그대로 옮긴 값이다.
 */
export interface WallConfig {
  name: string;
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface EventItemConfig {
  name: string;
  x: number;
  y: number;
}

export interface StageConfig {
  robotStart: Point;
  walls: WallConfig[];
  dust: Point[];
  eventDust: Point[];
  eventItem: EventItemConfig;
}

/** FLA `mc/wall_mc`의 로컬 크기(twips 1100x3099 → px 55x155). */
export const WALL_WIDTH = 55;
export const WALL_HEIGHT = 155;
