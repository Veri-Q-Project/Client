import type {
  BackendAnalysisDetailResponse,
  BackendScanResponse,
  BackendSseFinalPayload,
} from '@/shared/api/types';
import {
  normalizeScanResult,
  resolveScanIsUrl,
  resolveScanSchemeType,
} from '@/shared/lib/scan-session/scanResultNormalization';

import type { ScanHistorySelection, ScanSessionSnapshot } from './scanSessionStore';

export type ScanSessionPatch = Partial<ScanSessionSnapshot>;

export function buildAnalysisDetailPatch(
  state: ScanSessionSnapshot,
  analysisDetail: BackendAnalysisDetailResponse,
): ScanSessionPatch {
  const normalizedResult = normalizeScanResult(analysisDetail);
  const nextDecodedUrl = normalizedResult.decodedUrl ?? state.decodedUrl;
  const schemeType =
    normalizedResult.schemeType ?? resolveScanSchemeType(analysisDetail, nextDecodedUrl);
  const nextSchemeType = schemeType ?? state.schemeType;

  return {
    analysisDetail,
    decodedUrl: nextDecodedUrl,
    isUrl: resolveScanIsUrl(analysisDetail, nextDecodedUrl, nextSchemeType) ?? state.isUrl,
    riskLevel: normalizedResult.riskLevel ?? state.riskLevel,
    schemeType: nextSchemeType,
  };
}

export function buildFinalResultPatch(
  state: ScanSessionSnapshot,
  finalResult: BackendSseFinalPayload,
): ScanSessionPatch {
  const normalizedResult = normalizeScanResult(finalResult);
  const nextDecodedUrl = normalizedResult.decodedUrl ?? state.decodedUrl;
  const nextSchemeType = normalizedResult.schemeType ?? state.schemeType;

  return {
    decodedUrl: nextDecodedUrl,
    finalResult,
    historySelection: state.historySelection,
    isUrl: resolveScanIsUrl(finalResult, nextDecodedUrl, nextSchemeType) ?? state.isUrl,
    riskLevel: normalizedResult.riskLevel ?? state.riskLevel,
    schemeType: nextSchemeType,
  };
}

export function buildHistorySelectionPatch(
  historySelection: ScanHistorySelection,
): ScanSessionPatch {
  const schemeType = resolveScanSchemeType(historySelection, historySelection.url);

  return {
    analysisDetail: null,
    decodedUrl: historySelection.url,
    finalResult: null,
    historySelection,
    isUrl: resolveScanIsUrl(historySelection, historySelection.url, schemeType),
    riskLevel: historySelection.riskLevel,
    scanResponse: null,
    schemeType,
  };
}

export function buildScanResponsePatch(scanResponse: BackendScanResponse): ScanSessionPatch {
  const normalizedResult = normalizeScanResult(scanResponse);

  return {
    analysisDetail: null,
    decodedUrl: normalizedResult.decodedUrl,
    finalResult: null,
    historySelection: null,
    isUrl: normalizedResult.isUrl,
    riskLevel: normalizedResult.riskLevel,
    scanResponse,
    schemeType: normalizedResult.schemeType,
  };
}
