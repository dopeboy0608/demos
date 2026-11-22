import type { XmarkGalleryItem } from '../helper/xmarkGalleryData';

interface XmarkListRowProps {
  item: XmarkGalleryItem;
  index: number;
}

export const XMARK_LIST_ROW_HEIGHT_PX = 56;

export function XmarkListRow({ item, index }: XmarkListRowProps) {
  return (
    <div
      className="xmark-list-row"
      style={{ top: index * XMARK_LIST_ROW_HEIGHT_PX }}
    >
      {item.isNew && <span className="xmark-list-row-new">NEW</span>}
      <span className="xmark-list-row-title">{item.title}</span>
    </div>
  );
}
