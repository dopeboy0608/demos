import { gsap } from 'gsap';
import { useRef, useState } from 'react';

import { VoninCafeView } from './VoninCafeView';
import { VoninHome } from './VoninHome';
import { VoninTopNavi } from './VoninTopNavi';
import { VoninUtilButtons } from './VoninUtilButtons';

import '../vonin.css';

type VoninView = 'home' | 'cafe';

// Main.as의 changeViewSetting()/changeView()/closeSlide()/changeView2() 그대로: cut_mc가
// 끝까지 재생된 뒤 화면을 교체하고 역재생하는 컷 트랜지션을, 짧은 페이드 아웃→교체→페이드 인으로
// 단순화해 재현(결정 사항 ⑤ — 과한 연출 비용 대신 동일한 전환 "느낌"만 재현).
const CUT_DURATION_SECONDS = 0.25;

export function VoninStage() {
  const [view, setView] = useState<VoninView>('home');
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleView = () => {
    const el = contentRef.current;
    if (!el) {
      setView((prev) => (prev === 'home' ? 'cafe' : 'home'));
      return;
    }
    gsap.to(el, {
      autoAlpha: 0,
      duration: CUT_DURATION_SECONDS,
      ease: 'power1.in',
      onComplete: () => {
        setView((prev) => (prev === 'home' ? 'cafe' : 'home'));
        gsap.to(el, {
          autoAlpha: 1,
          duration: CUT_DURATION_SECONDS,
          ease: 'power1.out',
        });
      },
    });
  };

  return (
    <div className="vonin-stage">
      <header className="vonin-header">
        <VoninTopNavi />
        <VoninUtilButtons />
      </header>

      <button type="button" className="vonin-view-toggle" onClick={toggleView}>
        {view === 'home' ? 'CAFE 보기' : 'HOME 보기'}
      </button>

      <div ref={contentRef}>
        {view === 'home' ? <VoninHome /> : <VoninCafeView />}
      </div>
    </div>
  );
}
