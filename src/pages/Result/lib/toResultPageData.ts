import {
  pickBoolean,
  pickSourceNumber,
  pickSourceRecord,
  pickSourceString,
} from '@/shared/api/responseAccess/payloadAccess';
import { resolveResultToneFromSources } from '@/shared/api/risk/resolveResultTone';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ResultTone } from '@/shared/types/resultTone';

import type { ResultPageData } from '../types/resultPage.types';

const trustScoreFallbackByTone: Record<ResultTone, number> = {
  critical: 82,
  safe: 18,
  warning: 45,
};

const missingCertificateLabel = 'SSL 인증서 정보 없음';

function clampTrustScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function formatDateOnlyLabel(rawDate: string | null): string | null {
  if (!rawDate) {
    return null;
  }

  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return rawDate;
  }

  const dateParts = new Intl.DateTimeFormat('ko-KR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Seoul',
    year: 'numeric',
  }).formatToParts(parsedDate);
  const year = dateParts.find((part) => part.type === 'year')?.value;
  const month = dateParts.find((part) => part.type === 'month')?.value;
  const day = dateParts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return rawDate;
  }

  return `${year}.${month}.${day}`;
}

function resolveCertificateRecord(sources: unknown[]): Record<string, unknown> | null {
  const serverInfoRecord = pickSourceRecord(sources, ['serverInfo', 'server_info']);

  return pickSourceRecord([serverInfoRecord, ...sources], ['certificate']);
}

function resolveCertificateStatusText(certificateRecord: Record<string, unknown> | null): string {
  const isValid = pickBoolean(certificateRecord, ['valid', 'isValid', 'is_valid']);

  if (isValid === null) {
    return missingCertificateLabel;
  }

  return isValid ? 'SSL 인증서 유효함' : 'SSL 인증서 유효하지 않음';
}

function resolveCertificateIssuerText(
  certificateRecord: Record<string, unknown> | null,
): string | null {
  if (!certificateRecord) {
    return null;
  }

  const issuer = pickSourceString([certificateRecord], ['issuer', 'certificateIssuer']);

  return issuer ? `발급자 ${issuer}` : '발급자 정보 없음';
}

function resolveCertificateValidityText(
  certificateRecord: Record<string, unknown> | null,
): string | null {
  const validFrom = formatDateOnlyLabel(
    pickSourceString([certificateRecord], ['validFrom', 'valid_from']),
  );
  const validTo = formatDateOnlyLabel(
    pickSourceString([certificateRecord], ['validTo', 'valid_to']),
  );

  if (!validFrom && !validTo) {
    return null;
  }

  return `유효 기간 ${validFrom ?? '정보 없음'} - ${validTo ?? '정보 없음'}`;
}

function buildSiteMeta(sources: unknown[]): string {
  const certificateRecord = resolveCertificateRecord(sources);
  const metaParts = [
    resolveCertificateStatusText(certificateRecord),
    resolveCertificateIssuerText(certificateRecord),
    resolveCertificateValidityText(certificateRecord),
  ].filter((metaPart): metaPart is string => Boolean(metaPart));

  return metaParts.join(' · ');
}

export function toResultPageData(
  session: ScanSessionSnapshot,
  fallbackTone: ResultTone,
): ResultPageData {
  const sources = [
    session.analysisDetail,
    session.finalResult,
    session.scanResponse,
    session.historySelection,
  ];

  const resolvedOriginalUrl =
    pickSourceString(sources, [
      'originalUrl',
      'original_url',
      'sourceUrl',
      'source_url',
      'scannedUrl',
      'scanned_url',
      'decodedUrl',
      'decoded_url',
      'url',
    ]) ??
    session.decodedUrl ??
    session.historySelection?.url ??
    '';

  const redirectRecord = pickSourceRecord(sources, ['redirect']);
  const resolvedFinalUrl =
    pickSourceString([redirectRecord], ['finalUrl', 'final_url']) ??
    pickSourceString(sources, [
      'finalUrl',
      'final_url',
      'destinationUrl',
      'destination_url',
      'visitUrl',
      'visit_url',
    ]) ??
    resolvedOriginalUrl;

  const resolvedPreviewUrl =
    pickSourceString(sources, ['previewUrl', 'preview_url']) ?? resolvedFinalUrl;
  const resolvedTone = resolveResultToneFromSources(sources, session.riskLevel) ?? fallbackTone;
  const resolvedTrustScore =
    pickSourceNumber(sources, ['trustScore', 'trust_score', 'score']) ??
    trustScoreFallbackByTone[resolvedTone];

  return {
    detailUnavailable: false,
    previewUrl: resolvedPreviewUrl,
    riskLevel: resolvedTone,
    siteMeta: buildSiteMeta(sources),
    siteName: resolvedOriginalUrl,
    siteUrl: resolvedFinalUrl,
    trustScore: clampTrustScore(resolvedTrustScore),
    visitUrl: resolvedFinalUrl,
  };
}
