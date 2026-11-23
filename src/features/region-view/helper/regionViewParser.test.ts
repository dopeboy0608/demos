import { describe, expect, it } from 'vitest';

import {
  createRegionGroupColors,
  parseRegionViewDraftPolygon,
  parseRegionViewPolygonSearchParams,
} from './regionViewParser';

describe('createRegionGroupColors', () => {
  it('센터 코드를 배열 순서가 아닌 코드 기준으로 색상에 매핑한다', () => {
    const colors = createRegionGroupColors(['A', 'B']);

    expect(colors.A).toBeDefined();
    expect(colors.B).toBeDefined();
    expect(colors.A).not.toBe(colors.B);
  });

  it('useOpacity가 true면 rgba 색상을 반환한다', () => {
    const colors = createRegionGroupColors(['A'], true);

    expect(colors.A).toMatch(/^rgba\(/);
  });
});

describe('parseRegionViewPolygonSearchParams', () => {
  it('지도 뷰포트와 검색조건을 합쳐 요청 payload를 만든다', () => {
    const mapInfo = {
      boundary: [[127.1, 37.6] as [number, number]],
      zoomLevel: 7,
    };
    const searchParams = { pdd: '2026-11-21', regionGroupCodes: ['A'] };

    const result = parseRegionViewPolygonSearchParams(mapInfo, searchParams);

    expect(result.pdd).toBe('2026-11-21');
    expect(result.regionGroupCodes).toEqual(['A']);
    expect(result.boundary).toEqual({
      type: 'Polygon',
      coordinates: [mapInfo.boundary],
      crs: { type: 'name', properties: { name: 'EPSG:4326' } },
    });
    expect(result.tolerance).toBeGreaterThan(0);
  });
});

describe('parseRegionViewDraftPolygon', () => {
  it('빈 배열이면 빈 배열을 반환한다', () => {
    expect(parseRegionViewDraftPolygon([], ['A'])).toEqual([]);
  });

  it('GeoJSON MultiPolygon 좌표를 평면화해 polygonPoints/polygonColor/center를 만든다', () => {
    const data = [
      {
        regionGroupCode: 'A',
        geom: {
          coordinates: [
            [
              [
                [127.0, 37.5],
                [127.1, 37.5],
                [127.1, 37.6],
                [127.0, 37.6],
              ],
            ],
          ],
        },
      },
    ];

    const [result] = parseRegionViewDraftPolygon(data, ['A']);

    expect(result.polygonPoints).toEqual([
      [
        { lat: 37.5, lng: 127.0 },
        { lat: 37.5, lng: 127.1 },
        { lat: 37.6, lng: 127.1 },
        { lat: 37.6, lng: 127.0 },
      ],
    ]);
    expect(result.polygonColor).toBeDefined();
    expect(result.center.lat).toBeCloseTo(37.55, 2);
    expect(result.center.lng).toBeCloseTo(127.05, 2);
  });

  it('구멍(hole)이 있는 폴리곤은 외곽 링과 구멍 링을 합치지 않고 별도 path로 둔다(#94)', () => {
    const outerRing = [
      [127.0, 37.5],
      [127.2, 37.5],
      [127.2, 37.7],
      [127.0, 37.7],
    ];
    const holeRing = [
      [127.05, 37.55],
      [127.1, 37.55],
      [127.1, 37.6],
    ];
    const data = [
      {
        regionGroupCode: 'A',
        geom: { coordinates: [[outerRing, holeRing]] },
      },
    ];

    const [result] = parseRegionViewDraftPolygon(data, ['A']);

    expect(result.polygonPoints).toHaveLength(2);
    expect(result.polygonPoints[0]).toHaveLength(outerRing.length);
    expect(result.polygonPoints[1]).toHaveLength(holeRing.length);
  });

  it('useColor가 false면 polygonColor를 빈 문자열로 둔다', () => {
    const data = [
      {
        code: 'X',
        geom: {
          coordinates: [
            [
              [
                [127.0, 37.5],
                [127.1, 37.5],
                [127.1, 37.6],
              ],
            ],
          ],
        },
      },
    ];

    const [result] = parseRegionViewDraftPolygon(data, [], false);

    expect(result.polygonColor).toBe('');
  });
});
