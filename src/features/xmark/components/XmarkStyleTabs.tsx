export type XmarkStyle = 'gallery' | 'list';

interface XmarkStyleTabsProps {
  activeStyle: XmarkStyle;
  onSelect: (style: XmarkStyle) => void;
}

export function XmarkStyleTabs({ activeStyle, onSelect }: XmarkStyleTabsProps) {
  return (
    <div className="xmark-style-tabs">
      <button
        type="button"
        className={`xmark-style-tab${activeStyle === 'gallery' ? ' xmark-style-tab-active' : ''}`}
        onClick={() => onSelect('gallery')}
      >
        GALLERY
      </button>
      <button
        type="button"
        className={`xmark-style-tab${activeStyle === 'list' ? ' xmark-style-tab-active' : ''}`}
        onClick={() => onSelect('list')}
      >
        LIST
      </button>
    </div>
  );
}
