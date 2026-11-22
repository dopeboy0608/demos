import { toAssetUrl } from '@/config/basepath';

// `xml/main.xml` 더미 데이터를 그대로 옮긴 것. `bestproduct`/`bestremark`의 원본 이미지는
// 외부 핫링크(`image.auction.co.kr`)라 로컬 샘플 이미지(`product_img.png`)로 교체(결정 사항 참고).
export interface VoninSlideItem {
  id: number;
  img: string;
}

export interface VoninNoticeItem {
  txt: string;
  isNew: boolean;
}

export interface VoninBestRemarkProduct {
  id: number;
  title: string;
  txt: string;
  star: number;
}

export interface VoninTextItem {
  id: number;
  txt: string;
}

export const VONIN_ROLL_PRODUCT_COUNT = 8;

export const VONIN_STORY_LINKS = ['story1', 'story2'];

export const VONIN_SLIDES: VoninSlideItem[] = [
  { id: 0, img: toAssetUrl('/vonin/img/event.png') },
  { id: 1, img: toAssetUrl('/vonin/img/event.png') },
  { id: 2, img: toAssetUrl('/vonin/img/event.png') },
];

export const VONIN_NOTICES: VoninNoticeItem[] = [
  { txt: '1번내용입니다.', isNew: true },
  { txt: '2번내용입니다.', isNew: false },
  { txt: '3번내용입니다.', isNew: false },
];

export const VONIN_BEST_PRODUCT = {
  img: toAssetUrl('/vonin/img/product_img.png'),
  title: '타이틀',
  txt: '내용이 들어갈 자리입니다.내용이 들어갈 자리입니다.내용이 들어갈 자리입니다.내용이 들어갈 자리입니다.',
};

export const VONIN_BEST_REMARK = {
  img: toAssetUrl('/vonin/img/product_img.png'),
  title: '스피릿',
  txt: '안에들어갈내용안에들어갈내용안에들어갈내용안에들어갈내용안에들어갈내용',
  products: [
    {
      id: 0,
      title: '1번제목',
      txt: '1들어갈내용1들어갈내용1들어갈내용',
      star: 5,
    },
    { id: 1, title: '2번제목', txt: '2들어갈내용', star: 2 },
  ] as VoninBestRemarkProduct[],
};

export const VONIN_BM: VoninTextItem[] = [
  { id: 0, txt: 'bm1' },
  { id: 1, txt: 'bm2' },
  { id: 2, txt: 'bm3' },
];
export const VONIN_RSS: VoninTextItem[] = [
  { id: 0, txt: 'rss1' },
  { id: 1, txt: 'rss2rss2rss2rss2rss2rss2rss2rss2rss2rss2rss2' },
];
export const VONIN_QA: VoninTextItem[] = [
  { id: 0, txt: 'qa1' },
  { id: 1, txt: 'qa2qa2qa2qa2qa2qa2qa2qa2qa2qa2qa2qa2qa2' },
];
