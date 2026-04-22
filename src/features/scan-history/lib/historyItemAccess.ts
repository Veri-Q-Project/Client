import { pickBoolean, pickString } from '@/shared/api/responseAccess/payloadAccess';
import { normalizeRiskLevel } from '@/shared/api/risk/normalizeRiskLevel';
import type { ResultTone } from '@/shared/types/resultTone';

const historyIdKeys = ['id', 'scanId', 'scan_id', 'uuid', 'scanUuid', 'scan_uuid'];
const historyScannedAtKeys = ['scannedAt', 'scanned_at', 'createdAt', 'created_at'];
const historyRiskLevelKeys = ['riskLevel', 'risk_level', 'status', 'result'];
const historySchemeTypeKeys = ['schemeType', 'scheme_type'];
const historyTargetValueKeys = [
  'typeInfo',
  'type_info',
  'url',
  'decodedUrl',
  'decoded_url',
  'destinationUrl',
  'destination_url',
  'finalUrl',
  'final_url',
];
const historyTitleKeys = ['title', 'siteName', 'site_name', 'name'];

function normalizeTimestampValue(rawScannedAt: string): string {
  return rawScannedAt.replace(/\./g, '-').replace(' ', 'T');
}

export function pickHistoryTargetValue(source: unknown): string | null {
  return pickString(source, historyTargetValueKeys);
}

export function pickHistoryScannedAt(source: unknown): string | null {
  return pickString(source, historyScannedAtKeys);
}

export function pickHistoryRiskLevel(source: unknown): ResultTone | null {
  return normalizeRiskLevel(pickString(source, historyRiskLevelKeys));
}

export function pickHistorySchemeType(source: unknown): string | null {
  return pickString(source, historySchemeTypeKeys);
}

export function pickHistoryIsUrl(source: unknown): boolean | null {
  return pickBoolean(source, ['isUrl', 'is_url']);
}

export function pickHistoryTitle(source: unknown): string | null {
  return pickString(source, historyTitleKeys);
}

export function buildHistoryItemId(source: unknown, index: number): string {
  const explicitId = pickString(source, historyIdKeys);

  if (explicitId) {
    return explicitId;
  }

  const stableParts = [
    pickHistorySchemeType(source),
    pickHistoryTargetValue(source),
    pickHistoryScannedAt(source),
  ].filter((part): part is string => Boolean(part));

  return stableParts.length > 0 ? `${stableParts.join('|')}|${index}` : `history-${index + 1}`;
}

export function resolveHistoryTimestamp(rawScannedAt: string | null): number {
  if (!rawScannedAt) {
    return 0;
  }

  const parsedTimestamp = Date.parse(normalizeTimestampValue(rawScannedAt));
  return Number.isNaN(parsedTimestamp) ? 0 : parsedTimestamp;
}
