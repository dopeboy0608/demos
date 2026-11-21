import type { RawDraftPolygon } from '../helper/regionViewParser';

export interface RegionViewSearchParams {
  pdd: string;
  regionGroupCodes: string[];
  serviceType: string;
}

export interface RegionGroupListItem {
  regionGroupCode: string;
  zipCodeCount: number;
  regionCount: number;
  subRegionCount: number;
  regions: unknown[];
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
const MOCK_HAS_REGIONS: Record<string, boolean> = {
  A: true,
  B: true,
  C: false,
  D: true,
  E: true,
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
      regions: MOCK_HAS_REGIONS[code] ? [{}] : [],
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
