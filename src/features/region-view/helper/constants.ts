export const CITY_HALL = { lat: 37.566634, lng: 126.97836 };

export const DEFAULT_MAP_ZOOM_LEVEL = 12;

export const SERVICE_TYPE = { DAWN: 'DAWN', DAY: 'DAY' } as const;

export const SERVICE_TYPE_OPTIONS = [
  { value: SERVICE_TYPE.DAWN, label: '샛별 배송' },
  { value: SERVICE_TYPE.DAY, label: '하루 배송' },
];

// [샛별배송] 배송 예정일 기본값이 내일로 바뀌는 기준 시각(legacy DELIVERY_DATE_TOMORROW_HOUR)
export const DELIVERY_DATE_TOMORROW_HOUR = 15;

export const DELIVERY_DATE_RANGE_DAYS = 31;

// TODO(API) 03에서 getDeliveryCenters 목업으로 교체
export const TEMP_REGION_GROUP_OPTIONS = [
  { code: 'A', serviceType: SERVICE_TYPE.DAWN },
  { code: 'B', serviceType: SERVICE_TYPE.DAWN },
  { code: 'C', serviceType: SERVICE_TYPE.DAWN },
  { code: 'D', serviceType: SERVICE_TYPE.DAY },
  { code: 'E', serviceType: SERVICE_TYPE.DAY },
];

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
