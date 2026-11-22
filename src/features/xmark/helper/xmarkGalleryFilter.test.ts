import { describe, expect, it } from 'vitest';

import type { XmarkGalleryItem } from './xmarkGalleryData';
import {
  filterGalleryItemsByTab,
  getGalleryPageCount,
  paginateGalleryItems,
} from './xmarkGalleryFilter';

function makeItem(sort: number, title: string): XmarkGalleryItem {
  return {
    id: sort,
    isNew: false,
    title,
    sort,
    type: 'image',
    thumb: '/xmark/img/img0.jpg',
    files: [],
    width: null,
    height: null,
    date: '2012 02 14',
    company: 'TEST',
    link: '',
    content: '',
  };
}

describe('filterGalleryItemsByTab', () => {
  const items = [
    makeItem(0, 'web-item'),
    makeItem(1, 'ad-item'),
    makeItem(2, 'flash-item'),
    makeItem(3, 'gui-item'),
    makeItem(4, 'mobile-item-4'),
    makeItem(5, 'mobile-item-5'),
  ];

  it('all 탭은 전체 항목을 그대로 반환한다', () => {
    expect(filterGalleryItemsByTab(items, 'all')).toHaveLength(6);
  });

  it('sort 0~3은 web/ad/flash/gui에 1:1로 매핑된다', () => {
    expect(filterGalleryItemsByTab(items, 'web').map((i) => i.title)).toEqual([
      'web-item',
    ]);
    expect(filterGalleryItemsByTab(items, 'ad').map((i) => i.title)).toEqual([
      'ad-item',
    ]);
    expect(filterGalleryItemsByTab(items, 'flash').map((i) => i.title)).toEqual(
      ['flash-item'],
    );
    expect(filterGalleryItemsByTab(items, 'gui').map((i) => i.title)).toEqual([
      'gui-item',
    ]);
  });

  it('sort 4와 5는 둘 다 mobile 탭으로 묶인다', () => {
    expect(
      filterGalleryItemsByTab(items, 'mobile').map((i) => i.title),
    ).toEqual(['mobile-item-4', 'mobile-item-5']);
  });
});

describe('paginateGalleryItems', () => {
  const items = Array.from({ length: 14 }, (_, i) => i);

  it('페이지당 12개씩 자른다', () => {
    expect(paginateGalleryItems(items, 0, 12)).toEqual(items.slice(0, 12));
    expect(paginateGalleryItems(items, 1, 12)).toEqual(items.slice(12, 14));
  });

  it('범위를 벗어난 페이지는 빈 배열을 반환한다', () => {
    expect(paginateGalleryItems(items, 2, 12)).toEqual([]);
  });
});

describe('getGalleryPageCount', () => {
  it('나누어 떨어지지 않으면 올림한다', () => {
    expect(getGalleryPageCount(14, 12)).toBe(2);
    expect(getGalleryPageCount(24, 12)).toBe(2);
    expect(getGalleryPageCount(25, 12)).toBe(3);
  });

  it('항목이 0개여도 최소 1페이지를 반환한다', () => {
    expect(getGalleryPageCount(0, 12)).toBe(1);
  });
});
