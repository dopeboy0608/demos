import { createRoute } from '@tanstack/react-router';

import { VoninSubVisualPage } from '@/pages/VoninSubVisualPage';

import { rootRoute } from './__root';

export const voninSubVisualRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vonin-sub-visual/$id',
  component: VoninSubVisualPage,
});
