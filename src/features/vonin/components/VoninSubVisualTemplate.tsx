import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import '../vonin.css';

// VONIN_Sub_visual1~5.swf는 컴파일된 SWF라 디컴파일 도구 없이 원본 타임라인/이징을 추출할 수
// 없음(알려진 한계). 5종 모두 스프라이트 구성이 동일한 템플릿이라는 사실조사 결과에 따라, 03
// PoC에서 검증한 GSAP 접근으로 제목/부제/장식선이 순차적으로 떠오르는 공통 진입 연출만 재현한다.
const ENTER_DURATION_SECONDS = 0.6;
const ENTER_STAGGER_SECONDS = 0.15;

interface VoninSubVisualTemplateProps {
  title: string;
}

export function VoninSubVisualTemplate({ title }: VoninSubVisualTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>('[data-enter]');
    gsap.set(elements, { autoAlpha: 0, y: 24 });

    const timeline = gsap.timeline();
    elements.forEach((el, i) => {
      timeline.to(
        el,
        {
          autoAlpha: 1,
          y: 0,
          duration: ENTER_DURATION_SECONDS,
          ease: 'power2.out',
        },
        i * ENTER_STAGGER_SECONDS,
      );
    });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="vonin-sub-visual">
      <p className="vonin-sub-visual-eyebrow" data-enter>
        VONIN PRODUCT
      </p>
      <h1 className="vonin-sub-visual-title" data-enter>
        {title}
      </h1>
      <div className="vonin-sub-visual-line" data-enter />
    </div>
  );
}
