import { RegionViewMap } from '@/features/region-view/components/RegionViewMap';
import { RegionViewMapGuard } from '@/features/region-view/components/RegionViewMapGuard';
import { RegionViewSearchPanel } from '@/features/region-view/components/RegionViewSearchPanel';
import { RegionViewTopBar } from '@/features/region-view/components/RegionViewTopBar';
import { useRegionViewBoard } from '@/features/region-view/hooks/useRegionViewBoard';
import '@/features/region-view/regionView.css';

export function RegionViewPage() {
  const board = useRegionViewBoard();

  return (
    <RegionViewMapGuard>
      <div className="region-view__wrapper">
        <RegionViewMap
          mapCenter={board.mapCenter}
          mapZoomLevel={board.mapZoomLevel}
          draftPolygonList={board.draftPolygonList}
          regionPolygonList={board.regionPolygonList}
          subRegionPolygonList={board.subRegionPolygonList}
          impossiblePolygonList={board.impossiblePolygonList}
          isImpossibleView={board.isImpossibleView}
          isSearchResultMarker={board.isSearchResultMarker}
          onChangeZoomLevel={board.handleChangeZoomLevel}
          onUpdatedMap={board.handleUpdatedMap}
        />
        <div className="region-view__top-bar">
          <RegionViewTopBar
            sortingTypeCode={board.sortingTypeCode}
            isImpossibleView={board.isImpossibleView}
            onSearchResult={board.handleSearchResult}
            onChangeSortingType={board.handleChangeSortingType}
            onChangeImpossibleView={board.handleChangeImpossibleView}
          />
        </div>
        <div className="region-view__search-panel">
          <RegionViewSearchPanel
            hasSearched={board.hasSearched}
            hasEmptyResult={board.hasEmptyResult}
            regionGroupList={board.regionGroupList}
            onSearchSubmit={board.handleSearchSubmit}
            onLocationSearchClick={board.handleLocationSearchClick}
            onDownloadZipcodeExcel={board.handleDownloadZipcodeExcel}
          />
        </div>
      </div>
      {board.modalContextHolder}
    </RegionViewMapGuard>
  );
}
