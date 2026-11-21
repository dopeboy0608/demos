import { Modal } from 'antd';
import { useCallback, useRef, useState } from 'react';

import {
  fetchDraftPolygons,
  fetchRegionGroupList,
  type RegionViewSearchParams,
} from '../api/regionViewApi';
import { CITY_HALL, DEFAULT_MAP_ZOOM_LEVEL } from '../helper/constants';
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
  const [hasSearched, setHasSearched] = useState(false);
  const [hasEmptyResult, setHasEmptyResult] = useState(false);

  // 지도 중심 이동(위치보기)은 04에서 다루므로 여기서는 고정값으로 둔다.
  const [mapCenter] = useState(CITY_HALL);
  const [mapZoomLevel, setMapZoomLevel] = useState(DEFAULT_MAP_ZOOM_LEVEL);

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

  return {
    isLoading,
    draftPolygonList,
    hasSearched,
    hasEmptyResult,
    mapCenter,
    mapZoomLevel,
    handleSearchSubmit,
    handleUpdatedMap,
    handleChangeZoomLevel,
    modalContextHolder,
  };
}
