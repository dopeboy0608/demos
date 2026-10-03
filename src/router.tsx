import { createRouter } from '@tanstack/react-router';

import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { polygonRoute } from './routes/polygon';

const routeTree = rootRoute.addChildren([indexRoute, polygonRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
