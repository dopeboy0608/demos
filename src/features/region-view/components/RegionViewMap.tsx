import {
  CustomOverlayMap,
  Map as KakaoMap,
  MapMarker,
  Polygon,
} from 'react-kakao-maps-sdk';

import { ZOOM_LEVEL_BASE, ZOOM_LEVEL_REGION_MIN } from '../helper/constants';
import type { ParsedDraftPolygon } from '../helper/regionViewParser';

interface RegionViewMapProps {
  mapCenter: { lat: number; lng: number };
  mapZoomLevel: number;
  draftPolygonList: ParsedDraftPolygon[];
  regionPolygonList: ParsedDraftPolygon[];
  subRegionPolygonList: ParsedDraftPolygon[];
  impossiblePolygonList: ParsedDraftPolygon[];
  isImpossibleView: boolean;
  isSearchResultMarker: boolean;
  onChangeZoomLevel: (level: number) => void;
  onUpdatedMap: () => void;
}

export function RegionViewMap({
  mapCenter,
  mapZoomLevel,
  draftPolygonList,
  regionPolygonList,
  subRegionPolygonList,
  impossiblePolygonList,
  isImpossibleView,
  isSearchResultMarker,
  onChangeZoomLevel,
  onUpdatedMap,
}: RegionViewMapProps) {
  // 줌 레벨에 따라 기본(센터)/소분류/세분류 폴리곤을 전환한다(#47, #50).
  const visiblePolygonList =
    mapZoomLevel >= ZOOM_LEVEL_BASE
      ? draftPolygonList
      : mapZoomLevel >= ZOOM_LEVEL_REGION_MIN
        ? regionPolygonList
        : subRegionPolygonList;

  const handleZoomChanged = (map: kakao.maps.Map) => {
    onChangeZoomLevel(map.getLevel());
    onUpdatedMap();
  };

  // react-kakao-maps-sdk@1.2.2가 Map.js 내부에서 minLevel/maxLevel prop을 setMaxLevel/
  // setMinLevel에 뒤바꿔 연결하는 버그가 있어(zoom-in이 막히는 원인이었음), 해당 prop 대신
  // onCreate에서 kakao map 인스턴스에 직접 호출해 우회한다.
  const handleCreate = (map: kakao.maps.Map) => {
    map.setMaxLevel(12);
  };

  return (
    <KakaoMap
      center={mapCenter}
      level={mapZoomLevel}
      style={{ width: '100%', height: '100%' }}
      onCreate={handleCreate}
      onZoomChanged={handleZoomChanged}
      onDragEnd={onUpdatedMap}
    >
      {visiblePolygonList.map((region) => {
        // 소분류 폴리곤은 한 센터 안에서 regionGroupCode가 모두 같으므로, 고유한
        // code(예: A-R1)를 우선 키로 쓴다(기본 폴리곤은 code가 없어 regionGroupCode로 대체).
        const key =
          region.code ?? region.regionGroupCode ?? region.blockCode ?? '';
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

      {impossiblePolygonList.map((region) => {
        const key = region.polygonId ?? region.code ?? '';
        return (
          <Polygon
            key={`impossible-polygon-${key}`}
            path={region.polygonPoints}
            strokeWeight={1}
            strokeColor="#000000"
            strokeOpacity={0}
            strokeStyle="longdash"
            fillColor="#931818"
            fillOpacity={isImpossibleView ? 0.7 : 0}
          />
        );
      })}

      {mapZoomLevel >= ZOOM_LEVEL_BASE &&
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
