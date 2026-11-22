import {
  XMARK_SORT_TABS,
  type XmarkSortTab,
} from '../helper/xmarkGalleryConstants';

interface XmarkSortTabsProps {
  activeTab: XmarkSortTab;
  onSelect: (tab: XmarkSortTab) => void;
}

export function XmarkSortTabs({ activeTab, onSelect }: XmarkSortTabsProps) {
  return (
    <div className="xmark-sort-tabs">
      {XMARK_SORT_TABS.map(({ tab, label }) => (
        <button
          key={tab}
          type="button"
          className={`xmark-sort-tab${activeTab === tab ? ' xmark-sort-tab-active' : ''}`}
          onClick={() => onSelect(tab)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
