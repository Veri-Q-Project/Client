import {
  asRecord,
  pickBoolean,
  pickNumber,
  pickRecord,
  pickSourceNumber,
  pickSourceRecord,
  pickSourceString,
  pickSourceStringArray,
} from '@/shared/api/mappers/payloadAccess';
import {
  missingReportInfoLabel,
  reportFallbackCopyByTone,
  trustScoreFallbackByTone,
} from '@/shared/api/mappers/reportText';
import { resolveResultToneFromSources } from '@/shared/api/mappers/resolveResultTone';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ResultTone } from '@/shared/types/resultTone';

type ReportPageViewData = {
  detectedRiskTypes: string[];
  domainComparison: {
    officialUrl: string;
    riskBadgeText: string;
    summary: string;
    suspiciousUrl: string;
  };
  reputation: {
    detailDescription: string;
    providerName: string;
    providerStatusText: string;
    summary: {
      malwareCount: number;
      phishingCount: number;
      spamCount: number;
    };
  };
  reportTitle: string;
  riskDescription: string;
  riskLevel: ResultTone;
  riskLevelText: string;
  scannedAt: string;
  scannedUrl: string;
  serverInfo: {
    certificateIssuer: string;
    certificateStatusText: string;
    certificateStatusTone: 'error' | 'success' | 'warning';
    certificateValidityPeriod: string;
    serverLocation: string;
    serverType: string;
  };
  trustScore: number;
  urlAnalysis: {
    destinationUrl: string;
    originalUrl: string;
  };
};

type ReportUrls = {
  destinationUrl: string;
  originalUrl: string;
  scannedAt: string | null;
  scannedUrl: string;
};

const scannedUrlKeys = [
  'finalUrl',
  'final_url',
  'destinationUrl',
  'destination_url',
  'decodedUrl',
  'decoded_url',
  'originalUrl',
  'original_url',
  'scannedUrl',
  'scanned_url',
  'url',
];

const destinationUrlKeys = [
  'finalUrl',
  'final_url',
  'destinationUrl',
  'destination_url',
  'decodedUrl',
  'decoded_url',
];

function clampCount(value: number | null): number {
  return value === null ? 0 : Math.max(0, Math.round(value));
}

function clampTrustScore(value: number | null, riskLevel: ResultTone): number {
  if (value === null) {
    return trustScoreFallbackByTone[riskLevel];
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getSessionSources(session: ScanSessionSnapshot): unknown[] {
  return [
    session.analysisDetail,
    session.finalResult,
    session.scanResponse,
    session.historySelection,
  ];
}

function formatDateLabel(rawDate: string | null, fallbackLabel = '분석 시각 정보 없음'): string {
  if (!rawDate) {
    return fallbackLabel;
  }

  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return rawDate;
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

function resolveCertificateTone(rawStatusText: string | null): 'error' | 'success' | 'warning' {
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

function resolveReportUrls(session: ScanSessionSnapshot, sources: unknown[]): ReportUrls {
  const scannedUrl =
    pickSourceString(sources, scannedUrlKeys) ??
    session.decodedUrl ??
    session.historySelection?.url ??
    '';
  const originalUrl =
    pickSourceString(sources, ['originalUrl', 'original_url', 'sourceUrl', 'source_url']) ??
    scannedUrl;
  const destinationUrl = pickSourceString(sources, destinationUrlKeys) ?? scannedUrl;
  const scannedAt =
    pickSourceString(sources, ['scannedAt', 'scanned_at', 'createdAt', 'created_at']) ??
    session.historySelection?.scannedAt ??
    null;

  return {
    destinationUrl,
    originalUrl,
    scannedAt,
    scannedUrl,
  };
}

function resolveDetectedRiskTypes(sources: unknown[], riskLevel: ResultTone): string[] {
  const riskTypes = pickSourceStringArray(sources, [
    'detectedRiskTypes',
    'detected_risk_types',
    'riskTypes',
    'risk_types',
    'threats',
  ]);

  return riskTypes.length > 0 ? riskTypes : reportFallbackCopyByTone[riskLevel].detectedRiskTypes;
}

function resolveUrlComparisonSummary({ destinationUrl, originalUrl }: ReportUrls): string {
  if (originalUrl && destinationUrl && originalUrl !== destinationUrl) {
    return '스캔된 QR URL이 최종 목적지와 다른 주소로 리다이렉트됩니다.';
  }

  return '스캔된 QR URL과 최종 목적지가 동일합니다.';
}

function resolveExternalApiStatus(
  externalApiRecord: Record<string, unknown> | null,
): string | null {
  const result = pickSourceString([externalApiRecord], ['result', 'status']);

  if (!result) {
    return null;
  }

  return `검사 결과: ${result}`;
}

function resolveSummaryCount(
  primaryRecord: Record<string, unknown> | null,
  primaryKeys: string[],
  fallbackRecord?: Record<string, unknown> | null,
  fallbackKeys?: string[],
): number {
  return clampCount(
    pickNumber(primaryRecord, primaryKeys) ??
      (fallbackRecord && fallbackKeys ? pickNumber(fallbackRecord, fallbackKeys) : null),
  );
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
  urls: ReportUrls,
): ReportPageViewData['domainComparison'] {
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

function buildReputation(
  reputationRecord: Record<string, unknown> | null,
  internalDbRecord: Record<string, unknown> | null,
): ReportPageViewData['reputation'] {
  const reputationSummaryRecord =
    pickRecord(reputationRecord, ['summary']) ?? asRecord(reputationRecord);

  return {
    detailDescription:
      pickSourceString([reputationRecord], ['detailDescription', 'detail_description']) ??
      '평판 상세 설명이 제공되지 않았습니다.',
    providerName:
      pickSourceString([reputationRecord], ['providerName', 'provider_name', 'provider']) ??
      'Google Safe Browsing',
    providerStatusText:
      pickSourceString([reputationRecord], ['providerStatusText', 'provider_status_text']) ??
      resolveExternalApiStatus(reputationRecord) ??
      '검사 완료',
    summary: {
      malwareCount: resolveSummaryCount(
        reputationSummaryRecord,
        ['malwareCount', 'malware_count'],
        internalDbRecord,
        ['blockCount', 'block_count'],
      ),
      phishingCount: resolveSummaryCount(
        reputationSummaryRecord,
        ['phishingCount', 'phishing_count'],
        internalDbRecord,
        ['reportCount', 'report_count'],
      ),
      spamCount: resolveSummaryCount(reputationSummaryRecord, ['spamCount', 'spam_count']),
    },
  };
}

function buildServerInfo(
  serverInfoRecord: Record<string, unknown> | null,
  certificateRecord: Record<string, unknown> | null,
): ReportPageViewData['serverInfo'] {
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

export function toReportPageData(session: ScanSessionSnapshot): ReportPageViewData {
  const sources = getSessionSources(session);
  const riskLevel = resolveResultToneFromSources(sources, session.riskLevel) ?? 'warning';
  const urls = resolveReportUrls(session, sources);
  const reputationRecord = pickSourceRecord(sources, [
    'reputation',
    'reputationSummary',
    'externalApi',
    'external_api',
  ]);
  const domainComparisonRecord = pickSourceRecord(sources, ['domainComparison', 'domain_compare']);
  const internalDbRecord = pickSourceRecord(sources, ['internalDb', 'internal_db']);
  const { certificateRecord, serverInfoRecord } = resolveServerInfoRecord(
    pickSourceRecord(sources, ['serverInfo', 'server_info']),
  );

  return {
    detectedRiskTypes: resolveDetectedRiskTypes(sources, riskLevel),
    domainComparison: buildDomainComparison(domainComparisonRecord, riskLevel, urls),
    reputation: buildReputation(reputationRecord, internalDbRecord),
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
