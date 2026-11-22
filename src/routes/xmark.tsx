import { createRoute } from '@tanstack/react-router';

import { XmarkPage } from '@/pages/XmarkPage';

import { rootRoute } from './__root';

export const xmarkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/xmark',
  component: XmarkPage,
});
