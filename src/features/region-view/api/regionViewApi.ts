import type { RawDraftPolygon } from '../helper/regionViewParser';

export interface RegionViewSearchParams {
  pdd: string;
  regionGroupCodes: string[];
  serviceType: string;
  sortingTypeCode: string;
}

export interface SubRegionItem {
  subRegionCode: string;
  deliveryRounds: string[];
}

export interface RegionItem {
  regionCode: string;
  sortingTypeCode: 'NORMAL' | 'ROOM_ONLY';
  subRegions: SubRegionItem[];
}

export interface RegionGroupListItem {
  regionGroupCode: string;
  zipCodeCount: number;
  regionCount: number;
  subRegionCount: number;
  regions: RegionItem[];
}

export interface LocationSearchPayload {
  regionGroupCode: string;
  code: string;
  sortingLevel: 'REGION' | 'SUB_REGION';
  sortingTypeCode: string;
}

export interface LocationResult {
  position: { lat: number; lng: number };
}

// TODO(API) 실제 백엔드 연동 시 이 파일의 함수들을 교체한다. 시그니처(params → Promise)는 그대로 유지.
const MOCK_REGION_META: Record<
  string,
  { zipCodeCount: number; regionCount: number; subRegionCount: number }
> = {
  A: { zipCodeCount: 128, regionCount: 4, subRegionCount: 12 },
  B: { zipCodeCount: 96, regionCount: 3, subRegionCount: 9 },
  C: { zipCodeCount: 0, regionCount: 0, subRegionCount: 0 },
  D: { zipCodeCount: 64, regionCount: 2, subRegionCount: 6 },
  E: { zipCodeCount: 40, regionCount: 2, subRegionCount: 4 },
};

// C는 "설정된 지역이 없는 센터" 시나리오(FR-10)를 재현하기 위해 의도적으로 regions를 비워둔다.
const MOCK_REGIONS: Record<string, RegionItem[]> = {
  A: [
    {
      regionCode: 'A01',
      sortingTypeCode: 'NORMAL',
      subRegions: [
        { subRegionCode: 'A01-1', deliveryRounds: ['1회차', '2회차'] },
        { subRegionCode: 'A01-2', deliveryRounds: ['1회차'] },
      ],
    },
    {
      regionCode: 'A02',
      sortingTypeCode: 'ROOM_ONLY',
      subRegions: [{ subRegionCode: 'A02-1', deliveryRounds: ['1회차'] }],
    },
  ],
  B: [
    {
      regionCode: 'B01',
      sortingTypeCode: 'NORMAL',
      subRegions: [
        { subRegionCode: 'B01-1', deliveryRounds: ['1회차'] },
        { subRegionCode: 'B01-2', deliveryRounds: [] },
      ],
    },
  ],
  C: [],
  D: [
    {
      regionCode: 'D01',
      sortingTypeCode: 'NORMAL',
      subRegions: [{ subRegionCode: 'D01-1', deliveryRounds: ['1회차'] }],
    },
  ],
  E: [
    {
      regionCode: 'E01',
      sortingTypeCode: 'NORMAL',
      subRegions: [{ subRegionCode: 'E01-1', deliveryRounds: ['1회차'] }],
    },
  ],
};

const MOCK_POLYGONS: Record<string, RawDraftPolygon> = {
  A: {
    regionGroupCode: 'A',
    geom: {
      coordinates: [
        [
          [
            [126.95, 37.58],
            [126.99, 37.58],
            [126.99, 37.6],
            [126.95, 37.6],
          ],
        ],
      ],
    },
  },
  B: {
    regionGroupCode: 'B',
    geom: {
      coordinates: [
        [
          [
            [126.99, 37.56],
            [127.03, 37.56],
            [127.03, 37.58],
            [126.99, 37.58],
          ],
        ],
      ],
    },
  },
  D: {
    regionGroupCode: 'D',
    geom: {
      coordinates: [
        [
          [
            [126.95, 37.54],
            [126.99, 37.54],
            [126.99, 37.56],
            [126.95, 37.56],
          ],
        ],
      ],
    },
  },
  E: {
    regionGroupCode: 'E',
    geom: {
      coordinates: [
        [
          [
            [126.99, 37.52],
            [127.03, 37.52],
            [127.03, 37.54],
            [126.99, 37.54],
          ],
        ],
      ],
    },
  },
};

// 센터 단위 위치보기(중심점)
const MOCK_CENTER_POSITIONS: Record<string, { lat: number; lng: number }> = {
  A: { lat: 37.59, lng: 126.97 },
  B: { lat: 37.57, lng: 127.01 },
  D: { lat: 37.55, lng: 126.97 },
  E: { lat: 37.53, lng: 127.01 },
};

// 소분류/세분류 단위 위치보기(코드별 좌표)
const MOCK_CODE_POSITIONS: Record<string, { lat: number; lng: number }> = {
  A01: { lat: 37.592, lng: 126.965 },
  'A01-1': { lat: 37.593, lng: 126.963 },
  'A01-2': { lat: 37.591, lng: 126.967 },
  A02: { lat: 37.598, lng: 126.985 },
  'A02-1': { lat: 37.599, lng: 126.986 },
  B01: { lat: 37.572, lng: 127.005 },
  'B01-1': { lat: 37.573, lng: 127.003 },
  'B01-2': { lat: 37.571, lng: 127.007 },
  D01: { lat: 37.552, lng: 126.965 },
  'D01-1': { lat: 37.553, lng: 126.963 },
  E01: { lat: 37.532, lng: 127.005 },
  'E01-1': { lat: 37.533, lng: 127.003 },
};

export function fetchRegionGroupList(
  params: RegionViewSearchParams,
): Promise<RegionGroupListItem[]> {
  return Promise.resolve(
    params.regionGroupCodes.map((code) => ({
      regionGroupCode: code,
      ...(MOCK_REGION_META[code] ?? {
        zipCodeCount: 0,
        regionCount: 0,
        subRegionCount: 0,
      }),
      regions: MOCK_REGIONS[code] ?? [],
    })),
  );
}

export function fetchDraftPolygons(
  params: RegionViewSearchParams,
): Promise<RawDraftPolygon[]> {
  return Promise.resolve(
    params.regionGroupCodes.flatMap((code) =>
      MOCK_POLYGONS[code] ? [MOCK_POLYGONS[code]] : [],
    ),
  );
}

// 불가지역(배송 불가 영역) 목업 폴리곤 — 검색된 센터 영역 안쪽에 작은 영역 하나를 겹쳐 둔다.
const MOCK_IMPOSSIBLE_POLYGONS: Record<string, RawDraftPolygon> = {
  A: {
    polygonId: 'impossible-A',
    geom: {
      coordinates: [
        [
          [
            [126.965, 37.585],
            [126.975, 37.585],
            [126.975, 37.59],
            [126.965, 37.59],
          ],
        ],
      ],
    },
  },
  B: {
    polygonId: 'impossible-B',
    geom: {
      coordinates: [
        [
          [
            [127.0, 37.565],
            [127.01, 37.565],
            [127.01, 37.57],
            [127.0, 37.57],
          ],
        ],
      ],
    },
  },
};

export function fetchImpossiblePolygons(
  params: RegionViewSearchParams,
): Promise<RawDraftPolygon[]> {
  return Promise.resolve(
    params.regionGroupCodes.flatMap((code) =>
      MOCK_IMPOSSIBLE_POLYGONS[code] ? [MOCK_IMPOSSIBLE_POLYGONS[code]] : [],
    ),
  );
}

export function fetchRegionGroupLocation(
  regionGroupCode: string,
): Promise<LocationResult | null> {
  const position = MOCK_CENTER_POSITIONS[regionGroupCode];
  return Promise.resolve(position ? { position } : null);
}

export function fetchRegionLocation(
  payload: LocationSearchPayload,
): Promise<LocationResult | null> {
  const position = MOCK_CODE_POSITIONS[payload.code];
  return Promise.resolve(position ? { position } : null);
}

// 신우편번호 5자리 → 좌표 목업(샘플 몇 개만 등록, 나머지는 결과 없음으로 처리)
const MOCK_ZIPCODE_POSITIONS: Record<string, { lat: number; lng: number }> = {
  '12345': { lat: 37.5665, lng: 126.9784 },
  '54321': { lat: 37.59, lng: 126.97 },
};

export function fetchZipcodeLocation(
  zipCode: string,
): Promise<LocationResult | null> {
  const position = MOCK_ZIPCODE_POSITIONS[zipCode];
  return Promise.resolve(position ? { position } : null);
}

// 배송주소(OMS) → 좌표 목업(주소 문자열에 특정 키워드가 포함되면 샘플 좌표 반환)
export function fetchOmsAddressLocation(
  fullAddress: string,
): Promise<LocationResult | null> {
  if (!fullAddress.trim()) return Promise.resolve(null);
  return Promise.resolve({ position: { lat: 37.5665, lng: 126.9784 } });
}

export interface ZipcodeExcelParams {
  pdd: string;
  regionGroupCodes: string[];
}

// 우편번호 엑셀 다운로드 목업 — 실제 API 연동 시 서버가 내려주는 blob으로 교체한다.
export function fetchZipcodeExcelBlob(
  params: ZipcodeExcelParams,
): Promise<Blob> {
  const rows = params.regionGroupCodes.map(
    (code) => `${code},${MOCK_REGION_META[code]?.zipCodeCount ?? 0}`,
  );
  const csv = ['배송센터,우편번호수', ...rows].join('\n');
  return Promise.resolve(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
}
