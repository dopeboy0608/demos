/**
 * `polygon-splitter`는 타입 선언을 제공하지 않아, 이 프로젝트가 실제로 쓰는 형태만
 * 최소로 선언한다 (전체 GeoJSON 스펙 재현 금지).
 */
declare module 'polygon-splitter' {
  type Position = [number, number];

  interface PolygonGeometry {
    type: 'Polygon';
    coordinates: Position[][];
  }

  interface MultiPolygonGeometry {
    type: 'MultiPolygon';
    coordinates: Position[][][];
  }

  interface LineStringGeometry {
    type: 'LineString';
    coordinates: Position[];
  }

  interface SplitFeature {
    type: 'Feature';
    properties: Record<string, unknown>;
    geometry: PolygonGeometry | MultiPolygonGeometry;
  }

  function polygonSplitter(
    polygon: PolygonGeometry | MultiPolygonGeometry,
    line: LineStringGeometry,
  ): PolygonGeometry | MultiPolygonGeometry | SplitFeature;

  export default polygonSplitter;
}
