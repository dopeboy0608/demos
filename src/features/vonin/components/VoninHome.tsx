import { VoninBestInfo } from './VoninBestInfo';
import { VoninLinkButtons } from './VoninLinkButtons';
import { VoninNoticeboard } from './VoninNoticeboard';
import { VoninPlayer } from './VoninPlayer';
import { VoninSlide } from './VoninSlide';

// Main.as의 setting()에서 각 컴포넌트를 contents mc에 배치하는 좌표(bestInfo 874,631 /
// event 617,455 / flvPlayer 704,225 / notice 623,631)를 그대로의 상대 배치 순서로 재현.
// 캐러셀(visual1)은 서브태스크 02에서 추가.
export function VoninHome() {
  return (
    <div className="vonin-home">
      <div className="vonin-home-visual-placeholder">
        캐러셀 영역 (다음 서브태스크에서 구현)
      </div>

      <div className="vonin-home-side">
        <VoninPlayer />
        <VoninSlide />
        <div className="vonin-home-side-row">
          <VoninNoticeboard />
          <VoninBestInfo />
        </div>
        <VoninLinkButtons />
      </div>
    </div>
  );
}
