import { createRoute } from '@tanstack/react-router';

import { RobokingPage } from '@/pages/RobokingPage';

import { rootRoute } from './__root';

export const robokingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roboking',
  component: RobokingPage,
});
