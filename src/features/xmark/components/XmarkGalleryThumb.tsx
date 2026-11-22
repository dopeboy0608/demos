import { gsap } from 'gsap';
import { useRef } from 'react';

import type { XmarkGalleryItem } from '../helper/xmarkGalleryData';

// Thumb.as의 clickHandler 그대로: 클릭 시 제자리에서 0.4초간 한 바퀴 돈 뒤 팝업을 연다.
const CLICK_SPIN_DURATION_SECONDS = 0.4;

interface XmarkGalleryThumbProps {
  item: XmarkGalleryItem;
  onClick: (item: XmarkGalleryItem) => void;
}

export function XmarkGalleryThumb({ item, onClick }: XmarkGalleryThumbProps) {
  const rootRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const el = rootRef.current;
    if (!el) {
      onClick(item);
      return;
    }
    gsap.to(el, {
      rotationX: '+=360',
      duration: CLICK_SPIN_DURATION_SECONDS,
      onComplete: () => onClick(item),
    });
  };

  return (
    <button
      ref={rootRef}
      type="button"
      className="xmark-gallery-thumb"
      onClick={handleClick}
    >
      <img
        src={item.thumb}
        alt={item.title}
        className="xmark-gallery-thumb-img"
      />
      {item.isNew && <span className="xmark-gallery-thumb-new">NEW</span>}
      <div className="xmark-gallery-thumb-title">{item.title}</div>
    </button>
  );
}
