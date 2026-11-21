import { Modal, message } from 'antd';
import { useCallback, useRef, useState } from 'react';

import {
  fetchDraftPolygons,
  fetchImpossiblePolygons,
  fetchRegionGroupList,
  fetchRegionGroupLocation,
  fetchRegionLocation,
  fetchZipcodeExcelBlob,
  type LocationSearchPayload,
  type RegionGroupListItem,
  type RegionViewSearchParams,
} from '../api/regionViewApi';
import {
  CITY_HALL,
  DEFAULT_MAP_ZOOM_LEVEL,
  SEARCH_RESULT_ZOOM_LEVEL,
} from '../helper/constants';
import { downloadBlob } from '../helper/fileDownload';
import {
  type ParsedDraftPolygon,
  parseRegionViewDraftPolygon,
} from '../helper/regionViewParser';

type SearchFormParams = Omit<RegionViewSearchParams, 'sortingTypeCode'>;

export function useRegionViewBoard() {
  const [modal, modalContextHolder] = Modal.useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [draftPolygonList, setDraftPolygonList] = useState<
    ParsedDraftPolygon[]
  >([]);
  const [impossiblePolygonList, setImpossiblePolygonList] = useState<
    ParsedDraftPolygon[]
  >([]);
  const [regionGroupList, setRegionGroupList] = useState<RegionGroupListItem[]>(
    [],
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [hasEmptyResult, setHasEmptyResult] = useState(false);

  const [sortingTypeCode, setSortingTypeCode] = useState('NORMAL');
  const [isImpossibleView, setIsImpossibleView] = useState(true);

  const [mapCenter, setMapCenter] = useState(CITY_HALL);
  const [mapZoomLevel, setMapZoomLevel] = useState(DEFAULT_MAP_ZOOM_LEVEL);
  const [isSearchResultMarker, setIsSearchResultMarker] = useState(false);

  const searchParamsRef = useRef<RegionViewSearchParams | null>(null);
  const existingGroupCodesRef = useRef<string[]>([]);

  const fetchMapData = useCallback(async () => {
    if (!searchParamsRef.current) return;
    const [rawDraft, rawImpossible] = await Promise.all([
      fetchDraftPolygons(searchParamsRef.current),
      fetchImpossiblePolygons(searchParamsRef.current),
    ]);
    setDraftPolygonList(
      parseRegionViewDraftPolygon(rawDraft, existingGroupCodesRef.current),
    );
    setImpossiblePolygonList(
      parseRegionViewDraftPolygon(rawImpossible, [], false),
    );
  }, []);

  const runSearch = useCallback(
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
        await fetchMapData();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMapData, modal],
  );

  const handleSearchSubmit = useCallback(
    (formParams: SearchFormParams) =>
      runSearch({ ...formParams, sortingTypeCode }),
    [runSearch, sortingTypeCode],
  );

  // 이미 검색을 한 번 이상 실행한 상태에서만 동일 조건 + 새 분류유형으로 재검색한다.
  const handleChangeSortingType = useCallback(
    (code: string) => {
      setSortingTypeCode(code);
      if (searchParamsRef.current) {
        runSearch({ ...searchParamsRef.current, sortingTypeCode: code });
      }
    },
    [runSearch],
  );

  const handleChangeImpossibleView = useCallback((value: boolean) => {
    setIsImpossibleView(value);
  }, []);

  // 목업 데이터는 즉시 resolve되어 성능 이슈가 없으므로, 실제 API 연동 때 쓰던 디바운스는 생략한다.
  const handleUpdatedMap = useCallback(() => {
    if (hasSearched) {
      fetchMapData();
    }
  }, [hasSearched, fetchMapData]);

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

  const handleDownloadZipcodeExcel = useCallback(
    (pdd: string) => {
      const regionGroupCodes = regionGroupList.map(
        (item) => item.regionGroupCode,
      );

      modal.confirm({
        icon: null,
        width: 300,
        content: `${regionGroupCodes.join(', ')} 배송 센터의 우편번호를 엑셀 파일로 다운로드 받으시겠습니까?`,
        onOk: async () => {
          const blob = await fetchZipcodeExcelBlob({ pdd, regionGroupCodes });
          downloadBlob(blob, `우편번호_목록_배송예정일-${pdd}.csv`);
        },
      });
    },
    [regionGroupList, modal],
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
    impossiblePolygonList,
    regionGroupList,
    hasSearched,
    hasEmptyResult,
    sortingTypeCode,
    isImpossibleView,
    mapCenter,
    mapZoomLevel,
    isSearchResultMarker,
    handleSearchSubmit,
    handleChangeSortingType,
    handleChangeImpossibleView,
    handleUpdatedMap,
    handleChangeZoomLevel,
    handleLocationSearchClick,
    handleSearchResult,
    handleDownloadZipcodeExcel,
    modalContextHolder,
  };
}
