import { useRef, useState } from 'react';

import { XmarkGalleryGrid } from './XmarkGalleryGrid';
import { XmarkSortTabs } from './XmarkSortTabs';
import { XmarkStyleTabs } from './XmarkStyleTabs';
import { XMARK_GALLERY_PAGE_SIZE } from '../helper/xmarkGalleryConstants';
import { XMARK_GALLERY_ITEMS } from '../helper/xmarkGalleryData';
import {
  filterGalleryItemsByTab,
  getGalleryPageCount,
  paginateGalleryItems,
} from '../helper/xmarkGalleryFilter';
import type { XmarkGalleryGridHandle } from './XmarkGalleryGrid';
import type { XmarkStyle } from './XmarkStyleTabs';
import type { XmarkSortTab } from '../helper/xmarkGalleryConstants';

export function XmarkPortfolioGallery() {
  const [sortTab, setSortTab] = useState<XmarkSortTab>('all');
  const [style, setStyle] = useState<XmarkStyle>('gallery');
  const [page, setPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const gridRef = useRef<XmarkGalleryGridHandle>(null);

  const filteredItems = filterGalleryItemsByTab(XMARK_GALLERY_ITEMS, sortTab);
  const pageCount = getGalleryPageCount(
    filteredItems.length,
    XMARK_GALLERY_PAGE_SIZE,
  );
  const pageItems = paginateGalleryItems(
    filteredItems,
    page,
    XMARK_GALLERY_PAGE_SIZE,
  );

  // Portfolio/gallery/GalleryMain.as의 tabControl(false) + 썸네일 outThumb → addThumb 순서를 그대로 옮김:
  // 전환 중에는 입력을 잠그고(GNB/탭은 상위 XmarkStage가 아닌 이 화면의 탭만 해당), 기존 썸네일을
  // 먼저 퇴장시킨 뒤 페이지를 바꾸고 새 썸네일을 등장시킨다.
  const goToPage = (nextPage: number) => {
    if (
      isTransitioning ||
      nextPage < 0 ||
      nextPage >= pageCount ||
      nextPage === page
    ) {
      return;
    }
    setIsTransitioning(true);
    gridRef.current?.playExit(() => {
      setPage(nextPage);
      setIsTransitioning(false);
    });
  };

  const handleSortSelect = (tab: XmarkSortTab) => {
    if (isTransitioning) return;
    setSortTab(tab);
    setPage(0);
  };

  const handleStyleSelect = (next: XmarkStyle) => {
    if (isTransitioning) return;
    setStyle(next);
  };

  // 원본은 wheel delta<0일 때 다음 페이지였지만(Flash의 delta 부호 관례), 웹 휠 이벤트는
  // deltaY>0이 "아래로 스크롤"이라 다음 페이지로 매핑하는 것이 직관적이라 그대로 따름.
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      goToPage(page + 1);
    } else if (event.deltaY < 0) {
      goToPage(page - 1);
    }
  };

  return (
    <div className="xmark-portfolio">
      <div className="xmark-portfolio-tabs">
        <XmarkSortTabs
          activeTab={sortTab}
          onSelect={handleSortSelect}
          disabled={isTransitioning}
        />
        <XmarkStyleTabs
          activeStyle={style}
          onSelect={handleStyleSelect}
          disabled={isTransitioning}
        />
      </div>

      {style === 'gallery' ? (
        <div onWheel={handleWheel}>
          <XmarkGalleryGrid ref={gridRef} items={pageItems} />
          <div className="xmark-gallery-pager">
            {Array.from({ length: pageCount }, (_, i) => i).map((pageIndex) => (
              <button
                key={pageIndex}
                type="button"
                disabled={isTransitioning}
                className={`xmark-gallery-page-btn${page === pageIndex ? ' xmark-gallery-page-btn-active' : ''}`}
                onClick={() => goToPage(pageIndex)}
              >
                {pageIndex + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="xmark-portfolio-list-placeholder">
          리스트 영역 (다음 서브태스크에서 구현)
        </div>
      )}
    </div>
  );
}
