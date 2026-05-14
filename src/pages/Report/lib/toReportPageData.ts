import {
  pickBoolean,
  pickSourceNumber,
  pickSourceRecord,
  pickSourceString,
  pickSourceStringArray,
} from '@/shared/api/responseAccess/payloadAccess';
import type { ResolvedScanUrls } from '@/shared/lib/scan-session/scanUrlResolution';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ResultTone } from '@/shared/types/resultTone';

import { createReportPageDataContext } from './reportPageDataContext';
import { buildReportReputation } from './reportReputationData';
import {
  missingReportInfoLabel,
  reportFallbackCopyByTone,
  trustScoreFallbackByTone,
} from '../constants/reportText';

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

function formatCertificateStatus(certificateRecord: Record<string, unknown> | null): string | null {
  const isValid = pickBoolean(certificateRecord, ['valid', 'isValid', 'is_valid']);

  if (isValid === null) {
    return null;
  }

  return isValid ? '유효한 인증서' : '유효하지 않은 인증서';
}

function formatCertificateValidityPeriod(
  certificateRecord: Record<string, unknown> | null,
): string | null {
  const validFrom = pickSourceString([certificateRecord], ['validFrom', 'valid_from']);
  const validTo = pickSourceString([certificateRecord], ['validTo', 'valid_to']);

  if (!validFrom && !validTo) {
    return null;
  }

  return `${validFrom ?? '알 수 없음'} - ${validTo ?? '알 수 없음'}`;
}

function resolveCertificateTone(
  rawStatusText: string | null,
): ReportPageData['serverInfo']['certificateStatusTone'] {
  if (!rawStatusText) {
    return 'warning';
  }

  const normalizedStatusText = rawStatusText.trim().toLowerCase();
  const errorSignals = ['expired', 'invalid', 'revoked', '만료', '폐기', '유효하지 않'];
  const successSignals = ['valid', 'active', '유효', '정상'];

  if (errorSignals.some((signal) => normalizedStatusText.includes(signal))) {
    return 'error';
  }

  if (successSignals.some((signal) => normalizedStatusText.includes(signal))) {
    return 'success';
  }

  return 'warning';
}

function resolveDetectedRiskTypes(sources: unknown[], riskLevel: ResultTone): string[] {
  const riskTypes = pickSourceStringArray(
    sources,
    ['detectedRiskTypes', 'detected_risk_types', 'riskTypes', 'risk_types', 'threats'],
    ',',
  );

  return riskTypes.length > 0 ? riskTypes : reportFallbackCopyByTone[riskLevel].detectedRiskTypes;
}

function resolveUrlComparisonSummary({ destinationUrl, originalUrl }: ResolvedScanUrls): string {
  if (originalUrl && destinationUrl && originalUrl !== destinationUrl) {
    return '스캔된 QR URL이 최종 목적지와 다른 주소로 리다이렉트됩니다.';
  }

  return '스캔된 QR URL과 최종 목적지가 동일합니다.';
}

function resolveServerInfoRecord(rawServerInfoRecord: Record<string, unknown> | null) {
  if (!rawServerInfoRecord) {
    return {
      certificateRecord: null,
      serverInfoRecord: null,
    };
  }

  const certificateRecord = pickSourceRecord([rawServerInfoRecord], ['certificate']);

  return {
    certificateRecord,
    serverInfoRecord: {
      ...rawServerInfoRecord,
      certificateStatusText:
        pickSourceString(
          [rawServerInfoRecord],
          ['certificateStatusText', 'certificate_status_text'],
        ) ?? formatCertificateStatus(certificateRecord),
      certificateValidityPeriod:
        pickSourceString(
          [rawServerInfoRecord],
          ['certificateValidityPeriod', 'certificate_validity_period'],
        ) ?? formatCertificateValidityPeriod(certificateRecord),
      serverLocation: pickSourceString(
        [rawServerInfoRecord],
        ['serverLocation', 'server_location', 'location'],
      ),
      serverType: pickSourceString([rawServerInfoRecord], ['serverType', 'server_type', 'type']),
    },
  };
}

function buildDomainComparison(
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

function buildServerInfo(
  serverInfoRecord: Record<string, unknown> | null,
  certificateRecord: Record<string, unknown> | null,
): ReportPageData['serverInfo'] {
  const certificateStatusText =
    pickSourceString([serverInfoRecord], ['certificateStatusText', 'certificate_status_text']) ??
    formatCertificateStatus(certificateRecord) ??
    '확인 필요';

  return {
    certificateIssuer:
      pickSourceString([serverInfoRecord], ['certificateIssuer', 'certificate_issuer']) ??
      pickSourceString([certificateRecord], ['issuer']) ??
      missingReportInfoLabel,
    certificateStatusText,
    certificateStatusTone: resolveCertificateTone(certificateStatusText),
    certificateValidityPeriod:
      pickSourceString(
        [serverInfoRecord],
        ['certificateValidityPeriod', 'certificate_validity_period'],
      ) ?? missingReportInfoLabel,
    serverLocation:
      pickSourceString([serverInfoRecord], ['serverLocation', 'server_location']) ??
      missingReportInfoLabel,
    serverType:
      pickSourceString([serverInfoRecord], ['serverType', 'server_type']) ?? missingReportInfoLabel,
  };
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
  const { certificateRecord, serverInfoRecord } = resolveServerInfoRecord(rawServerInfoRecord);

  return {
    detectedRiskTypes: resolveDetectedRiskTypes(sources, riskLevel),
    domainComparison: buildDomainComparison(domainComparisonRecord, riskLevel, urls),
    reputation: buildReportReputation(reputationRecord, internalDbRecord, sources),
    reportTitle: '상세 분석 리포트',
    riskDescription: reportFallbackCopyByTone[riskLevel].riskDescription,
    riskLevel,
    riskLevelText: reportFallbackCopyByTone[riskLevel].riskLevelText,
    scannedAt: formatDateLabel(urls.scannedAt),
    scannedUrl: urls.scannedUrl,
    serverInfo: buildServerInfo(serverInfoRecord, certificateRecord),
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
