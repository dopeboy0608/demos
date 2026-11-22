import { createRoute } from '@tanstack/react-router';

import { XmarkPocPage } from '@/pages/XmarkPocPage';

import { rootRoute } from './__root';

export const xmarkPocRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/xmark-poc',
  component: XmarkPocPage,
});
