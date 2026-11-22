import {
  XMARK_SORT_TABS,
  type XmarkSortTab,
} from '../helper/xmarkGalleryConstants';

interface XmarkSortTabsProps {
  activeTab: XmarkSortTab;
  onSelect: (tab: XmarkSortTab) => void;
  disabled?: boolean;
}

export function XmarkSortTabs({
  activeTab,
  onSelect,
  disabled,
}: XmarkSortTabsProps) {
  return (
    <div className="xmark-sort-tabs">
      {XMARK_SORT_TABS.map(({ tab, label }) => (
        <button
          key={tab}
          type="button"
          disabled={disabled}
          className={`xmark-sort-tab${activeTab === tab ? ' xmark-sort-tab-active' : ''}`}
          onClick={() => onSelect(tab)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
