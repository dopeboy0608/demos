import { XmarkTileTransition } from './XmarkTileTransition';

// 원본 about_container는 텍스트 없이 100프레임짜리 모션 그래픽 심볼 하나로 구성되어 있어
// (about/about_container.xml), 추출 가능한 소개 문구가 없음. 80타일 전환 자체가 이 서브태스크의
// 핵심이라 내용은 최소한의 설명 텍스트로 대체함(결정 사항 ⑦ 범위).
export function XmarkAbout() {
  return (
    <XmarkTileTransition>
      <div className="xmark-about">
        <h2 className="xmark-about-title">X-MARK</h2>
        <p className="xmark-about-text">
          2012년에 만들어진 디지털 에이전시 X-MARK의 포트폴리오 사이트입니다.
          HERA, LG전자, 한율, 코카콜라, C9, LOEN 등 다양한 클라이언트의
          웹/광고/모바일 프로젝트를 진행했습니다.
        </p>
        <p className="xmark-about-text">
          (원본 페이지는 이 영역에 텍스트 대신 모션 그래픽 애니메이션을
          재생합니다. 이번 이관에서는 해당 모션 심볼을 추출하지 않고 설명
          텍스트로 대체했습니다.)
        </p>
      </div>
    </XmarkTileTransition>
  );
}
