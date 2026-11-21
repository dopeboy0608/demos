import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import {
  AURA2_LAYER_XML,
  CORNER_ICON_LAYER_1_XML,
} from '../helper/xflSampleSymbols';
import { parseSymbolKeyframes, toGsapSteps } from '../helper/xflTimeline';
import type { GsapStep } from '../helper/xflTimeline';

import '../roboking.css';

function playSteps(el: HTMLElement, steps: GsapStep[]) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

  for (const step of steps) {
    const vars = {
      x: step.matrix.tx,
      y: step.matrix.ty,
      scaleX: step.matrix.a,
      scaleY: step.matrix.d,
      skewX: step.matrix.b,
      autoAlpha: step.alpha,
      filter: step.filter
        ? `drop-shadow(0 0 ${Math.max(step.filter.blurX, step.filter.blurY)}px ${step.filter.color ?? '#ffff00'})`
        : 'none',
      ease: step.ease,
    };

    if (step.type === 'set') {
      timeline.set(el, vars);
    } else {
      timeline.to(el, { ...vars, duration: step.durationSeconds });
    }
  }

  return timeline;
}

export function PocTimelinePreview() {
  const cornerIconRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timelines: gsap.core.Timeline[] = [];

    if (cornerIconRef.current) {
      const steps = toGsapSteps(
        parseSymbolKeyframes(CORNER_ICON_LAYER_1_XML),
        48,
      );
      timelines.push(playSteps(cornerIconRef.current, steps));
    }
    if (auraRef.current) {
      const steps = toGsapSteps(parseSymbolKeyframes(AURA2_LAYER_XML), 48);
      timelines.push(playSteps(auraRef.current, steps));
    }

    return () => {
      for (const tl of timelines) tl.kill();
    };
  }, []);

  return (
    <div className="roboking-poc">
      <div className="roboking-poc-item">
        <p>corner_icon (클래식 트윈: 스케일 팝 + 알파 페이드아웃)</p>
        <div className="roboking-poc-stage">
          <div ref={cornerIconRef} className="roboking-poc-corner-icon" />
        </div>
      </div>
      <div className="roboking-poc-item">
        <p>aura2 (모션 트윈 + GlowFilter)</p>
        <div className="roboking-poc-stage">
          <div ref={auraRef} className="roboking-poc-aura" />
        </div>
      </div>
    </div>
  );
}
