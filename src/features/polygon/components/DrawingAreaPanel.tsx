import { Button } from 'antd';
import { DrawingManager, Map as KakaoMap } from 'react-kakao-maps-sdk';

import type { DrawnOverlayType, PolygonBoard } from '../hooks/usePolygonBoard';
import { PolygonToolbar } from './PolygonToolbar';

interface DrawingAreaPanelProps {
  board: PolygonBoard;
}

export function DrawingAreaPanel({ board }: DrawingAreaPanelProps) {
  return (
    <section style={{ flex: 1, minWidth: 360 }}>
      <h4>
        <span style={{ verticalAlign: 'middle' }}># 그리기 영역</span>
        <Button className="ml-3" danger onClick={board.resetDrawing}>
          그리기 영역 리셋
        </Button>
      </h4>
      <PolygonToolbar board={board} />
      <KakaoMap
        ref={board.mapRef}
        className="delivery-region-test__map-wrapper"
        center={board.mapCenter}
        level={board.zoomLevel}
        disableDoubleClickZoom={true}
        disableDoubleClick={true}
        onZoomChanged={board.handleMapZoomChanged}
        onCenterChanged={board.handleMapCenterChanged}
      >
        <DrawingManager<DrawnOverlayType>
          ref={board.drawingManagerRef}
          drawingMode={['polyline', 'polygon']}
          guideTooltip={['draw', 'drag', 'edit']}
          markerOptions={{ draggable: true, removable: true }}
          polylineOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: '#39f',
            hintStrokeStyle: 'dash',
            hintStrokeOpacity: 0.5,
          }}
          polygonOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: '#39f',
            fillColor: '#39f',
            fillOpacity: 0.5,
            hintStrokeStyle: 'dash',
            hintStrokeOpacity: 0.5,
          }}
        />
      </KakaoMap>
    </section>
  );
}
