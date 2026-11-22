import { useEffect, useMemo, useState } from 'react';

// Portfolio/popup/Image.as 그대로: 7초마다 자동 롤링, 우측 원형 탭 클릭으로 선택,
// 탭에 마우스를 올리면(원본은 ROLL_OVER/ROLL_OUT) 자동 롤링을 멈춘다.
const ROLL_INTERVAL_MS = 7000;

interface XmarkPopupImageRollerProps {
  files: string[];
}

export function XmarkPopupImageRoller({ files }: XmarkPopupImageRollerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 같은 파일이 files 안에 중복될 수 있어(실측 데이터 특성), key는 파일명이 아니라
  // 고정된 위치 기반 id로 미리 박아둔다(배열 index를 렌더링 시점에 직접 key로 쓰지 않음).
  const tabs = useMemo(() => files.map((file, id) => ({ file, id })), [files]);

  useEffect(() => {
    if (tabs.length === 0) return;
    setActiveIndex(0);
  }, [tabs]);

  useEffect(() => {
    if (isPaused || files.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % files.length);
    }, ROLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, files.length]);

  return (
    <div className="xmark-popup-image-roller">
      <img src={files[activeIndex]} alt="" className="xmark-popup-image" />
      {tabs.length > 1 && (
        <div className="xmark-popup-image-tabs">
          {tabs.map(({ file, id }) => (
            <button
              key={id}
              type="button"
              aria-label={file}
              className={`xmark-popup-image-tab${id === activeIndex ? ' xmark-popup-image-tab-active' : ''}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={() => setActiveIndex(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
