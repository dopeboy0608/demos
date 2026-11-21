import {
  CENTER_POLYGON_BASE_RADIUS,
  REGION_GROUP_PROFILES,
} from '../helper/constants';
import { createNaturalPolygon } from '../helper/naturalPolygon';
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
// 아래 MOCK_* 는 모두 helper/constants.ts의 REGION_GROUP_PROFILES(단일 소스)에서 파생한다.

const MOCK_REGION_META: Record<
  string,
  { zipCodeCount: number; regionCount: number; subRegionCount: number }
> = Object.fromEntries(
  REGION_GROUP_PROFILES.map((profile) => [
    profile.code,
    {
      zipCodeCount: profile.zipCodeCount,
      regionCount: profile.regionCount,
      subRegionCount: profile.subRegionCount,
    },
  ]),
);

// C는 "설정된 지역이 없는 센터" 시나리오(FR-10)를 재현하기 위해 의도적으로 regions를 비워둔다.
function buildRegions(code: string, index: number): RegionItem[] {
  if (code === 'C') return [];

  const normalSubRegionCount = 1 + (index % 2);
  const normal: RegionItem = {
    regionCode: `${code}01`,
    sortingTypeCode: 'NORMAL',
    subRegions: Array.from({ length: normalSubRegionCount }, (_, i) => ({
      subRegionCode: `${code}01-${i + 1}`,
      deliveryRounds: i === 0 ? ['1회차', '2회차'] : ['1회차'],
    })),
  };

  // 짝수 인덱스 센터만 상온 only 구간도 함께 갖도록 해 다양성을 준다.
  if (index % 2 !== 0) return [normal];

  const roomOnly: RegionItem = {
    regionCode: `${code}02`,
    sortingTypeCode: 'ROOM_ONLY',
    subRegions: [{ subRegionCode: `${code}02-1`, deliveryRounds: ['1회차'] }],
  };

  return [normal, roomOnly];
}

const MOCK_REGIONS: Record<string, RegionItem[]> = Object.fromEntries(
  REGION_GROUP_PROFILES.map((profile, index) => [
    profile.code,
    buildRegions(profile.code, index),
  ]),
);

const MOCK_POLYGONS: Record<string, RawDraftPolygon> = Object.fromEntries(
  REGION_GROUP_PROFILES.map((profile, index) => [
    profile.code,
    {
      regionGroupCode: profile.code,
      geom: {
        coordinates: createNaturalPolygon(
          profile.center,
          index,
          CENTER_POLYGON_BASE_RADIUS,
        ),
      },
    },
  ]),
);

// 센터 단위 위치보기(중심점)
const MOCK_CENTER_POSITIONS: Record<string, { lat: number; lng: number }> =
  Object.fromEntries(
    REGION_GROUP_PROFILES.map((profile) => [profile.code, profile.center]),
  );

// 소분류/세분류 단위 위치보기(코드별 좌표) — 센터 중심에서 조금씩 떨어진 좌표로 생성한다.
function buildCodePositions(
  center: { lat: number; lng: number },
  regions: RegionItem[],
): Record<string, { lat: number; lng: number }> {
  const positions: Record<string, { lat: number; lng: number }> = {};

  regions.forEach((region, regionIndex) => {
    const regionOffset = 0.002 * (regionIndex + 1);
    positions[region.regionCode] = {
      lat: center.lat + regionOffset,
      lng: center.lng - regionOffset,
    };

    region.subRegions.forEach((subRegion, subRegionIndex) => {
      const subOffset = regionOffset + 0.001 * (subRegionIndex + 1);
      positions[subRegion.subRegionCode] = {
        lat: center.lat + subOffset,
        lng: center.lng - subOffset,
      };
    });
  });

  return positions;
}

const MOCK_CODE_POSITIONS: Record<string, { lat: number; lng: number }> =
  Object.assign(
    {},
    ...REGION_GROUP_PROFILES.map((profile) =>
      buildCodePositions(profile.center, MOCK_REGIONS[profile.code]),
    ),
  );

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
