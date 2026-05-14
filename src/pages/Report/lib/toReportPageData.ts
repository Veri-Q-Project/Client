import { pickSourceNumber, pickSourceStringArray } from '@/shared/api/responseAccess/payloadAccess';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ResultTone } from '@/shared/types/resultTone';

import { buildReportDomainComparison } from './reportDomainData';
import { createReportPageDataContext } from './reportPageDataContext';
import { buildReportReputation } from './reportReputationData';
import { buildReportServerInfo, resolveReportServerInfoRecords } from './reportServerInfoData';
import { reportFallbackCopyByTone, trustScoreFallbackByTone } from '../constants/reportText';

import type { ReportPageData } from '../types/reportPage.types';

function clampTrustScore(value: number | null, riskLevel: ResultTone): number {
  if (value === null) {
    return trustScoreFallbackByTone[riskLevel];
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatDateLabel(rawDate: string | null, fallbackLabel = '분석 시각 정보 없음'): string {
  if (!rawDate) {
    return fallbackLabel;
  }

  // TODO: Pin timezone formatting once backend timestamp semantics are confirmed.
  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallbackLabel;
  }

  const year = parsedDate.getFullYear();
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, '0');
  const day = `${parsedDate.getDate()}`.padStart(2, '0');
  const hours = `${parsedDate.getHours()}`.padStart(2, '0');
  const minutes = `${parsedDate.getMinutes()}`.padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function resolveDetectedRiskTypes(sources: unknown[], riskLevel: ResultTone): string[] {
  const riskTypes = pickSourceStringArray(
    sources,
    ['detectedRiskTypes', 'detected_risk_types', 'riskTypes', 'risk_types', 'threats'],
    ',',
  );

  return riskTypes.length > 0 ? riskTypes : reportFallbackCopyByTone[riskLevel].detectedRiskTypes;
}

export function toReportPageData(session: ScanSessionSnapshot): ReportPageData {
  const {
    domainComparisonRecord,
    internalDbRecord,
    reputationRecord,
    riskLevel,
    serverInfoRecord: rawServerInfoRecord,
    sources,
    urls,
  } = createReportPageDataContext(session);
  const { certificateRecord, serverInfoRecord } =
    resolveReportServerInfoRecords(rawServerInfoRecord);

  return {
    detectedRiskTypes: resolveDetectedRiskTypes(sources, riskLevel),
    domainComparison: buildReportDomainComparison(domainComparisonRecord, riskLevel, urls),
    reputation: buildReportReputation(reputationRecord, internalDbRecord, sources),
    reportTitle: '상세 분석 리포트',
    riskDescription: reportFallbackCopyByTone[riskLevel].riskDescription,
    riskLevel,
    riskLevelText: reportFallbackCopyByTone[riskLevel].riskLevelText,
    scannedAt: formatDateLabel(urls.scannedAt),
    scannedUrl: urls.scannedUrl,
    serverInfo: buildReportServerInfo(serverInfoRecord, certificateRecord),
    trustScore: clampTrustScore(
      pickSourceNumber(sources, ['trustScore', 'trust_score', 'score']),
      riskLevel,
    ),
    urlAnalysis: {
      destinationUrl: urls.destinationUrl,
      originalUrl: urls.originalUrl,
    },
  };
}
