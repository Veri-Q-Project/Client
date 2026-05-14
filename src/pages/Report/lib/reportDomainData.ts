import { pickSourceString } from '@/shared/api/responseAccess/payloadAccess';
import type { ResolvedScanUrls } from '@/shared/lib/scan-session/scanUrlResolution';
import type { ResultTone } from '@/shared/types/resultTone';

import { reportFallbackCopyByTone } from '../constants/reportText';

import type { ReportPageData } from '../types/reportPage.types';

function resolveUrlComparisonSummary({ destinationUrl, originalUrl }: ResolvedScanUrls): string {
  if (originalUrl && destinationUrl && originalUrl !== destinationUrl) {
    return '스캔된 QR URL이 최종 목적지와 다른 주소로 리다이렉트되었습니다.';
  }

  return '스캔된 QR URL과 최종 목적지가 동일합니다.';
}

export function buildReportDomainComparison(
  domainComparisonRecord: Record<string, unknown> | null,
  riskLevel: ResultTone,
  urls: ResolvedScanUrls,
): ReportPageData['domainComparison'] {
  return {
    officialUrl:
      pickSourceString([domainComparisonRecord], ['officialUrl', 'official_url']) ??
      urls.destinationUrl,
    riskBadgeText:
      pickSourceString([domainComparisonRecord], ['riskBadgeText', 'risk_badge_text']) ??
      reportFallbackCopyByTone[riskLevel].domainRiskBadge,
    summary:
      pickSourceString([domainComparisonRecord], ['summary', 'description']) ??
      resolveUrlComparisonSummary(urls),
    suspiciousUrl:
      pickSourceString([domainComparisonRecord], ['suspiciousUrl', 'suspicious_url']) ??
      urls.originalUrl,
  };
}
