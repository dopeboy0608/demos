// `xml/menulink.xml`을 그대로 옮긴 3단계 메뉴 트리. `link`는 원본 주석대로 URL이 아니라
// 메뉴 표시 텍스트.
export interface VoninMenuNode {
  label: string;
  children?: VoninMenuNode[];
}

export const VONIN_MENU_TREE: VoninMenuNode[] = [
  {
    label: 'Brand',
    children: [
      { label: 'Brand Story' },
      {
        label: 'AD Story',
        children: [
          { label: '모델소개' },
          { label: 'TV CF' },
          { label: '지면광고' },
          { label: '현장스케치' },
        ],
      },
      {
        label: 'Gallery',
        children: [
          { label: '바탕화면' },
          { label: '블로그 스킨' },
          { label: '휴대폰 배경' },
        ],
      },
      { label: 'Notice' },
    ],
  },
  {
    label: 'Product',
    children: [
      { label: '특별기획' },
      { label: '신제품인기제품' },
      { label: 'Majesta' },
      { label: 'The Sprit' },
      { label: 'Vonin Rx II' },
      { label: "NY'Z" },
      { label: 'The Style' },
      { label: 'Sports_Rx' },
      { label: 'Pure' },
      { label: 'Exprim' },
    ],
  },
  {
    label: 'Cafe',
    children: [
      { label: '사용후기' },
      { label: 'Talk with BM' },
      { label: 'Vonin RSS' },
      { label: 'Grooming QA' },
      { label: 'Event' },
    ],
  },
  {
    label: "Man's Style",
    children: [{ label: "Vonin Man's Tip" }, { label: 'Vonin Different' }],
  },
];
