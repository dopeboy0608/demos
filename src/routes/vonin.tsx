import { createRoute } from '@tanstack/react-router';

import { VoninPage } from '@/pages/VoninPage';

import { rootRoute } from './__root';

export const voninRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vonin',
  component: VoninPage,
});
