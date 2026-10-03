import { createRootRoute, Outlet } from '@tanstack/react-router';

import { AppLayout } from '@/components/AppLayout';

export const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
