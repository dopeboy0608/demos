import {
  XMARK_SORT_TAB_BY_VALUE,
  type XmarkSortTab,
} from './xmarkGalleryConstants';
import type { XmarkGalleryItem } from './xmarkGalleryData';

export function filterGalleryItemsByTab(
  items: XmarkGalleryItem[],
  tab: XmarkSortTab,
): XmarkGalleryItem[] {
  if (tab === 'all') {
    return items;
  }
  return items.filter((item) => XMARK_SORT_TAB_BY_VALUE[item.sort] === tab);
}

export function paginateGalleryItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): T[] {
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}

export function getGalleryPageCount(
  itemCount: number,
  pageSize: number,
): number {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}

// `ListManager.as`의 `_scrollLen = _listArr.length - 12` 그대로.
export function getListMaxScroll(
  itemCount: number,
  visibleRows: number,
): number {
  return Math.max(0, itemCount - visibleRows);
}
