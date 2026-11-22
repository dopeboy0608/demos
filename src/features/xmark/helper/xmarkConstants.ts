export type XmarkTab = 'portfolio' | 'about' | 'contact' | 'story';

export const XMARK_GNB_TABS: { tab: XmarkTab; label: string }[] = [
  { tab: 'portfolio', label: 'Portfolio' },
  { tab: 'about', label: 'About' },
  { tab: 'contact', label: 'Contact' },
  { tab: 'story', label: 'Story' },
];

// 원본 XmarkMain.as의 alert("준비중입니다.") 문구 그대로 유지
export const XMARK_COMING_SOON_MESSAGE = '준비중입니다.';

// 원본 footer_img.png / ContextMenuItem 문구("COPYRIGHT 2009-2012 X-MARK") 그대로 유지
export const XMARK_FOOTER_TEXT = 'COPYRIGHT 2009-2012 X-MARK';
