export type XmarkStyle = 'gallery' | 'list';

interface XmarkStyleTabsProps {
  activeStyle: XmarkStyle;
  onSelect: (style: XmarkStyle) => void;
  disabled?: boolean;
}

export function XmarkStyleTabs({
  activeStyle,
  onSelect,
  disabled,
}: XmarkStyleTabsProps) {
  return (
    <div className="xmark-style-tabs">
      <button
        type="button"
        disabled={disabled}
        className={`xmark-style-tab${activeStyle === 'gallery' ? ' xmark-style-tab-active' : ''}`}
        onClick={() => onSelect('gallery')}
      >
        GALLERY
      </button>
      <button
        type="button"
        disabled={disabled}
        className={`xmark-style-tab${activeStyle === 'list' ? ' xmark-style-tab-active' : ''}`}
        onClick={() => onSelect('list')}
      >
        LIST
      </button>
    </div>
  );
}
