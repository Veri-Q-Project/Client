import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import CaptchaPage from '@/pages/Captcha';
import HomePage from '@/pages/Home';
import LoadingPage from '@/pages/Loading';
import QRScanPage from '@/pages/QRScan';
import ReportPage from '@/pages/Report';
import ResultCriticalPage from '@/pages/ResultCritical';
import ResultNonUrlPage from '@/pages/ResultNonUrl';
import ResultSafePage from '@/pages/ResultSafe';
import ResultWarningPage from '@/pages/ResultWarning';
import ScanHistoryPage from '@/pages/ScanHistory';
import ScanListPage from '@/pages/ScanList';

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
  component: ScanHistoryPage,
});

const scanListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scan-list',
  component: ScanListPage,
});

const resultCriticalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/critical',
  component: ResultCriticalPage,
});

const resultNonUrlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result/non-url',
  component: ResultNonUrlPage,
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
