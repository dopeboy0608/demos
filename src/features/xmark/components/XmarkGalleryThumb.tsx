import type { XmarkGalleryItem } from '../helper/xmarkGalleryData';

interface XmarkGalleryThumbProps {
  item: XmarkGalleryItem;
}

export function XmarkGalleryThumb({ item }: XmarkGalleryThumbProps) {
  return (
    <div className="xmark-gallery-thumb">
      <img
        src={item.thumb}
        alt={item.title}
        className="xmark-gallery-thumb-img"
      />
      {item.isNew && <span className="xmark-gallery-thumb-new">NEW</span>}
      <div className="xmark-gallery-thumb-title">{item.title}</div>
    </div>
  );
}
