import { useState } from 'react';

import { XmarkGalleryThumb } from './XmarkGalleryThumb';
import { XmarkSortTabs } from './XmarkSortTabs';
import { XmarkStyleTabs } from './XmarkStyleTabs';
import { XMARK_GALLERY_PAGE_SIZE } from '../helper/xmarkGalleryConstants';
import { XMARK_GALLERY_ITEMS } from '../helper/xmarkGalleryData';
import {
  filterGalleryItemsByTab,
  getGalleryPageCount,
  paginateGalleryItems,
} from '../helper/xmarkGalleryFilter';
import type { XmarkStyle } from './XmarkStyleTabs';
import type { XmarkSortTab } from '../helper/xmarkGalleryConstants';

export function XmarkPortfolioGallery() {
  const [sortTab, setSortTab] = useState<XmarkSortTab>('all');
  const [style, setStyle] = useState<XmarkStyle>('gallery');
  const [page, setPage] = useState(0);

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

  const handleSortSelect = (tab: XmarkSortTab) => {
    setSortTab(tab);
    setPage(0);
  };

  return (
    <div className="xmark-portfolio">
      <div className="xmark-portfolio-tabs">
        <XmarkSortTabs activeTab={sortTab} onSelect={handleSortSelect} />
        <XmarkStyleTabs activeStyle={style} onSelect={setStyle} />
      </div>

      {style === 'gallery' ? (
        <>
          <div className="xmark-gallery-grid">
            {pageItems.map((item) => (
              <XmarkGalleryThumb key={item.id} item={item} />
            ))}
          </div>
          <div className="xmark-gallery-pager">
            {Array.from({ length: pageCount }, (_, i) => i).map((pageIndex) => (
              <button
                key={pageIndex}
                type="button"
                className={`xmark-gallery-page-btn${page === pageIndex ? ' xmark-gallery-page-btn-active' : ''}`}
                onClick={() => setPage(pageIndex)}
              >
                {pageIndex + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="xmark-portfolio-list-placeholder">
          리스트 영역 (다음 서브태스크에서 구현)
        </div>
      )}
    </div>
  );
}
