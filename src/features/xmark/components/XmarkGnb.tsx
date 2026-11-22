import {
  XMARK_COMING_SOON_MESSAGE,
  XMARK_GNB_TABS,
} from '../helper/xmarkConstants';
import type { XmarkTab } from '../helper/xmarkConstants';

interface XmarkGnbProps {
  activeTab: XmarkTab;
  onSelect: (tab: XmarkTab) => void;
  onStorySelect: () => void;
}

export function XmarkGnb({
  activeTab,
  onSelect,
  onStorySelect,
}: XmarkGnbProps) {
  const handleClick = (tab: XmarkTab) => {
    if (tab === 'story') {
      onStorySelect();
      return;
    }
    onSelect(tab);
  };

  return (
    <nav className="xmark-gnb" aria-label={XMARK_COMING_SOON_MESSAGE}>
      {XMARK_GNB_TABS.map(({ tab, label }) => (
        <button
          key={tab}
          type="button"
          className={`xmark-gnb-item${activeTab === tab ? ' xmark-gnb-item-active' : ''}`}
          onClick={() => handleClick(tab)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
