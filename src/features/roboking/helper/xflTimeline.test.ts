import { describe, expect, it } from 'vitest';

import { AURA2_LAYER_XML, CORNER_ICON_LAYER_1_XML } from './xflSampleSymbols';
import { parseSymbolKeyframes, toGsapSteps } from './xflTimeline';

describe('parseSymbolKeyframes', () => {
  it('corner_icon: 키프레임 4개(0,6,11,20)를 읽고, 매트릭스 생략 시 단위행렬로 채운다', () => {
    const frames = parseSymbolKeyframes(CORNER_ICON_LAYER_1_XML);

    expect(frames.map((f) => f.frameIndex)).toEqual([0, 6, 11, 20]);
    expect(frames[0].isTweenStart).toBe(true);
    expect(frames[0].matrix).toEqual({ a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 });
    expect(frames[1].isTweenStart).toBe(false);
    expect(frames[1].matrix).toEqual({
      a: 1.57998657226563,
      b: 0,
      c: 0,
      d: 1.57998657226563,
      tx: -11.3,
      ty: -11.3,
    });
    expect(frames[3].alpha).toBe(0);
  });

  it('aura2: GlowFilter와 acceleration(이징) 값을 읽는다', () => {
    const frames = parseSymbolKeyframes(AURA2_LAYER_XML);

    expect(frames).toHaveLength(2);
    expect(frames[0].acceleration).toBe(-100);
    expect(frames[0].filter).toEqual({
      type: 'glow',
      blurX: 0,
      blurY: 0,
      color: undefined,
      strength: 0,
    });
    expect(frames[1].filter).toEqual({
      type: 'glow',
      blurX: 20,
      blurY: 20,
      color: '#FFFF00',
      strength: undefined,
    });
  });
});

describe('toGsapSteps', () => {
  it('corner_icon: 트윈 구간은 "to", 고정 구간은 "set"으로 변환하고 프레임을 초 단위로 바꾼다', () => {
    const fps = 48; // stage_kitchen.fla 기준
    const steps = toGsapSteps(
      parseSymbolKeyframes(CORNER_ICON_LAYER_1_XML),
      fps,
    );

    expect(steps).toHaveLength(4);

    expect(steps[0]).toMatchObject({
      atFrame: 0,
      durationFrames: 6,
      type: 'to',
      ease: 'none',
    });
    expect(steps[0].durationSeconds).toBeCloseTo(6 / 48);
    expect(steps[0].matrix.a).toBeCloseTo(1.57998657226563);

    expect(steps[1]).toMatchObject({
      atFrame: 6,
      durationFrames: 5,
      type: 'set',
    });
    expect(steps[2]).toMatchObject({
      atFrame: 11,
      durationFrames: 9,
      type: 'to',
    });
    expect(steps[2].alpha).toBe(0);

    expect(steps[3]).toMatchObject({ atFrame: 20, type: 'set' });
    expect(steps[3].alpha).toBe(0);
  });

  it('aura2: 단일 트윈은 acceleration<0일 때 ease-out으로 매핑한다', () => {
    const steps = toGsapSteps(parseSymbolKeyframes(AURA2_LAYER_XML), 50);

    expect(steps[0]).toMatchObject({
      type: 'to',
      ease: 'power2.out',
      durationFrames: 59,
    });
    expect(steps[0].filter).toMatchObject({
      blurX: 20,
      blurY: 20,
      color: '#FFFF00',
    });
    expect(steps[1]).toMatchObject({ type: 'set' });
  });
});
