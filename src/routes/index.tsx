import { createRoute, Link } from '@tanstack/react-router';

import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <nav>
      <Link to="/polygon">폴리곤 제어 데모</Link>
    </nav>
  ),
});
