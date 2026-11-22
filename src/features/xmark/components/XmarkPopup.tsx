import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import { XmarkPopupImageRoller } from './XmarkPopupImageRoller';
import type { XmarkGalleryItem } from '../helper/xmarkGalleryData';

// Portfolio/PopUpMain.as 그대로: 카드 등장은 0.5초(scale 0.7→1, alpha 0→1, Cubic.easeOut),
// 제목/날짜/클라이언트/LAUNCH 텍스트는 각각 0초/0.3초/0.6초/0.9초 지연 후 0.5초간 순차 페이드인.
const CARD_DURATION_SECONDS = 0.5;
const TEXT_DELAYS_SECONDS = { title: 0, date: 0.3, company: 0.6, launch: 0.9 };

interface XmarkPopupProps {
  item: XmarkGalleryItem;
  onClose: () => void;
}

export function XmarkPopup({ item, onClose }: XmarkPopupProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.set(card, { autoAlpha: 0, scale: 0.7 });
    const timeline = gsap.timeline();
    timeline.to(card, {
      autoAlpha: 1,
      scale: 1,
      duration: CARD_DURATION_SECONDS,
      ease: 'power2.out',
    });

    for (const [key, delay] of Object.entries(TEXT_DELAYS_SECONDS)) {
      const el = card.querySelector<HTMLElement>(`[data-popup-field="${key}"]`);
      if (!el) continue;
      gsap.set(el, { autoAlpha: 0 });
      timeline.to(
        el,
        { autoAlpha: 1, duration: CARD_DURATION_SECONDS, ease: 'power2.out' },
        delay,
      );
    }

    return () => {
      timeline.kill();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 배경 클릭 닫기는 마우스 전용 편의 기능이고, Esc 키와 CLOSE 버튼으로 키보드 접근을 보장한다.
    // biome-ignore lint/a11y/useKeyWithClickEvents: 위와 동일한 이유.
    <div className="xmark-popup-backdrop" onClick={onClose}>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: 카드 내부 클릭이 배경으로 전파되어 닫히는 것만 막는 용도. */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: 위와 동일한 이유. */}
      <div
        ref={cardRef}
        className="xmark-popup-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="xmark-popup-close" onClick={onClose}>
          CLOSE
        </button>

        {item.isNew && <span className="xmark-popup-new">NEW</span>}

        <div className="xmark-popup-content">
          {item.type === 'image' ? (
            <XmarkPopupImageRoller files={item.files} />
          ) : (
            <div className="xmark-popup-static">
              <img
                src={item.thumb}
                alt={item.title}
                className="xmark-popup-static-img"
              />
              <p className="xmark-popup-static-note">
                이 데모에서는 영상 변환 도구(ffmpeg)가 없어 재생을 지원하지
                않습니다.
              </p>
            </div>
          )}
        </div>

        <div className="xmark-popup-info">
          <div className="xmark-popup-title" data-popup-field="title">
            {item.title}
          </div>
          <div className="xmark-popup-meta">
            <span data-popup-field="date">{item.date}</span>
            <span data-popup-field="company">{item.company}</span>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                data-popup-field="launch"
                className="xmark-popup-launch"
              >
                LAUNCH
              </a>
            )}
          </div>
          {item.content && (
            <p className="xmark-popup-description">{item.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
