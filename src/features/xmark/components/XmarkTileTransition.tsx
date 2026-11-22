import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { shuffleArray } from '../helper/shuffleArray';

// AboutMain.as/ContactMain.as의 planeSetting("in") 그대로: 80개 타일(10열×8행)이
// 셔플된 순서로 0.01초 간격씩 시작해 0.5초 동안 rotationX -180→0, alpha 0→0.7로 뒤집히며
// 콘텐츠를 가린 채 등장한 뒤, 전부 끝나면 실제 콘텐츠가 alpha 0.7→1로 이어받는다.
// 원본은 BitmapData.draw로 콘텐츠를 타일마다 캡처해 복제하지만, 여기서는 실제 콘텐츠를
// 타일 아래 그대로 두고 타일을 "닫힌 블라인드"처럼 덮었다가 뒤집어 치우는 방식으로 단순화했다
// (html2canvas 등 신규 라이브러리 없이 동일한 시각 효과를 내기 위함).
const TILE_COLUMNS = 10;
const TILE_ROWS = 8;
const TILE_COUNT = TILE_COLUMNS * TILE_ROWS;
const TILE_DURATION_SECONDS = 0.5;
const TILE_STAGGER_SECONDS = 0.01;

interface XmarkTileTransitionProps {
  children: ReactNode;
}

export function XmarkTileTransition({ children }: XmarkTileTransitionProps) {
  const tilesRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const container = tilesRef.current;
    if (!container) return;

    const tiles = Array.from(
      container.querySelectorAll<HTMLElement>('.xmark-tile'),
    );
    if (tiles.length !== TILE_COUNT) return;

    gsap.set(tiles, { rotationX: -180, autoAlpha: 0 });

    let completeCount = 0;
    const timeline = gsap.timeline();
    const order = shuffleArray(tiles);
    order.forEach((el, i) => {
      timeline.to(
        el,
        {
          rotationX: 0,
          autoAlpha: 0.7,
          duration: TILE_DURATION_SECONDS,
          ease: 'power2.out',
          onComplete: () => {
            completeCount++;
            if (completeCount === TILE_COUNT) setIsRevealed(true);
          },
        },
        i * TILE_STAGGER_SECONDS,
      );
    });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className="xmark-tile-transition">
      <div
        className={`xmark-tile-content${isRevealed ? ' xmark-tile-content-revealed' : ''}`}
      >
        {children}
      </div>
      {!isRevealed && (
        <div ref={tilesRef} className="xmark-tile-grid">
          {Array.from({ length: TILE_COUNT }, (_, i) => i).map((i) => (
            <div key={i} className="xmark-tile" />
          ))}
        </div>
      )}
    </div>
  );
}
