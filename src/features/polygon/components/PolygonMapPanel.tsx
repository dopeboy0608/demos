import { useState } from 'react';
import { Map as KakaoMap, Polygon, Polyline } from 'react-kakao-maps-sdk';

import { usePolygonMapPanel } from '../hooks/usePolygonMapPanel';
import type { LatLng, PanelId } from '../helper/types';

const MIN_POLYGON_VERTICES = 3;
const MIN_LINE_POINTS = 2;

// 서울시청 — 특별한 의미 없는 데모용 기본 중심 좌표
const DEFAULT_CENTER: LatLng = { lat: 37.5663, lng: 126.9779 };

interface PolygonMapPanelProps {
  panelId: PanelId;
}

export function PolygonMapPanel({ panelId }: PolygonMapPanelProps) {
  const { panel, finishDrawing, toggleSelect, finishSplit } =
    usePolygonMapPanel(panelId);
  const [draftPath, setDraftPath] = useState<LatLng[]>([]);
  const [draftLine, setDraftLine] = useState<LatLng[]>([]);

  const handleMapClick = (
    _map: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent,
  ) => {
    const latlng = mouseEvent.latLng;
    const point: LatLng = { lat: latlng.getLat(), lng: latlng.getLng() };
    if (panel.drawingMode) {
      setDraftPath((prev) => [...prev, point]);
    } else if (panel.splitMode) {
      setDraftLine((prev) => [...prev, point]);
    }
  };

  const handleMapDoubleClick = () => {
    if (panel.drawingMode) {
      // FR-003: 3개 미만이면 완료하지 않고 계속 입력을 받는다 (draftPath 유지)
      if (draftPath.length >= MIN_POLYGON_VERTICES) {
        finishDrawing(draftPath);
        setDraftPath([]);
      }
    } else if (panel.splitMode) {
      if (draftLine.length >= MIN_LINE_POINTS) {
        finishSplit(draftLine);
        setDraftLine([]);
      }
    }
  };

  return (
    <KakaoMap
      center={DEFAULT_CENTER}
      style={{ width: '100%', height: '400px' }}
      level={5}
      onClick={handleMapClick}
      onDoubleClick={handleMapDoubleClick}
    >
      {panel.polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          path={polygon.path}
          fillColor={polygon.selected ? '#2563eb' : '#f10000'}
          fillOpacity={polygon.selected ? 0.5 : 0.3}
          strokeColor={polygon.selected ? '#1d4ed8' : '#f10000'}
          onClick={() => toggleSelect(polygon.id)}
        />
      ))}
      {panel.drawingMode && draftPath.length > 0 && (
        <Polyline
          path={draftPath}
          strokeColor="#2563eb"
          strokeStyle="shortdash"
        />
      )}
      {panel.splitMode && draftLine.length > 0 && (
        <Polyline
          path={draftLine}
          strokeColor="#dc2626"
          strokeStyle="shortdash"
        />
      )}
    </KakaoMap>
  );
}
