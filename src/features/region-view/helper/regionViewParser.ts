import { getTolerance } from './geometry';

const SOLID_COLORS = [
  '#ff0000',
  '#6f42c1',
  '#6EBE6E',
  '#F0AA60',
  '#ffff00',
  '#009999',
  '#0099ff',
  '#cc0099',
];

const OPACITY_COLORS = [
  'rgba(255,0,0,0.5)',
  'rgba(111,66,193,0.5)',
  'rgba(110,190,110,0.5)',
  'rgba(240,170,96,0.5)',
  'rgba(255,255,0,0.5)',
  'rgba(0,153,153,0.5)',
  'rgba(0,153,255,0.5)',
  'rgba(204,0,153,0.5)',
];

// 폴리곤 배열의 index가 아닌 코드로 색상을 매핑해, 지도 갱신 시에도 센터별 색이 바뀌지 않게 한다.
export function createRegionGroupColors(
  regionGroupCodes: string[],
  useOpacity = false,
): Record<string, string> {
  const palette = useOpacity ? OPACITY_COLORS : SOLID_COLORS;
  return Object.fromEntries(
    regionGroupCodes.map((code, index) => [
      code,
      palette[index % palette.length],
    ]),
  );
}

interface MapInfo {
  boundary: [number, number][];
  zoomLevel: number;
}

interface RegionViewSearchParams {
  pdd: string;
  regionGroupCodes: string[];
  [key: string]: unknown;
}

export function parseRegionViewPolygonSearchParams(
  mapInfo: MapInfo,
  searchParams: RegionViewSearchParams,
) {
  return {
    ...searchParams,
    boundary: {
      type: 'Polygon' as const,
      coordinates: [mapInfo.boundary],
      crs: { type: 'name' as const, properties: { name: 'EPSG:4326' } },
    },
    tolerance: getTolerance(mapInfo.zoomLevel),
  };
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RawDraftPolygon {
  regionGroupCode?: string;
  code?: string;
  blockCode?: string;
  geom: { coordinates: number[][][][] };
  [key: string]: unknown;
}

export interface ParsedDraftPolygon extends RawDraftPolygon {
  polygonPoints: LatLng[][];
  polygonColor: string;
  center: LatLng;
}

function flattenPolygonCoordinates(coordinates: number[][][][]): LatLng[][] {
  return coordinates.map((polygon) =>
    polygon.flatMap((ring) => ring.map(([lng, lat]) => ({ lat, lng }))),
  );
}

// 실제 centroid(jsts) 대신 첫 폴리곤 좌표의 평균점을 라벨 배치용 중심점으로 근사한다.
function approximateCenter(points: LatLng[]): LatLng {
  const sum = points.reduce(
    (acc, point) => ({ lat: acc.lat + point.lat, lng: acc.lng + point.lng }),
    { lat: 0, lng: 0 },
  );
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}

export function parseRegionViewDraftPolygon(
  data: RawDraftPolygon[],
  regionGroupCodes: string[],
  useColor = true,
): ParsedDraftPolygon[] {
  if (!data.length) return [];

  const regionGroupColors = createRegionGroupColors(regionGroupCodes);

  return data.map((region) => {
    const polygonPoints = flattenPolygonCoordinates(region.geom.coordinates);
    const colorKey = region.regionGroupCode ?? region.code ?? '';

    return {
      ...region,
      polygonPoints,
      polygonColor: useColor ? (regionGroupColors[colorKey] ?? '') : '',
      center: approximateCenter(polygonPoints[0] ?? []),
    };
  });
}
