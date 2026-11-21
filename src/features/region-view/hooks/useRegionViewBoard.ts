import { Modal, message } from 'antd';
import { useCallback, useRef, useState } from 'react';

import {
  fetchDraftPolygons,
  fetchRegionGroupList,
  fetchRegionGroupLocation,
  fetchRegionLocation,
  type LocationSearchPayload,
  type RegionGroupListItem,
  type RegionViewSearchParams,
} from '../api/regionViewApi';
import {
  CITY_HALL,
  DEFAULT_MAP_ZOOM_LEVEL,
  SEARCH_RESULT_ZOOM_LEVEL,
} from '../helper/constants';
import {
  type ParsedDraftPolygon,
  parseRegionViewDraftPolygon,
} from '../helper/regionViewParser';

export function useRegionViewBoard() {
  const [modal, modalContextHolder] = Modal.useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [draftPolygonList, setDraftPolygonList] = useState<
    ParsedDraftPolygon[]
  >([]);
  const [regionGroupList, setRegionGroupList] = useState<RegionGroupListItem[]>(
    [],
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [hasEmptyResult, setHasEmptyResult] = useState(false);

  const [mapCenter, setMapCenter] = useState(CITY_HALL);
  const [mapZoomLevel, setMapZoomLevel] = useState(DEFAULT_MAP_ZOOM_LEVEL);
  const [isSearchResultMarker, setIsSearchResultMarker] = useState(false);

  const searchParamsRef = useRef<RegionViewSearchParams | null>(null);
  const existingGroupCodesRef = useRef<string[]>([]);

  const fetchPolygons = useCallback(async () => {
    if (!searchParamsRef.current) return;
    const raw = await fetchDraftPolygons(searchParamsRef.current);
    setDraftPolygonList(
      parseRegionViewDraftPolygon(raw, existingGroupCodesRef.current),
    );
  }, []);

  const handleSearchSubmit = useCallback(
    async (params: RegionViewSearchParams) => {
      setIsLoading(true);
      searchParamsRef.current = params;

      try {
        const list = await fetchRegionGroupList(params);
        const emptyGroupCodes = list
          .filter((item) => !item.regions.length)
          .map((item) => item.regionGroupCode);

        if (emptyGroupCodes.length) {
          modal.error({
            width: 450,
            title: `${emptyGroupCodes.join(', ')} 센터에 설정된 지역이 없습니다.`,
          });
        }

        const nonEmptyGroups = list.filter((item) => item.regions.length);
        existingGroupCodesRef.current = nonEmptyGroups.map(
          (item) => item.regionGroupCode,
        );

        setRegionGroupList(nonEmptyGroups);
        setHasEmptyResult(nonEmptyGroups.length === 0);
        setHasSearched(true);
        await fetchPolygons();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPolygons, modal],
  );

  // 목업 데이터는 즉시 resolve되어 성능 이슈가 없으므로, 실제 API 연동 때 쓰던 디바운스는 생략한다.
  const handleUpdatedMap = useCallback(() => {
    if (hasSearched) {
      fetchPolygons();
    }
  }, [hasSearched, fetchPolygons]);

  const handleChangeZoomLevel = useCallback((level: number) => {
    setMapZoomLevel(level);
  }, []);

  // 검색 진행 후 줌/위치 변경이 끝난 뒤(1.5초)에 마커를 노출한다(지도가 갱신되면 마커가 사라지므로).
  const moveMapAndShowMarker = useCallback(
    (position: { lat: number; lng: number }, zoomLevel: number) => {
      setIsSearchResultMarker(false);
      setMapZoomLevel(zoomLevel);
      setMapCenter(position);
      setTimeout(() => setIsSearchResultMarker(true), 1500);
    },
    [],
  );

  const handleLocationSearchClick = useCallback(
    async (
      payload: string | LocationSearchPayload,
      searchType?: 'SUB_DIVISION' | 'MICRO_DIVISION',
    ) => {
      if (typeof payload === 'string') {
        const result = await fetchRegionGroupLocation(payload);
        if (!result) {
          message.error(`${payload} 권역에 설정된 지역이 없습니다.`);
          return;
        }
        setMapZoomLevel(8);
        setMapCenter(result.position);
        return;
      }

      const result = await fetchRegionLocation(payload);
      if (!result) {
        message.error('검색 결과가 없습니다.');
        return;
      }

      moveMapAndShowMarker(
        result.position,
        searchType === 'SUB_DIVISION' ? 6 : 5,
      );
    },
    [moveMapAndShowMarker],
  );

  const handleSearchResult = useCallback(
    ({
      searchType,
      position,
    }: {
      searchType: string;
      position: { lat: number; lng: number };
    }) => {
      moveMapAndShowMarker(position, SEARCH_RESULT_ZOOM_LEVEL[searchType] ?? 3);
    },
    [moveMapAndShowMarker],
  );

  return {
    isLoading,
    draftPolygonList,
    regionGroupList,
    hasSearched,
    hasEmptyResult,
    mapCenter,
    mapZoomLevel,
    isSearchResultMarker,
    handleSearchSubmit,
    handleUpdatedMap,
    handleChangeZoomLevel,
    handleLocationSearchClick,
    handleSearchResult,
    modalContextHolder,
  };
}
