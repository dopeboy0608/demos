/**
 * XFL(FLA 압축 해제 XML) 심볼 타임라인을 GSAP 타임라인 스텝으로 변환하는 PoC 파서.
 * 전용 XML 파서 없이 정규식으로 추출한다 — DOMFrame/DOMSymbolInstance/Matrix/filters
 * 구조가 고정적이라 Node/브라우저 어디서든 의존성 없이 동작시키기 위함이다.
 */

export interface TweenMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface GlowFilterConfig {
  type: 'glow';
  blurX: number;
  blurY: number;
  color?: string;
  strength?: number;
}

export interface SymbolKeyframe {
  frameIndex: number;
  /** 다음 키프레임까지의 프레임 수(마지막 키프레임이면 자기 자신의 duration). */
  durationFrames: number;
  /** true면 이 키프레임에서 다음 키프레임까지 클래식/모션 트윈이 적용된다. */
  isTweenStart: boolean;
  /** Flash의 acceleration 슬라이더(-100~100). 없으면 선형(0). */
  acceleration: number;
  matrix: TweenMatrix;
  alpha: number;
  filter: GlowFilterConfig | null;
}

export interface GsapStep {
  atFrame: number;
  durationFrames: number;
  durationSeconds: number;
  /** 'set'은 트윈 없이 즉시 적용, 'to'는 다음 값까지 트윈한다. */
  type: 'set' | 'to';
  ease: string;
  matrix: TweenMatrix;
  alpha: number;
  filter: GlowFilterConfig | null;
}

const IDENTITY_MATRIX: TweenMatrix = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };

function parseAttrs(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of attrString.matchAll(/(\w+)="([^"]*)"/g)) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function parseMatrix(frameXml: string): TweenMatrix {
  const matrixMatch = frameXml.match(/<Matrix([^/]*)\/>/);
  if (!matrixMatch) return IDENTITY_MATRIX;
  const attrs = parseAttrs(matrixMatch[1]);
  return {
    a: attrs.a !== undefined ? Number(attrs.a) : 1,
    b: attrs.b !== undefined ? Number(attrs.b) : 0,
    c: attrs.c !== undefined ? Number(attrs.c) : 0,
    d: attrs.d !== undefined ? Number(attrs.d) : 1,
    tx: attrs.tx !== undefined ? Number(attrs.tx) : 0,
    ty: attrs.ty !== undefined ? Number(attrs.ty) : 0,
  };
}

function parseAlpha(frameXml: string): number {
  const colorMatch = frameXml.match(/<Color\s+([^/]*)\/>/);
  if (!colorMatch) return 1;
  const attrs = parseAttrs(colorMatch[1]);
  return attrs.alphaMultiplier !== undefined
    ? Number(attrs.alphaMultiplier)
    : 1;
}

function parseGlowFilter(frameXml: string): GlowFilterConfig | null {
  const filterMatch = frameXml.match(/<GlowFilter\s+([^/]*)\/>/);
  if (!filterMatch) return null;
  const attrs = parseAttrs(filterMatch[1]);
  return {
    type: 'glow',
    blurX: attrs.blurX !== undefined ? Number(attrs.blurX) : 0,
    blurY: attrs.blurY !== undefined ? Number(attrs.blurY) : 0,
    color: attrs.color,
    strength: attrs.strength !== undefined ? Number(attrs.strength) : undefined,
  };
}

/**
 * 하나의 레이어(`<DOMLayer>...</DOMLayer>`) XML에서 `<DOMFrame>` 키프레임을 읽어낸다.
 * 여러 레이어 중 실제 애니메이션 대상(심볼 인스턴스가 들어있는 레이어)을 골라 넘겨준다.
 */
export function parseSymbolKeyframes(layerXml: string): SymbolKeyframe[] {
  const frames: SymbolKeyframe[] = [];
  const frameRegex = /<DOMFrame\s+([^>]*)>([\s\S]*?)<\/DOMFrame>/g;

  for (const m of layerXml.matchAll(frameRegex)) {
    const frameAttrs = parseAttrs(m[1]);
    const frameIndex = Number(frameAttrs.index ?? 0);
    const durationFrames = Number(frameAttrs.duration ?? 1);
    const isTweenStart = frameAttrs.tweenType === 'motion';
    const acceleration =
      frameAttrs.acceleration !== undefined
        ? Number(frameAttrs.acceleration)
        : 0;
    const body = m[2];

    frames.push({
      frameIndex,
      durationFrames,
      isTweenStart,
      acceleration,
      matrix: parseMatrix(body),
      alpha: parseAlpha(body),
      filter: parseGlowFilter(body),
    });
  }

  return frames;
}

function mapAccelerationToEase(acceleration: number): string {
  if (acceleration < 0) return 'power2.out';
  if (acceleration > 0) return 'power2.in';
  return 'none';
}

/**
 * 키프레임 목록을 GSAP Timeline에 그대로 넣을 수 있는 스텝 목록으로 바꾼다.
 * `tweenType="motion"`인 키프레임은 다음 키프레임까지 `to` 트윈, 아니면 `set`(순간 전환)이다.
 */
export function toGsapSteps(
  keyframes: SymbolKeyframe[],
  fps: number,
): GsapStep[] {
  const sorted = [...keyframes].sort((a, b) => a.frameIndex - b.frameIndex);

  return sorted.map((frame, index) => {
    const next = sorted[index + 1];
    const spanFrames = next
      ? next.frameIndex - frame.frameIndex
      : frame.durationFrames;

    return {
      atFrame: frame.frameIndex,
      durationFrames: spanFrames,
      durationSeconds: spanFrames / fps,
      type: frame.isTweenStart && next ? 'to' : 'set',
      ease: mapAccelerationToEase(frame.acceleration),
      matrix: next && frame.isTweenStart ? next.matrix : frame.matrix,
      alpha: next && frame.isTweenStart ? next.alpha : frame.alpha,
      filter: next && frame.isTweenStart ? next.filter : frame.filter,
    };
  });
}
