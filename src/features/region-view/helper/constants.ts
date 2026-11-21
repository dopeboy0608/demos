export const CITY_HALL = { lat: 37.566634, lng: 126.97836 };

export const DEFAULT_MAP_ZOOM_LEVEL = 12;

// 센터 기본 영역(폴리곤) 반경. 위도 37.5° 부근 기준 0.08° ≈ 8~9km로, 서울 "구" 단위 이상
// 크기를 목표로 한다(#47, #48).
export const CENTER_POLYGON_BASE_RADIUS = 0.08;

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

// 레거시 하드코딩 상수(REGION_GROUP_OPTIONS) 22개를 기반으로 한 센터 프로필 단일 소스.
// TEMP_REGION_GROUP_OPTIONS와 regionViewApi.ts의 목업 데이터(META/위치/폴리곤)가 모두 여기서 파생된다.
// TODO(API) 추후 getDeliveryCenters 등 실제 API 응답으로 교체.
export const REGION_GROUP_PROFILES: RegionGroupProfile[] = [
  {
    code: 'A',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 128,
    regionCount: 4,
    subRegionCount: 12,
    center: { lat: 37.57, lng: 126.98 },
  },
  {
    code: 'B',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 96,
    regionCount: 3,
    subRegionCount: 9,
    center: { lat: 37.5, lng: 127.03 },
  },
  {
    code: 'BS',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 210,
    regionCount: 6,
    subRegionCount: 18,
    center: { lat: 35.18, lng: 129.08 },
  },
  // C는 "설정된 지역이 없는 센터" 시나리오(FR-10)를 재현하기 위해 수치를 0으로 둔다.
  {
    code: 'C',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 0,
    regionCount: 0,
    subRegionCount: 0,
    center: { lat: 37.53, lng: 126.9 },
  },
  {
    code: 'D',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 64,
    regionCount: 2,
    subRegionCount: 6,
    center: { lat: 37.56, lng: 126.84 },
  },
  {
    code: 'DE',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 150,
    regionCount: 5,
    subRegionCount: 14,
    center: { lat: 36.35, lng: 127.38 },
  },
  {
    code: 'DW',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 180,
    regionCount: 5,
    subRegionCount: 15,
    center: { lat: 35.87, lng: 128.6 },
  },
  {
    code: 'F',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 72,
    regionCount: 2,
    subRegionCount: 7,
    center: { lat: 37.46, lng: 126.7 },
  },
  {
    code: 'G',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 58,
    regionCount: 2,
    subRegionCount: 5,
    center: { lat: 37.66, lng: 126.83 },
  },
  {
    code: 'GC',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 140,
    regionCount: 4,
    subRegionCount: 11,
    center: { lat: 35.16, lng: 126.85 },
  },
  {
    code: 'H',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 84,
    regionCount: 3,
    subRegionCount: 8,
    center: { lat: 37.26, lng: 127.01 },
  },
  {
    code: 'I',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 66,
    regionCount: 2,
    subRegionCount: 6,
    center: { lat: 37.44, lng: 127.14 },
  },
  {
    code: 'M',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 49,
    regionCount: 2,
    subRegionCount: 4,
    center: { lat: 37.32, lng: 126.83 },
  },
  {
    code: 'Q',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 77,
    regionCount: 3,
    subRegionCount: 7,
    center: { lat: 37.24, lng: 127.18 },
  },
  {
    code: 'R',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 55,
    regionCount: 2,
    subRegionCount: 5,
    center: { lat: 37.5, lng: 126.78 },
  },
  {
    code: 'S',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 61,
    regionCount: 2,
    subRegionCount: 6,
    center: { lat: 36.99, lng: 127.11 },
  },
  {
    code: 'T',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 112,
    regionCount: 3,
    subRegionCount: 9,
    center: { lat: 36.64, lng: 127.49 },
  },
  {
    code: 'UL',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 165,
    regionCount: 4,
    subRegionCount: 13,
    center: { lat: 35.54, lng: 129.31 },
  },
  {
    code: 'W',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 40,
    regionCount: 2,
    subRegionCount: 4,
    center: { lat: 37.65, lng: 127.06 },
  },
  {
    code: 'X',
    serviceType: SERVICE_TYPE.DAWN,
    zipCodeCount: 93,
    regionCount: 3,
    subRegionCount: 8,
    center: { lat: 37.51, lng: 127.11 },
  },
  {
    code: 'Y',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 35,
    regionCount: 1,
    subRegionCount: 3,
    center: { lat: 37.88, lng: 127.73 },
  },
  {
    code: 'Z',
    serviceType: SERVICE_TYPE.DAY,
    zipCodeCount: 88,
    regionCount: 3,
    subRegionCount: 7,
    center: { lat: 35.82, lng: 127.15 },
  },
];

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
