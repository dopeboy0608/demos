import { createRouter } from '@tanstack/react-router';

import { toRouterBasepath } from './config/basepath';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { polygonLegacyRoute } from './routes/polygon-legacy';
import { polygonRoute } from './routes/polygon';

const routeTree = rootRoute.addChildren([
  indexRoute,
  polygonRoute,
  polygonLegacyRoute,
]);

export const router = createRouter({
  routeTree,
  basepath: toRouterBasepath(__BASE_PATH__),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
