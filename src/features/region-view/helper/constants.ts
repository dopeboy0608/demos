export const CITY_HALL = { lat: 37.566634, lng: 126.97836 };

// 페이지 최초 진입 시 지도 중심/줌 레벨. 서울시청을 중심으로 줌 8(기본 폴리곤 표시 기준점과
// 동일)로 시작한다(#51).
export const DEFAULT_MAP_ZOOM_LEVEL = 8;

// 센터 기본 영역(폴리곤) 반경. 위도 37.5° 부근 기준 0.08° ≈ 8~9km로, 서울 "구" 단위 이상
// 크기를 목표로 한다(#47, #48).
export const CENTER_POLYGON_BASE_RADIUS = 0.08;

// 지도 중심이 서울시청(CITY_HALL)일 때를 기준으로 한 폴리곤 표기 전환 줌 레벨(#47).
// 레벨이 클수록 넓게 보임: 8 이상=기본(센터), 6~7=소분류, (추후 #50) 5 이하=세분류.
export const ZOOM_LEVEL_BASE = 8;
export const ZOOM_LEVEL_REGION_MIN = 6;

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

function gridCenter(
  index: number,
  totalRows: number,
): { lat: number; lng: number } {
  const row = Math.floor(index / GRID_COLUMNS);
  const col = index % GRID_COLUMNS;
  return {
    lat: CITY_HALL.lat + ((totalRows - 1) / 2 - row) * GRID_SPACING_LAT,
    lng: CITY_HALL.lng + (col - (GRID_COLUMNS - 1) / 2) * GRID_SPACING_LNG,
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

export const REGION_GROUP_PROFILES: RegionGroupProfile[] =
  REGION_GROUP_PROFILE_DATA.map((data, index) => ({
    ...data,
    center: gridCenter(index, GRID_TOTAL_ROWS),
  }));

export const TEMP_REGION_GROUP_OPTIONS = REGION_GROUP_PROFILES.map(
  (profile) => ({
    code: profile.code,
    serviceType: profile.serviceType,
  }),
);

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
