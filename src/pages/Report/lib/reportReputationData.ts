import {
  asRecord,
  pickRecord,
  pickSourceNumber,
  pickSourceString,
} from '@/shared/api/responseAccess/payloadAccess';

import { missingReportInfoLabel } from '../constants/reportText';

import type { ReportPageData } from '../types/reportPage.types';

function clampCount(value: number | null): number {
  return value === null ? 0 : Math.max(0, Math.round(value));
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

function resolveSummaryCount(sources: unknown[], keys: string[]): number {
  return clampCount(pickSourceNumber(sources, keys));
}

function formatDomainAgeText(rawValue: string | number | null): string {
  if (rawValue === null) {
    return missingReportInfoLabel;
  }

  const valueText = `${rawValue}`.trim();

  if (!valueText) {
    return missingReportInfoLabel;
  }

  if (/^\d+(?:\.\d+)?$/u.test(valueText)) {
    return `${Math.max(0, Math.round(Number(valueText))).toLocaleString('ko-KR')}일`;
  }

  return valueText;
}

function resolveDomainAgeText(sources: unknown[]): string {
  const stringValue = pickSourceString(sources, ['domainAge', 'domain_age']);

  if (stringValue) {
    return formatDomainAgeText(stringValue);
  }

  return formatDomainAgeText(pickSourceNumber(sources, ['domainAge', 'domain_age']));
}

export function buildReportReputation(
  reputationRecord: Record<string, unknown> | null,
  internalDbRecord: Record<string, unknown> | null,
  sources: unknown[],
): ReportPageData['reputation'] {
  const reputationSummaryRecord =
    pickRecord(reputationRecord, ['summary']) ?? asRecord(reputationRecord);
  const metricSources = [reputationSummaryRecord, reputationRecord, internalDbRecord, ...sources];

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
      domainAgeText: resolveDomainAgeText(metricSources),
      reportCount: resolveSummaryCount(metricSources, [
        'reportCount',
        'report_count',
        'phishingCount',
        'phishing_count',
      ]),
    },
  };
}
