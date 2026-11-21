import { RegionViewMap } from '@/features/region-view/components/RegionViewMap';
import { RegionViewMapGuard } from '@/features/region-view/components/RegionViewMapGuard';
import { RegionViewSearchPanel } from '@/features/region-view/components/RegionViewSearchPanel';
import { RegionViewTopBar } from '@/features/region-view/components/RegionViewTopBar';
import '@/features/region-view/regionView.css';

export function RegionViewPage() {
  return (
    <RegionViewMapGuard>
      <div className="region-view__wrapper">
        <RegionViewMap />
        <div className="region-view__top-bar">
          <RegionViewTopBar />
        </div>
        <div className="region-view__search-panel">
          <RegionViewSearchPanel />
        </div>
      </div>
    </RegionViewMapGuard>
  );
}
