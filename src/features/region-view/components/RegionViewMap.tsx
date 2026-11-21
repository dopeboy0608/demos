import {
  CustomOverlayMap,
  Map as KakaoMap,
  MapMarker,
  Polygon,
} from 'react-kakao-maps-sdk';

import type { ParsedDraftPolygon } from '../helper/regionViewParser';

interface RegionViewMapProps {
  mapCenter: { lat: number; lng: number };
  mapZoomLevel: number;
  draftPolygonList: ParsedDraftPolygon[];
  isSearchResultMarker: boolean;
  onChangeZoomLevel: (level: number) => void;
  onUpdatedMap: () => void;
}

export function RegionViewMap({
  mapCenter,
  mapZoomLevel,
  draftPolygonList,
  isSearchResultMarker,
  onChangeZoomLevel,
  onUpdatedMap,
}: RegionViewMapProps) {
  const handleZoomChanged = (map: kakao.maps.Map) => {
    onChangeZoomLevel(map.getLevel());
    onUpdatedMap();
  };

  return (
    <KakaoMap
      center={mapCenter}
      level={mapZoomLevel}
      maxLevel={12}
      style={{ width: '100%', height: '100%' }}
      onZoomChanged={handleZoomChanged}
      onDragEnd={onUpdatedMap}
    >
      {draftPolygonList.map((region) => {
        const key =
          region.regionGroupCode ?? region.code ?? region.blockCode ?? '';
        return (
          <Polygon
            key={`draft-polygon-${key}`}
            path={region.polygonPoints}
            strokeWeight={1}
            strokeColor="#4c4cff"
            strokeOpacity={1}
            strokeStyle="solid"
            fillColor={region.polygonColor}
            fillOpacity={0.4}
          />
        );
      })}

      {mapZoomLevel <= 10 &&
        draftPolygonList.map((region) => {
          const key =
            region.regionGroupCode ?? region.code ?? region.blockCode ?? '';
          return (
            <CustomOverlayMap key={`cluster-${key}`} position={region.center}>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #4c4cff',
                  borderRadius: 4,
                  padding: '2px 6px',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {key}
              </div>
            </CustomOverlayMap>
          );
        })}

      {isSearchResultMarker && <MapMarker position={mapCenter} />}
    </KakaoMap>
  );
}
