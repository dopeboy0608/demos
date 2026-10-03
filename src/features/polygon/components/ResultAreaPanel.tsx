import { Button, Radio, Tag } from 'antd';
import { Map as KakaoMap, Polygon } from 'react-kakao-maps-sdk';

import type { PolygonBoard } from '../hooks/usePolygonBoard';

interface ResultAreaProps {
  board: PolygonBoard;
}

export function ResultAreaHeader({ board }: ResultAreaProps) {
  return (
    <div>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span># 결과 영역</span>
        <Button danger onClick={board.resetResults}>
          결과 영역 리셋
        </Button>
      </h4>
      <Radio.Group
        style={{ marginBottom: 8 }}
        value={board.polygonClickMode}
        onChange={({ target: { value } }) => board.setPolygonClickMode(value)}
      >
        <Radio.Button value="none">기능없음</Radio.Button>
        <Radio.Button value="edit">폴리곤 수정</Radio.Button>
        <Radio.Button value="select">다중선택</Radio.Button>
      </Radio.Group>
      <div>
        {board.selectedPolygons.map((polygonId) => (
          <Tag
            key={polygonId}
            closable
            onClose={(e) => {
              e.preventDefault();
              board.toggleSelectedPolygon(polygonId);
            }}
          >
            {polygonId}
          </Tag>
        ))}
      </div>
    </div>
  );
}

export function ResultAreaMap({ board }: ResultAreaProps) {
  const { resultsByGroup } = board;

  return (
    <KakaoMap
      className="delivery-region-test__map-wrapper"
      center={board.mapCenter}
      level={board.zoomLevel}
      disableDoubleClickZoom={true}
      disableDoubleClick={true}
      onZoomChanged={board.handleMapZoomChanged}
      onCenterChanged={board.handleMapCenterChanged}
    >
      {resultsByGroup.basic.map((path, index) => {
        const polygonId = `basic_${index}`;
        return (
          <Polygon
            key={polygonId}
            path={path}
            strokeWeight={2}
            strokeColor={'#b26bb2'}
            strokeOpacity={0.8}
            fillColor={'#f9f'}
            fillOpacity={board.selectedPolygons.includes(polygonId) ? 0.8 : 0.5}
            onClick={(polygon) =>
              board.handleResultPolygonClick(polygon, polygonId)
            }
          />
        );
      })}

      {resultsByGroup.punch.length > 0 && (
        <Polygon
          key="punch_polygon"
          path={resultsByGroup.punch}
          strokeWeight={2}
          strokeColor={'#b26bb2'}
          strokeOpacity={0.8}
          fillColor={'#f9f'}
          fillOpacity={
            board.selectedPolygons.includes('punch_polygon') ? 0.8 : 0.5
          }
          onClick={(polygon) =>
            board.handleResultPolygonClick(polygon, 'punch_polygon')
          }
        />
      )}

      {resultsByGroup.split.map((path, index) => {
        const polygonId = `split_${index}`;
        return (
          <Polygon
            key={polygonId}
            path={path}
            strokeWeight={2}
            strokeColor={'#b26bb2'}
            strokeOpacity={0.8}
            fillColor={'#f9f'}
            fillOpacity={board.selectedPolygons.includes(polygonId) ? 0.8 : 0.5}
            onClick={(polygon) =>
              board.handleResultPolygonClick(polygon, polygonId)
            }
          />
        );
      })}

      {resultsByGroup.merge.map((path, index) => {
        const polygonId = `merge_${index}`;
        return (
          <Polygon
            key={polygonId}
            path={path}
            strokeWeight={2}
            strokeColor={'#b26bb2'}
            strokeOpacity={0.8}
            fillColor={'#f9f'}
            fillOpacity={board.selectedPolygons.includes(polygonId) ? 0.8 : 0.5}
            onClick={(polygon) =>
              board.handleResultPolygonClick(polygon, polygonId)
            }
          />
        );
      })}
    </KakaoMap>
  );
}
