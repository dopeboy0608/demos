import { createRoute } from '@tanstack/react-router';

import { RobokingPocPage } from '@/pages/RobokingPocPage';

import { rootRoute } from './__root';

export const robokingPocRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roboking-poc',
  component: RobokingPocPage,
});
