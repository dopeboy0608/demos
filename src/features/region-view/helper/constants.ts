import gyeonggiDistricts from '../data/gyeonggiDistricts.json';
import seoulDistricts from '../data/seoulDistricts.json';

export const CITY_HALL = { lat: 37.566634, lng: 126.97836 };

// 페이지 최초 진입 시 지도 중심/줌 레벨. 서울시청을 중심으로 줌 8(기본 폴리곤 표시 기준점과
// 동일)로 시작한다(#51).
export const DEFAULT_MAP_ZOOM_LEVEL = 8;

// 센터 기본 영역(폴리곤) 반경. 위도 37.5° 부근 기준 0.08° ≈ 8~9km로, 서울 "구" 단위 이상
// 크기를 목표로 한다(#47, #48).
export const CENTER_POLYGON_BASE_RADIUS = 0.08;

// 지도 중심이 서울시청(CITY_HALL)일 때를 기준으로 한 폴리곤 표기 전환 줌 레벨(#47, #84).
// 레벨이 클수록 넓게 보임: 7 이상=기본(센터), 5~6=소분류, 4 이하=세분류. 기본 진입 레벨
// (DEFAULT_MAP_ZOOM_LEVEL=8)에서 두 번 확대(8→7→6)해야 소분류로 전환되도록, 기본 범위를
// 7까지 유지한다(한 번만 확대해도 바로 소분류로 바뀌던 문제 수정).
export const ZOOM_LEVEL_BASE = 7;
export const ZOOM_LEVEL_REGION_MIN = 5;

export const SERVICE_TYPE = { DAWN: 'DAWN', DAY: 'DAY' } as const;

export const SERVICE_TYPE_OPTIONS = [
  { value: SERVICE_TYPE.DAWN, label: '샛별 배송' },
  { value: SERVICE_TYPE.DAY, label: '하루 배송' },
];

// [샛별배송] 배송 예정일 기본값이 내일로 바뀌는 기준 시각(legacy DELIVERY_DATE_TOMORROW_HOUR)
export const DELIVERY_DATE_TOMORROW_HOUR = 15;

export const DELIVERY_DATE_RANGE_DAYS = 31;

export interface RegionGroupProfile {
  code: string;
  serviceType: string;
  zipCodeCount: number;
  regionCount: number;
  subRegionCount: number;
  center: { lat: number; lng: number };
  // 실제 경계 데이터를 쓰는 센터(서울시 25개 구, #64)만 채운다. 없으면 기존처럼
  // naturalPolygon.ts가 center/반경으로 폴리곤을 절차적으로 생성한다.
  name?: string;
  coordinates?: number[][][][];
}

type RegionGroupProfileData = Omit<RegionGroupProfile, 'center'>;

// 센터 폴리곤끼리 겹치지 않도록 격자 형태로 배치한다(#51). 센터 반경(CENTER_POLYGON_BASE_RADIUS)의
// 최대 변주 비율(1.36배, naturalPolygon.ts의 naturalRadius 진폭 참고)을 기준으로 격자 간격을
// "지름의 2배 + 여유분"만큼 띄워, 인접한 두 센터의 폴리곤이 수학적으로 겹칠 수 없게 한다.
const CENTER_MAX_RADIUS_RATIO = 1.36;
const GRID_MARGIN_RATIO = 1.15;
const GRID_COLUMNS = 5;
const GRID_SPACING_LNG =
  CENTER_POLYGON_BASE_RADIUS * CENTER_MAX_RADIUS_RATIO * 2 * GRID_MARGIN_RATIO;
// 위도 방향은 폴리곤 자체가 0.8배 눌려 있어(naturalPolygon.ts), 같은 비율로 간격도 줄인다.
const GRID_SPACING_LAT = GRID_SPACING_LNG * 0.8;

// 절차적 센터(21개) 격자의 기준점. 서울시 25개 구(#64)가 실제 좌표에 자리잡으므로,
// 격자가 서울과 겹치지 않도록 기준점을 서울 바깥(경북 지역 인근)으로 둔다. 서울시
// 대략적 범위는 위도 37.42~37.70, 경도 126.76~127.18 — 이 격자(5x5, 한 변 약 1도)는
// 그보다 충분히 남동쪽에 위치해 겹치지 않는다.
const PROCEDURAL_GRID_ANCHOR = { lat: 36.0, lng: 128.0 };

function gridCenter(
  index: number,
  totalRows: number,
): { lat: number; lng: number } {
  const row = Math.floor(index / GRID_COLUMNS);
  const col = index % GRID_COLUMNS;
  return {
    lat:
      PROCEDURAL_GRID_ANCHOR.lat +
      ((totalRows - 1) / 2 - row) * GRID_SPACING_LAT,
    lng:
      PROCEDURAL_GRID_ANCHOR.lng +
      (col - (GRID_COLUMNS - 1) / 2) * GRID_SPACING_LNG,
  };
}

// 레거시 하드코딩 상수(REGION_GROUP_OPTIONS) 22개를 기반으로 한 센터 프로필 단일 소스.
// TEMP_REGION_GROUP_OPTIONS와 regionViewApi.ts의 목업 데이터(META/위치/폴리곤)가 모두 여기서 파생된다.
// TODO(API) 추후 getDeliveryCenters 등 실제 API 응답으로 교체.
const REGION_GROUP_PROFILE_DATA: RegionGroupProfileData[] = [
  {
    code: 'A',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 128,
    regionCount: 4,
    subRegionCount: 12,
  },
  {
    code: 'B',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 96,
    regionCount: 3,
    subRegionCount: 9,
  },
  {
    code: 'BS',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 210,
    regionCount: 6,
    subRegionCount: 18,
  },
  // C는 "설정된 지역이 없는 센터" 시나리오(FR-10)를 재현하기 위해 수치를 0으로 둔다.
  {
    code: 'C',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 0,
    regionCount: 0,
    subRegionCount: 0,
  },
  {
    code: 'D',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 64,
    regionCount: 2,
    subRegionCount: 6,
  },
  {
    code: 'DE',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 150,
    regionCount: 5,
    subRegionCount: 14,
  },
  {
    code: 'DW',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 180,
    regionCount: 5,
    subRegionCount: 15,
  },
  {
    code: 'F',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 72,
    regionCount: 2,
    subRegionCount: 7,
  },
  {
    code: 'G',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 58,
    regionCount: 2,
    subRegionCount: 5,
  },
  {
    code: 'GC',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 140,
    regionCount: 4,
    subRegionCount: 11,
  },
  {
    code: 'H',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 84,
    regionCount: 3,
    subRegionCount: 8,
  },
  {
    code: 'I',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 66,
    regionCount: 2,
    subRegionCount: 6,
  },
  {
    code: 'M',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 49,
    regionCount: 2,
    subRegionCount: 4,
  },
  {
    code: 'Q',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 77,
    regionCount: 3,
    subRegionCount: 7,
  },
  {
    code: 'R',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 55,
    regionCount: 2,
    subRegionCount: 5,
  },
  {
    code: 'S',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 61,
    regionCount: 2,
    subRegionCount: 6,
  },
  {
    code: 'T',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 112,
    regionCount: 3,
    subRegionCount: 9,
  },
  {
    code: 'UL',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 165,
    regionCount: 4,
    subRegionCount: 13,
  },
  {
    code: 'W',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 40,
    regionCount: 2,
    subRegionCount: 4,
  },
  {
    code: 'X',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 93,
    regionCount: 3,
    subRegionCount: 8,
  },
  {
    code: 'Y',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 35,
    regionCount: 1,
    subRegionCount: 3,
  },
  {
    code: 'Z',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 88,
    regionCount: 3,
    subRegionCount: 7,
  },
];

const GRID_TOTAL_ROWS = Math.ceil(
  REGION_GROUP_PROFILE_DATA.length / GRID_COLUMNS,
);

const PROCEDURAL_PROFILES: RegionGroupProfile[] = REGION_GROUP_PROFILE_DATA.map(
  (data, index) => ({
    ...data,
    center: gridCenter(index, GRID_TOTAL_ROWS),
  }),
);

// 다각형 첫 번째 링의 좌표 평균으로 센터(위치보기/목록 표시용)를 근사한다. regionViewParser.ts의
// approximateCenter와 같은 방식이되, 입력 형식(number[][][][])이 달라 여기서 따로 둔다.
function approximatePolygonCenter(coordinates: number[][][][]): {
  lat: number;
  lng: number;
} {
  const ring = coordinates[0][0];
  const sum = ring.reduce(
    (acc, [lng, lat]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }),
    { lat: 0, lng: 0 },
  );
  return { lat: sum.lat / ring.length, lng: sum.lng / ring.length };
}

// 행정동(소분류) 하나당 시뮬레이션할 지번그룹(세분류) 평균 개수. 실제 지번 폴리곤이 없어
// splitAreaIntoPieces(#51)로 동 영역을 이만큼 조각내 세분류를 흉내낸다(#64/#69).
const SIMULATED_PARCEL_GROUPS_PER_DONG = 3;

// 서울시 25개 구를 실제 경계 데이터(#64/#67)로 센터 목록에 추가한다. regionCount는 실제
// 행정동 개수를 쓰고, subRegionCount(세분류=지번그룹 시뮬레이션)는 동당 평균
// SIMULATED_PARCEL_GROUPS_PER_DONG개로 추정한다(#69, regionViewApi.ts에서 동별 실제
// 분할 개수를 distributeCount로 다시 배정).
// 서비스유형: 샛별배송(DAWN)은 서울 센터 전용으로 고정한다(#84, 기존 홀짝 배정 로직 제거).
const SEOUL_DISTRICT_PROFILES: RegionGroupProfile[] = seoulDistricts.map(
  (district) => ({
    code: district.code,
    name: district.name,
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: district.dongCount * 10,
    regionCount: district.dongCount,
    subRegionCount: district.dongCount * SIMULATED_PARCEL_GROUPS_PER_DONG,
    center: approximatePolygonCenter(district.coordinates),
    coordinates: district.coordinates,
  }),
);

// 경기도 42개 시/군/구를 실제 경계 데이터(#91)로 센터 목록에 추가한다. 읍면동 단위 실데이터가
// 없어 regionCount/subRegionCount는 서울 평균 규모를 참고한 고정값으로 시뮬레이션한다
// (regionViewApi.ts의 buildGyeonggiDistrictDerived가 실제 시/군/구 경계를 조각내 사용).
// 서비스유형: 하루배송(DAY)은 경기 센터 전용으로 고정한다(#84).
const SIMULATED_GYEONGGI_REGION_COUNT = 4;
const SEOUL_AVG_DONG_COUNT =
  SEOUL_DISTRICT_PROFILES.reduce((sum, p) => sum + p.regionCount, 0) /
  SEOUL_DISTRICT_PROFILES.length;
const GYEONGGI_DISTRICT_PROFILES: RegionGroupProfile[] = gyeonggiDistricts.map(
  (district) => ({
    code: district.code,
    name: district.name,
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: Math.round(SEOUL_AVG_DONG_COUNT * 10),
    regionCount: SIMULATED_GYEONGGI_REGION_COUNT,
    subRegionCount:
      SIMULATED_GYEONGGI_REGION_COUNT * SIMULATED_PARCEL_GROUPS_PER_DONG,
    center: approximatePolygonCenter(district.coordinates),
    coordinates: district.coordinates,
  }),
);

export const REGION_GROUP_PROFILES: RegionGroupProfile[] = [
  ...PROCEDURAL_PROFILES,
  ...SEOUL_DISTRICT_PROFILES,
  ...GYEONGGI_DISTRICT_PROFILES,
];

// 절차적 가상센터(PROCEDURAL_PROFILES, A/B 등)는 서울·경기 행정구역 적용 전 임시 데이터이므로
// 검색조건 UI에는 비노출한다(#90). 데이터 자체(REGION_GROUP_PROFILES)는 롤백을 대비해 유지한다.
export const TEMP_REGION_GROUP_OPTIONS = REGION_GROUP_PROFILES.filter(
  (profile) => profile.name !== undefined,
).map((profile) => ({
  code: profile.code,
  name: profile.name,
  serviceType: profile.serviceType,
}));

// REGION_VIEW 화면에서 노출하는 검색 타입만 추림(정제주소 ADDRESS_DOS는 레거시에서도 사용 안 함).
export const LOCATION_SEARCH_TYPES = {
  ADDRESS: 'ADDRESS',
  ADDRESS_WITH_OMS: 'ADDRESS_WITH_OMS',
  ZIPCODE: 'ZIPCODE',
  LAT_LNG: 'LAT_LNG',
} as const;

export const LOCATION_SEARCH_TYPE_OPTIONS = [
  { value: LOCATION_SEARCH_TYPES.ADDRESS, label: '주소' },
  { value: LOCATION_SEARCH_TYPES.ADDRESS_WITH_OMS, label: '배송 주소' },
  { value: LOCATION_SEARCH_TYPES.ZIPCODE, label: '신우편번호' },
  { value: LOCATION_SEARCH_TYPES.LAT_LNG, label: '위경도' },
];

// 검색타입별 지도 이동 줌 레벨(레거시 onSearchResult 분기와 동일)
export const SEARCH_RESULT_ZOOM_LEVEL: Record<string, number> = {
  [LOCATION_SEARCH_TYPES.ADDRESS]: 2,
  [LOCATION_SEARCH_TYPES.ADDRESS_WITH_OMS]: 2,
  [LOCATION_SEARCH_TYPES.ZIPCODE]: 3,
  [LOCATION_SEARCH_TYPES.LAT_LNG]: 1,
};

export const REGION_SUB_SORTING_OPTIONS = [
  { label: '일반', value: 'NORMAL' },
  { label: '상온 only', value: 'ROOM_ONLY' },
];

// 배송센터/분류유형 토글의 pill 스타일을 한 곳에서 관리해 간격·모양을 일관되게 맞춘다.
export const TAG_PILL_STYLE = { borderRadius: 14, padding: '2px 10px' };
export const TAG_GROUP_GAP = 6;
