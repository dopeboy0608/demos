import { useEffect, useState } from 'react';

import { XmarkContactForm } from './XmarkContactForm';
import { XmarkPopup } from './XmarkPopup';
import { XmarkTileTransition } from './XmarkTileTransition';
import { XMARK_GALLERY_ITEMS } from '../helper/xmarkGalleryData';
import type { XmarkGalleryItem } from '../helper/xmarkGalleryData';

// ContactMain.as의 photo 롤링: 10초마다 롤오버 상태 토글(여기서는 사진 교체로 단순화),
// 원본의 photo 블록(6건, pop_img.jpg/pop_img1.jpg 반복)을 그대로 사용.
const PHOTO_FILES = ['/xmark/img/pop_img.jpg', '/xmark/img/pop_img1.jpg'];
const PHOTO_ROLL_INTERVAL_MS = 10000;

const PHOTO_POPUP_ITEM: XmarkGalleryItem = {
  ...XMARK_GALLERY_ITEMS[0],
  id: -1,
  title: '',
  isNew: false,
  link: '',
  content: '',
  type: 'image',
  files: PHOTO_FILES,
};

export function XmarkContact() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % PHOTO_FILES.length);
    }, PHOTO_ROLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <XmarkTileTransition>
      <div className="xmark-contact">
        <button
          type="button"
          className="xmark-contact-photo-btn"
          onClick={() => setIsPhotoOpen(true)}
        >
          <img src={PHOTO_FILES[photoIndex]} alt="X-MARK" />
        </button>

        <button
          type="button"
          className="xmark-contact-inquiry-btn"
          onClick={() => setIsFormOpen(true)}
        >
          프로젝트 문의
        </button>
      </div>

      {isPhotoOpen && (
        <XmarkPopup
          item={PHOTO_POPUP_ITEM}
          onClose={() => setIsPhotoOpen(false)}
          hideInfo
        />
      )}
      {isFormOpen && <XmarkContactForm onClose={() => setIsFormOpen(false)} />}
    </XmarkTileTransition>
  );
}
