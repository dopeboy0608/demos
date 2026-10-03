import { createRoute } from '@tanstack/react-router';

import { PolygonControlPage } from '@/pages/PolygonControlPage';

import { rootRoute } from './__root';

export const polygonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/polygon',
  component: PolygonControlPage,
});
