import { resolveResultToneFromSources } from '@/shared/api/risk/resolveResultTone';
import type { ResultTone } from '@/shared/types/resultTone';

import { isWebScanTarget } from './scanClassification';

export type ScanResultRoute =
  | '/result/critical'
  | '/result/non-url'
  | '/result/safe'
  | '/result/warning';

export type WebScanResultRoute = Exclude<ScanResultRoute, '/result/non-url'>;

type ScanResultRouteSource = {
  analysisDetail?: unknown;
  decodedUrl?: string | null;
  finalResult?: unknown;
  historySelection?: { url?: string | null } | null;
  isUrl?: boolean | null;
  riskLevel?: ResultTone | null;
  scanResponse?: unknown;
  schemeType?: string | null;
};

export const nonUrlResultRoute = '/result/non-url' as const;

const resultRouteByRiskLevel: Record<ResultTone, WebScanResultRoute> = {
  critical: '/result/critical',
  safe: '/result/safe',
  warning: '/result/warning',
};

export function buildScanResultHref(route: ScanResultRoute, url: string | null): string {
  if (route === nonUrlResultRoute || !url) {
    return route;
  }

  return `${route}?url=${encodeURIComponent(url)}`;
}

export function resolveScanResultRouteByRiskLevel(riskLevel: ResultTone): WebScanResultRoute {
  return resultRouteByRiskLevel[riskLevel];
}

export function resolveScanResultRoute(source: ScanResultRouteSource): {
  href: string;
  route: ScanResultRoute;
  url: string | null;
} {
  const currentTargetUrl = source.decodedUrl ?? source.historySelection?.url ?? null;

  if (
    !isWebScanTarget({
      isUrl: source.isUrl ?? null,
      schemeType: source.schemeType ?? null,
      url: currentTargetUrl,
    })
  ) {
    return {
      href: nonUrlResultRoute,
      route: nonUrlResultRoute,
      url: currentTargetUrl,
    };
  }

  const riskLevel =
    resolveResultToneFromSources(
      [source.analysisDetail, source.finalResult, source.scanResponse, source.historySelection],
      source.riskLevel,
    ) ?? 'warning';
  const route = resolveScanResultRouteByRiskLevel(riskLevel);

  return {
    href: buildScanResultHref(route, currentTargetUrl),
    route,
    url: currentTargetUrl,
  };
}
