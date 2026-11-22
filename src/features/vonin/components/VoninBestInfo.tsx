import { VONIN_BEST_PRODUCT } from '../helper/voninMainData';
import { truncateText } from '../helper/voninTruncate';

// BestInfo.as 그대로: 베스트 상품 1건, 내용 25자 초과 말줄임.
export function VoninBestInfo() {
  return (
    <div className="vonin-best-info">
      <img src={VONIN_BEST_PRODUCT.img} alt={VONIN_BEST_PRODUCT.title} />
      <div className="vonin-best-info-title">{VONIN_BEST_PRODUCT.title}</div>
      <p className="vonin-best-info-txt">
        {truncateText(VONIN_BEST_PRODUCT.txt, 25)}
      </p>
      <span className="vonin-best-info-more">more</span>
    </div>
  );
}
