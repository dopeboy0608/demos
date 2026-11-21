import { createRoute } from '@tanstack/react-router';

import { RegionViewPage } from '@/pages/RegionViewPage';

import { rootRoute } from './__root';

export const regionViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/region-view',
  component: RegionViewPage,
});
