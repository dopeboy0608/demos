import {
  CENTER_POLYGON_BASE_RADIUS,
  type RegionGroupProfile,
  REGION_GROUP_PROFILES,
} from '../helper/constants';
import { createNaturalPolygon } from '../helper/naturalPolygon';
import {
  createAreaDivisions,
  distributeCount,
} from '../helper/radialSubdivision';
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

function padCode(n: number): string {
  return String(n).padStart(2, '0');
}

interface ProfileDerived {
  regions: RegionItem[];
  regionPolygons: RawDraftPolygon[];
  subRegionPolygons: RawDraftPolygon[];
}

// 좌측 목록(소분류/세분류 개수)과 지도 폴리곤 분할이 항상 일치하도록, 센터당 한 번만
// 계산한 subCounts(소분류별 세분류 배정 수)를 regions/regionPolygons/subRegionPolygons가
// 모두 공유한다. 코드 체계도 B01, B01-01처럼 목록과 폴리곤이 같은 번호를 쓴다(#51).
// C는 "설정된 지역이 없는 센터" 시나리오(FR-10)를 재현하기 위해 의도적으로 비워둔다.
function buildProfileDerived(
  profile: RegionGroupProfile,
  index: number,
): ProfileDerived {
  if (profile.regionCount === 0) {
    return { regions: [], regionPolygons: [], subRegionPolygons: [] };
  }

  const subCounts = distributeCount(
    profile.subRegionCount,
    profile.regionCount,
    index,
  );
  const regionPolygonCoordinates = createAreaDivisions(
    profile.center,
    index,
    profile.regionCount,
    CENTER_POLYGON_BASE_RADIUS,
  );
  // 세분류는 소분류 안에서 다시 나누는 대신, 센터 전체를 subRegionCount로 곧장 균형 분할한다.
  // 소분류별 subCount(2~4개 정도로 적음)에 갇혀 나누면 한쪽 축만 줄어들어 줌을 깊이 했을 때
  // 화면에 잘 안 들어맞는 문제가 있었다(#51). subRegionCount 전체를 한 번에 재귀 분할하면
  // 컷 횟수가 늘어 가로·세로 모두 고르게 작아진다 — 합치면 센터 영역과 여전히 정확히
  // 일치하지만, 소분류 경계선과 완전히 겹치지는 않는다(목업 수준에서는 허용 가능한 절충).
  const subRegionPolygonCoordinates = createAreaDivisions(
    profile.center,
    index,
    profile.subRegionCount,
    CENTER_POLYGON_BASE_RADIUS,
  );

  const regions: RegionItem[] = [];
  const regionPolygons: RawDraftPolygon[] = [];
  const subRegionPolygons: RawDraftPolygon[] = [];
  let subRegionCursor = 0;

  subCounts.forEach((subCount, regionIndex) => {
    const regionCode = `${profile.code}${padCode(regionIndex + 1)}`;
    // 마지막 소분류를 상온 only로 둬(2개 이상일 때) 기존 분류유형 토글 데모를 유지한다.
    const sortingTypeCode: RegionItem['sortingTypeCode'] =
      profile.regionCount >= 2 && regionIndex === profile.regionCount - 1
        ? 'ROOM_ONLY'
        : 'NORMAL';

    const subRegions: SubRegionItem[] = Array.from(
      { length: subCount },
      (_, subIndex) => ({
        subRegionCode: `${regionCode}-${padCode(subIndex + 1)}`,
        deliveryRounds: subIndex === 0 ? ['1회차', '2회차'] : ['1회차'],
      }),
    );

    regions.push({ regionCode, sortingTypeCode, subRegions });

    regionPolygons.push({
      regionGroupCode: profile.code,
      code: regionCode,
      geom: { coordinates: regionPolygonCoordinates[regionIndex] },
    });

    for (let subIndex = 0; subIndex < subCount; subIndex++) {
      subRegionPolygons.push({
        regionGroupCode: profile.code,
        code: `${regionCode}-${padCode(subIndex + 1)}`,
        geom: { coordinates: subRegionPolygonCoordinates[subRegionCursor] },
      });
      subRegionCursor++;
    }
  });

  return { regions, regionPolygons, subRegionPolygons };
}

const PROFILE_DERIVED: Record<string, ProfileDerived> = Object.fromEntries(
  REGION_GROUP_PROFILES.map((profile, index) => [
    profile.code,
    buildProfileDerived(profile, index),
  ]),
);

const MOCK_REGIONS: Record<string, RegionItem[]> = Object.fromEntries(
  REGION_GROUP_PROFILES.map((profile) => [
    profile.code,
    PROFILE_DERIVED[profile.code].regions,
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

// 소분류 단위 폴리곤 — 센터 영역을 regionCount개의 세로 띠로 촘촘하게 나눈다(#47, #49, #51).
const MOCK_REGION_POLYGONS: Record<string, RawDraftPolygon[]> =
  Object.fromEntries(
    REGION_GROUP_PROFILES.map((profile) => [
      profile.code,
      PROFILE_DERIVED[profile.code].regionPolygons,
    ]),
  );

// 세분류 단위 폴리곤 — 센터 전체 subRegionCount를 regionCount개 소분류에 시드 기반으로
// 분배한 뒤, 각 소분류 띠를 가로 방향으로 다시 촘촘하게 나눈다(#47, #50, #51).
const MOCK_SUBREGION_POLYGONS: Record<string, RawDraftPolygon[]> =
  Object.fromEntries(
    REGION_GROUP_PROFILES.map((profile) => [
      profile.code,
      PROFILE_DERIVED[profile.code].subRegionPolygons,
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

// 소분류 단위 폴리곤 조회 — 줌 레벨이 ZOOM_LEVEL_REGION_MIN~ZOOM_LEVEL_BASE-1 구간일 때 사용(#49).
export function fetchRegionAreaPolygons(
  params: RegionViewSearchParams,
): Promise<RawDraftPolygon[]> {
  return Promise.resolve(
    params.regionGroupCodes.flatMap((code) => MOCK_REGION_POLYGONS[code] ?? []),
  );
}

// 세분류 단위 폴리곤 조회 — 줌 레벨이 ZOOM_LEVEL_REGION_MIN 미만일 때 사용(#50).
export function fetchSubRegionAreaPolygons(
  params: RegionViewSearchParams,
): Promise<RawDraftPolygon[]> {
  return Promise.resolve(
    params.regionGroupCodes.flatMap(
      (code) => MOCK_SUBREGION_POLYGONS[code] ?? [],
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
