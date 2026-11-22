import { VONIN_CAROUSEL_PRODUCTS } from '../helper/voninCarouselData';

// Contents.as의 캐러셀 틀: 7개 슬롯을 보여주고 맨 앞(0번 인덱스)을 정면 상품으로 강조한다.
// 원본은 구형 바이너리 FLA라 정확한 좌표(tgX/tgY)를 추출할 수 없어, 가로 일렬 배치로
// 단순화했다(결정 사항 참고). 자동 회전/휠 조작은 서브태스크 04/05에서 연결.
const VISIBLE_SLOTS = 7;

interface VoninCarouselProps {
  products?: typeof VONIN_CAROUSEL_PRODUCTS;
}

export function VoninCarousel({
  products = VONIN_CAROUSEL_PRODUCTS,
}: VoninCarouselProps) {
  const visible = products.slice(0, VISIBLE_SLOTS);

  return (
    <div className="vonin-carousel">
      {visible.map((product, index) => (
        <div
          key={product.id}
          className={`vonin-carousel-item${index === 0 ? ' vonin-carousel-item-front' : ''}`}
        >
          <img src={product.img} alt={product.label} />
          <span>{product.label}</span>
        </div>
      ))}
    </div>
  );
}
