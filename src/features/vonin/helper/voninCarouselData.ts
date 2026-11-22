import { toAssetUrl } from '@/config/basepath';

import { VONIN_ROLL_PRODUCT_COUNT } from './voninMainData';

// `main.xml`의 rollproduct.url 실측 8건을 그대로 사용(Contents.as는 9개 무비클립(m1~m9)을
// 순환시키지만 실제 데이터는 8건뿐이라 데이터 개수를 기준으로 삼음).
export interface VoninCarouselProduct {
  id: number;
  label: string;
  img: string;
}

export const VONIN_CAROUSEL_PRODUCTS: VoninCarouselProduct[] = Array.from(
  { length: VONIN_ROLL_PRODUCT_COUNT },
  (_, i) => ({
    id: i,
    label: `상품 ${i + 1}`,
    img: toAssetUrl('/vonin/img/product_img.png'),
  }),
);
