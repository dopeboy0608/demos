import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';

import { XmarkListRow, XMARK_LIST_ROW_HEIGHT_PX } from './XmarkListRow';
import { useNonPassiveWheel } from '../hooks/useNonPassiveWheel';
import { getListMaxScroll } from '../helper/xmarkGalleryFilter';
import type { XmarkGalleryItem } from '../helper/xmarkGalleryData';

// List.as/ListManager.as 그대로: 등장은 1초, 지연 0.05*i, ease Cubic.easeOut(gsap power2.out),
// 휠 1틱당 한 행씩 스크롤(wheel delta 부호는 갤러리와 동일하게 웹 관례로 반대 매핑), 틱 후 200ms 동안
// 휠 재입력 잠금(ListManager.as의 wheelLive 타임아웃).
const VISIBLE_ROWS = 12;
const ENTER_DURATION_SECONDS = 1;
const ENTER_STAGGER_SECONDS = 0.05;
const WHEEL_LOCK_MS = 200;

interface XmarkPortfolioListProps {
  items: XmarkGalleryItem[];
  onRowClick: (item: XmarkGalleryItem) => void;
}

export function XmarkPortfolioList({
  items,
  onRowClick,
}: XmarkPortfolioListProps) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wheelLockedRef = useRef(false);

  const maxScroll = getListMaxScroll(items.length, VISIBLE_ROWS);

  useEffect(() => {
    setScrollOffset(0);

    const track = trackRef.current;
    if (!track) return;

    const rows = Array.from(
      track.querySelectorAll<HTMLElement>('.xmark-list-row'),
    );
    if (rows.length === 0 || rows.length !== items.length) return;

    gsap.set(rows, { y: 200, autoAlpha: 0 });
    const timeline = gsap.timeline();
    rows.forEach((el, i) => {
      timeline.to(
        el,
        {
          y: 0,
          autoAlpha: 1,
          duration: ENTER_DURATION_SECONDS,
          ease: 'power2.out',
        },
        i * ENTER_STAGGER_SECONDS,
      );
    });

    return () => {
      timeline.kill();
    };
  }, [items]);

  // JSX onWheel은 passive 리스너라 preventDefault가 동작하지 않아 네이티브 리스너로 처리한다.
  const wheelRef = useNonPassiveWheel<HTMLDivElement>((event) => {
    event.preventDefault();
    if (wheelLockedRef.current) return;

    let moved = false;
    if (event.deltaY > 0 && scrollOffset < maxScroll) {
      setScrollOffset((prev) => prev + 1);
      moved = true;
    } else if (event.deltaY < 0 && scrollOffset > 0) {
      setScrollOffset((prev) => prev - 1);
      moved = true;
    }

    if (moved) {
      wheelLockedRef.current = true;
      setTimeout(() => {
        wheelLockedRef.current = false;
      }, WHEEL_LOCK_MS);
    }
  });

  return (
    <div
      ref={wheelRef}
      className="xmark-list-mask"
      style={{ height: VISIBLE_ROWS * XMARK_LIST_ROW_HEIGHT_PX }}
    >
      <div
        ref={trackRef}
        className="xmark-list-track"
        style={{
          transform: `translateY(${-scrollOffset * XMARK_LIST_ROW_HEIGHT_PX}px)`,
        }}
      >
        {items.map((item, index) => (
          <XmarkListRow
            key={item.id}
            item={item}
            index={index}
            onClick={onRowClick}
          />
        ))}
      </div>
    </div>
  );
}
