import { createRoute } from '@tanstack/react-router';

import { PolygonLegacyPage } from '@/pages/legacy/PolygonLegacyPage';

import { rootRoute } from './__root';

export const polygonLegacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/polygon-legacy',
  component: PolygonLegacyPage,
});
