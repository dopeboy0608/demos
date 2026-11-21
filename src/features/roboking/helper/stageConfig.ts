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
  speedIcon: Point;
}

/** FLA `mc/wall_mc`의 로컬 크기(twips 1100x3099 → px 55x155). */
export const WALL_WIDTH = 55;
export const WALL_HEIGHT = 155;

/** `kitchen/StageMain.as`에서 그대로 옮긴 게임 규칙 상수. */
export const GAME_RULES = {
  /** 로봇 이동 속도(px/프레임). 스테이지 fps(48)에 맞춘 고정 타임스텝 1틱 = 1프레임. */
  normalSpeed: 3,
  speedUpSpeed: 5,
  /** 스피드업 지속 시간(초, 실제 시간 기준 — 원본은 1초 간격 Timer 10회). */
  speedUpDurationSeconds: 10,
  /** 코너 아이콘(이벤트 아이템) 등장까지 지연(ms, 실제 시간 기준 setTimeout). */
  cornerIconShowDelayMs: 4000,
  /** 코너 USP를 닫은 뒤 스피드 아이콘 등장까지 지연(ms). */
  speedIconShowDelayMs: 10000,
  /** 제한시간 단위. `_gameTime`이 1틱(1/48초)마다 2씩 증가해 6000에서 종료 → 62.5초. */
  endTimeUnits: 6000,
  timeUnitsPerTick: 2,
  /** 픽업 판정 반경(px). 원본 hitTestObject의 바운딩박스 겹침을 거리 기반으로 단순화. */
  pickupRadius: 20,
} as const;
