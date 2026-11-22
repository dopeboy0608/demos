import { useMemo, useRef, useState } from 'react';

import { XmarkGalleryGrid } from './XmarkGalleryGrid';
import { XmarkPopup } from './XmarkPopup';
import { XmarkSortTabs } from './XmarkSortTabs';
import { useNonPassiveWheel } from '../hooks/useNonPassiveWheel';
import { XMARK_GALLERY_PAGE_SIZE } from '../helper/xmarkGalleryConstants';
import { XMARK_GALLERY_ITEMS } from '../helper/xmarkGalleryData';
import {
  filterGalleryItemsByTab,
  getGalleryPageCount,
  paginateGalleryItems,
} from '../helper/xmarkGalleryFilter';
import type { XmarkGalleryGridHandle } from './XmarkGalleryGrid';
import type { XmarkSortTab } from '../helper/xmarkGalleryConstants';
import type { XmarkGalleryItem } from '../helper/xmarkGalleryData';

export function XmarkPortfolioGallery() {
  const [sortTab, setSortTab] = useState<XmarkSortTab>('all');
  const [page, setPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeItem, setActiveItem] = useState<XmarkGalleryItem | null>(null);

  const gridRef = useRef<XmarkGalleryGridHandle>(null);

  // sortTab/page가 바뀔 때만 새 배열을 만든다. useMemo 없이 매 렌더마다 새 배열 참조를 만들면
  // activeItem(팝업) 상태만 바뀌어도 XmarkGalleryGrid의 items deps가 바뀐 것으로 인식되어
  // 등장 애니메이션이 불필요하게 다시 재생된다.
  const filteredItems = useMemo(
    () => filterGalleryItemsByTab(XMARK_GALLERY_ITEMS, sortTab),
    [sortTab],
  );
  const pageCount = getGalleryPageCount(
    filteredItems.length,
    XMARK_GALLERY_PAGE_SIZE,
  );
  const pageItems = useMemo(
    () => paginateGalleryItems(filteredItems, page, XMARK_GALLERY_PAGE_SIZE),
    [filteredItems, page],
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

  // 원본은 wheel delta<0일 때 다음 페이지였지만(Flash의 delta 부호 관례), 웹 휠 이벤트는
  // deltaY>0이 "아래로 스크롤"이라 다음 페이지로 매핑하는 것이 직관적이라 그대로 따름.
  // JSX onWheel은 passive 리스너라 preventDefault가 동작하지 않아 네이티브 리스너로 처리한다.
  const wheelRef = useNonPassiveWheel<HTMLDivElement>((event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      goToPage(page + 1);
    } else if (event.deltaY < 0) {
      goToPage(page - 1);
    }
  });

  return (
    <div className="xmark-portfolio">
      <div className="xmark-portfolio-tabs">
        <XmarkSortTabs
          activeTab={sortTab}
          onSelect={handleSortSelect}
          disabled={isTransitioning}
        />
      </div>

      <div ref={wheelRef} className="xmark-gallery-area">
        <XmarkGalleryGrid
          ref={gridRef}
          items={pageItems}
          onThumbClick={setActiveItem}
        />
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

      {activeItem && (
        <XmarkPopup item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </div>
  );
}
