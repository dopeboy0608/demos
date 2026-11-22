export type XmarkSortTab = 'all' | 'web' | 'ad' | 'flash' | 'gui' | 'mobile';

// 원본 gallery.xml 주석("0:web, 1:ad, 2:flash, 3:gui")은 sort 0~3만 설명한다.
// 실측 데이터에는 4, 5도 존재하는데 FR-04가 정의한 탭은 all/web/ad/flash/gui/mobile 5종뿐이라,
// 남은 탭인 mobile에 4와 5를 함께 묶었다(이슈 #52 "확인 필요 사항" 관련 추정, 사실조사 기록 참고).
export const XMARK_SORT_TAB_BY_VALUE: Record<
  number,
  Exclude<XmarkSortTab, 'all'>
> = {
  0: 'web',
  1: 'ad',
  2: 'flash',
  3: 'gui',
  4: 'mobile',
  5: 'mobile',
};

export const XMARK_SORT_TABS: { tab: XmarkSortTab; label: string }[] = [
  { tab: 'all', label: 'ALL' },
  { tab: 'web', label: 'WEB' },
  { tab: 'ad', label: 'AD' },
  { tab: 'flash', label: 'FLASH' },
  { tab: 'gui', label: 'GUI' },
  { tab: 'mobile', label: 'MOBILE' },
];

export const XMARK_GALLERY_PAGE_SIZE = 12;
export const XMARK_GALLERY_COLUMNS = 4;
