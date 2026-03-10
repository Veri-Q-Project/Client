import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import CaptchaPage from '@/pages/CaptchaPage';
import HomePage from '@/pages/HomePage';
import LoadingPage from '@/pages/LoadingPage';
import ReportPage from '@/pages/ReportPage';
import ResultCriticalPage from '@/pages/ResultCriticalPage';
import ResultSafePage from '@/pages/ResultSafePage';
import ResultWarningPage from '@/pages/ResultWarningPage';
import ScanHistoryPage from '@/pages/ScanHistoryPage';

function RootLayout() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const captchaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/captcha',
  component: CaptchaPage,
});

const loadingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/loading',
  component: LoadingPage,
});

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report',
  component: ReportPage,
});

const scanHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scan-history',
  component: ScanHistoryPage,
});

const resultCriticalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/critical',
  component: ResultCriticalPage,
});

const resultSafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/safe',
  component: ResultSafePage,
});

const resultWarningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/warning',
  component: ResultWarningPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  captchaRoute,
  loadingRoute,
  reportRoute,
  scanHistoryRoute,
  resultCriticalRoute,
  resultSafeRoute,
  resultWarningRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
