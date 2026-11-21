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
  /** 이벤트 아이템 스프라이트(주방·거실은 corner_icon.png, 침실은 pet_icon_img.png). */
  image: string;
}

/**
 * 침실 전용 `bed/Dog.as`. 5초 후 등장해 2초마다 자기 위치에 이벤트 먼지를
 * 하나씩 떨어뜨리고(최대 `maxDust`개), 벽에 닿으면 방향을 무작위로 바꾼다.
 * 원본은 이벤트 먼지를 화면 밖에 미리 심어두고 그 위치만 옮기지만, 여기서는
 * 떨어뜨린 시점의 Dog 좌표를 그대로 새 이벤트 먼지 좌표로 추가한다.
 */
export interface DogConfig {
  start: Point;
  speed: number;
  showDelayMs: number;
  dustIntervalMs: number;
  maxDust: number;
}

export interface StageConfig {
  /** 클리어에 필요한 먼지 총량(`dustNum`). bed처럼 이벤트 먼지가 나중에 늘어나도 고정값이다. */
  totalDust: number;
  /** 실제 FLA에서 추출한 배경 이미지(776x714, stage_mc.xml 기준 tx=19,ty=228에 배치). */
  backgroundImage: string;
  robotStart: Point;
  walls: WallConfig[];
  dust: Point[];
  /** 초기 이벤트 먼지 배치. bed는 Dog가 나중에 채우므로 빈 배열로 시작한다. */
  eventDust: Point[];
  eventItem: EventItemConfig;
  speedIcon: Point;
  dog?: DogConfig;
}

/** 배경 이미지가 무대 안에서 차지하는 영역 — 세 스테이지가 동일한 배치를 쓴다. */
export const BACKGROUND_OFFSET: Point = { x: 19, y: 228 };
export const BACKGROUND_WIDTH = 776;
export const BACKGROUND_HEIGHT = 714;

/** 세 스테이지가 공유하는 스프라이트(크기는 원본 PNG 그대로). */
export const ROBOT_IMAGE = '/roboking/img/roboking.png';
export const ROBOT_WIDTH = 48;
export const ROBOT_HEIGHT = 52;
export const DUST_IMAGE = '/roboking/img/dust_1.png';
export const DUST_WIDTH = 23;
export const DUST_HEIGHT = 25;
export const SPEED_ICON_IMAGE = '/roboking/img/speed_icon.png';
export const ICON_SIZE = 39;

/** FLA `mc/wall_mc`의 로컬 크기(twips 1100x3099 → px 55x155). */
export const WALL_WIDTH = 55;
export const WALL_HEIGHT = 155;

/** 원본 Flash 무대 크기. */
export const STAGE_WIDTH = 810;
export const STAGE_HEIGHT = 1000;

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
