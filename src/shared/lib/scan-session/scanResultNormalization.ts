import { pickBoolean, pickString } from '@/shared/api/responseAccess/payloadAccess';
import { resolveResultToneFromSource } from '@/shared/api/risk/resolveResultTone';
import type { ResultTone } from '@/shared/types/resultTone';

import { isHttpUrl, normalizeScanSchemeTypeAlias } from './scanClassification';

const decodedUrlKeys = [
  'decodedUrl',
  'decoded_url',
  'destinationUrl',
  'destination_url',
  'finalUrl',
  'final_url',
  'scannedUrl',
  'scanned_url',
  'typeInfo',
  'type_info',
  'targetValue',
  'target_value',
  'url',
];

const schemeTypeKeys = ['schemeType', 'scheme_type'];
const isUrlKeys = ['isUrl', 'is_url'];

export type NormalizedScanResult = {
  decodedUrl: string | null;
  isUrl: boolean | null;
  riskLevel: ResultTone | null;
  schemeType: string | null;
};

export function resolveScanDecodedUrl(source: unknown): string | null {
  return pickString(source, decodedUrlKeys);
}

export function resolveScanSchemeType(source: unknown, decodedUrl: string | null): string | null {
  const explicitSchemeType = normalizeScanSchemeTypeAlias(pickString(source, schemeTypeKeys));

  if (explicitSchemeType) {
    return explicitSchemeType;
  }

  if (!decodedUrl) {
    return null;
  }

  return isHttpUrl(decodedUrl) ? 'WEB' : 'NON_WEB';
}

export function resolveScanIsUrl(
  source: unknown,
  decodedUrl: string | null,
  schemeType: string | null,
): boolean | null {
  const explicitIsUrl = pickBoolean(source, isUrlKeys);

  if (schemeType) {
    return schemeType === 'WEB';
  }

  if (isHttpUrl(decodedUrl)) {
    return true;
  }

  return explicitIsUrl;
}

export function resolveScanRiskLevel(source: unknown): ResultTone | null {
  return resolveResultToneFromSource(source);
}

export function normalizeScanResult(source: unknown): NormalizedScanResult {
  const decodedUrl = resolveScanDecodedUrl(source);
  const schemeType = resolveScanSchemeType(source, decodedUrl);

  return {
    decodedUrl,
    isUrl: resolveScanIsUrl(source, decodedUrl, schemeType),
    riskLevel: resolveScanRiskLevel(source),
    schemeType,
  };
}
