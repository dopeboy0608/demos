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
