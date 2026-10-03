import { message } from 'antd';
import { useCallback, useRef, useState } from 'react';

import {
  applyPolygonOperation,
  type OperationType,
} from '../helper/polygonOperations';
import { splitPolygon } from '../helper/polygonSplit';
import type { LatLng, PolygonClickMode, ResultGroup } from '../helper/types';

const DEFAULT_CENTER: LatLng = { lat: 37.5001272, lng: 127.0334435 }; // 한국타이어빌딩

export type DrawnOverlayType =
  | kakao.maps.drawing.OverlayType.POLYGON
  | kakao.maps.drawing.OverlayType.POLYLINE;
export type DrawingManagerHandle =
  kakao.maps.drawing.DrawingManager<DrawnOverlayType>;

function toLatLngPoints(points: Array<{ x: number; y: number }>): LatLng[] {
  // DrawingManager.getData()가 반환하는 x/y는 WGS84 좌표(x=lng, y=lat)다.
  return points.map(({ x, y }) => ({ lat: y, lng: x }));
}

/**
 * "그리기 영역"(왼쪽 지도)에서 그린 폴리곤/분할선으로 연산을 실행하고, 그 결과를
 * "결과 영역"(오른쪽 지도)에 그룹별(basic/split/punch/merge)로 반영하는 보드 상태를 관리한다.
 */
export function usePolygonBoard() {
  const [mapCenter, setMapCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [zoomLevel, setZoomLevel] = useState(4);

  const [resultsByGroup, setResultsByGroup] = useState<
    Record<ResultGroup, LatLng[][]>
  >({
    basic: [],
    split: [],
    punch: [],
    merge: [],
  });

  const [polygonClickMode, setPolygonClickMode] =
    useState<PolygonClickMode>('none');
  const [selectedPolygons, setSelectedPolygons] = useState<string[]>([]);

  const mapRef = useRef<kakao.maps.Map | null>(null);
  const drawingManagerRef = useRef<DrawingManagerHandle | null>(null);

  const startPolygonDrawing = useCallback(() => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    manager.cancel();
    manager.select('polygon');
  }, []);

  const startLineDrawing = useCallback(() => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    manager.cancel();
    manager.select('polyline');
  }, []);

  const saveBasicPolygons = useCallback(() => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    const drawnPolygons = manager
      .getData()
      .polygon.map(({ points }) => toLatLngPoints(points));
    setResultsByGroup((prev) => ({ ...prev, basic: drawnPolygons }));
  }, []);

  const executeSplit = useCallback(() => {
    const manager = drawingManagerRef.current;
    if (!manager) return;

    const { polygon, polyline } = manager.getData();
    if (!polygon.length || !polyline.length) {
      message.error('폴리곤과 선을 그려주세요.');
      return;
    }
    if (polygon.length > 1) {
      message.warning('처음 생성한 폴리곤에만 자르기가 적용됩니다.');
    }
    if (polyline.length > 1) {
      message.warning('처음 생성한 라인으로 자르기가 적용됩니다.');
    }

    const targetPath = toLatLngPoints(polygon[0].points);
    const linePath = toLatLngPoints(polyline[0].points);
    const splitResult = splitPolygon(targetPath, linePath);

    if (splitResult.length === 0) {
      message.error('분할선이 폴리곤을 가로지르지 않습니다.');
      return;
    }

    setResultsByGroup((prev) => ({ ...prev, split: splitResult }));
  }, []);

  const executePunch = useCallback(() => {
    const manager = drawingManagerRef.current;
    if (!manager) return;

    const drawnPolygons = manager.getData().polygon;
    if (drawnPolygons.length < 2) {
      message.error('폴리곤을 그려주세요.');
      return;
    }

    // 폴리곤 2개 이상을 그대로 여러 ring으로 쌓아 하나의 Polygon에 전달하면
    // antd/react-kakao-maps-sdk가 첫 ring을 외곽선, 나머지를 구멍으로 그린다.
    const rings = drawnPolygons.map(({ points }) => toLatLngPoints(points));
    setResultsByGroup((prev) => ({ ...prev, punch: rings }));
  }, []);

  const executeMerge = useCallback((operationType: OperationType) => {
    const manager = drawingManagerRef.current;
    if (!manager) return;

    const drawnPolygons = manager.getData().polygon;
    if (drawnPolygons.length < 2) {
      message.error('폴리곤을 2개 이상 그려주세요.');
      return;
    }

    const paths = drawnPolygons.map(({ points }) => toLatLngPoints(points));
    const mergeResult = applyPolygonOperation(operationType, paths);

    if (mergeResult.length === 0) {
      const errorMessage =
        operationType === 'union'
          ? '병합 결과가 없습니다.'
          : operationType === 'intersection'
            ? '폴리곤들은 겹쳐있어야 합니다.'
            : '';
      if (errorMessage) message.error(errorMessage);
    }

    setResultsByGroup((prev) => ({ ...prev, merge: mergeResult }));
  }, []);

  const printResult = useCallback(() => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    console.log(manager.getData());
  }, []);

  const resetDrawing = useCallback(() => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    const overlays = manager.getOverlays();
    [...overlays.polygon, ...overlays.polyline].forEach((overlay) => {
      manager.remove(overlay);
    });
  }, []);

  const resetResults = useCallback(() => {
    setResultsByGroup({ basic: [], split: [], punch: [], merge: [] });
    setSelectedPolygons([]);
  }, []);

  const toggleSelectedPolygon = useCallback((polygonId: string) => {
    setSelectedPolygons((prev) =>
      prev.includes(polygonId)
        ? prev.filter((id) => id !== polygonId)
        : [...prev, polygonId],
    );
  }, []);

  const handleResultPolygonClick = useCallback(
    (polygon: kakao.maps.Polygon, polygonId: string) => {
      const manager = drawingManagerRef.current;
      if (!manager) return;
      const polygonPaths = polygon.getPath();

      switch (polygonClickMode) {
        case 'none':
          message.info(`클릭된 폴리곤 ::: ${polygonId}`, 3);
          break;
        case 'edit':
          if (Array.isArray(polygonPaths[0])) {
            (polygonPaths as unknown as kakao.maps.LatLng[][]).forEach(
              (path) => {
                manager.put('polygon', path);
              },
            );
          } else {
            manager.put('polygon', polygonPaths as kakao.maps.LatLng[]);
          }
          break;
        case 'select':
          toggleSelectedPolygon(polygonId);
          break;
      }
    },
    [polygonClickMode, toggleSelectedPolygon],
  );

  const handleMapCenterChanged = useCallback((map: kakao.maps.Map) => {
    setMapCenter({
      lat: map.getCenter().getLat(),
      lng: map.getCenter().getLng(),
    });
  }, []);

  const handleMapZoomChanged = useCallback((map: kakao.maps.Map) => {
    setZoomLevel(map.getLevel());
  }, []);

  return {
    mapRef,
    drawingManagerRef,
    mapCenter,
    zoomLevel,
    resultsByGroup,
    polygonClickMode,
    setPolygonClickMode,
    selectedPolygons,
    startPolygonDrawing,
    startLineDrawing,
    saveBasicPolygons,
    executeSplit,
    executePunch,
    executeMerge,
    printResult,
    resetDrawing,
    resetResults,
    toggleSelectedPolygon,
    handleResultPolygonClick,
    handleMapCenterChanged,
    handleMapZoomChanged,
  };
}

export type PolygonBoard = ReturnType<typeof usePolygonBoard>;
