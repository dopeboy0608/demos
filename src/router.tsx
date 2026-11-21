import { createRouter } from '@tanstack/react-router';

import { toRouterBasepath } from './config/basepath';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { polygonRoute } from './routes/polygon';
import { robokingRoute } from './routes/roboking';
import { robokingPocRoute } from './routes/roboking-poc';
import { regionViewRoute } from './routes/region-view';

const routeTree = rootRoute.addChildren([
  indexRoute,
  polygonRoute,
  robokingRoute,
  robokingPocRoute,
  regionViewRoute,
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
