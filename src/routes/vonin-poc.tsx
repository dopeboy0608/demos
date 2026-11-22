import { createRoute } from '@tanstack/react-router';

import { VoninPocPage } from '@/pages/VoninPocPage';

import { rootRoute } from './__root';

export const voninPocRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vonin-poc',
  component: VoninPocPage,
});
