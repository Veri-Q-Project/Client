import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

const CaptchaPage = lazy(() => import('@/pages/Captcha'));
const LoadingPage = lazy(() => import('@/pages/Loading'));
const QRScanPage = lazy(() => import('@/pages/QRScan'));
const ReportPage = lazy(() => import('@/pages/Report'));
const ResultPage = lazy(() => import('@/pages/Result'));
const ResultNonUrlPage = lazy(() => import('@/pages/ResultNonUrl'));
const ScanListPage = lazy(() => import('@/pages/ScanList'));

function RouteLoader() {
  return (
    <div aria-live="polite" role="status">
      Loading...
    </div>
  );
}

function RootLayout() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Outlet />
    </Suspense>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: QRScanPage,
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

const qrScanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/qr-scan',
  component: QRScanPage,
});

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report',
  component: ReportPage,
});

const scanHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scan-history',
  component: ScanListPage,
});

const scanListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scan-list',
  component: ScanListPage,
});

const resultCriticalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/critical',
  component: () => <ResultPage tone="critical" />,
});

const resultNonUrlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/non-url',
  component: ResultNonUrlPage,
});

const resultSafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/safe',
  component: () => <ResultPage tone="safe" />,
});

const resultWarningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/warning',
  component: () => <ResultPage tone="warning" />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  captchaRoute,
  loadingRoute,
  qrScanRoute,
  reportRoute,
  scanHistoryRoute,
  scanListRoute,
  resultCriticalRoute,
  resultNonUrlRoute,
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
