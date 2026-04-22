import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import {
  pickBoolean,
  pickSourceString,
  pickString,
} from '@/shared/api/responseAccess/payloadAccess';
import { resolveResultToneFromSource } from '@/shared/api/risk/resolveResultTone';
import type {
  BackendAnalysisDetailResponse,
  BackendScanResponse,
  BackendSseFinalPayload,
} from '@/shared/api/types';
import type { ResultTone } from '@/shared/types/resultTone';

export type ScanHistorySelection = {
  isUrl: boolean | null;
  riskLevel: ResultTone | null;
  scannedAt: string | null;
  schemeType: string | null;
  url: string;
};

export type ScanSessionSnapshot = {
  analysisDetail: BackendAnalysisDetailResponse | null;
  decodedUrl: string | null;
  finalResult: BackendSseFinalPayload | null;
  historySelection: ScanHistorySelection | null;
  isUrl: boolean | null;
  riskLevel: ResultTone | null;
  scanResponse: BackendScanResponse | null;
  schemeType: string | null;
};

type ScanSessionState = ScanSessionSnapshot & {
  clearSession: () => void;
  resetForNewScan: () => void;
  setAnalysisDetail: (detail: BackendAnalysisDetailResponse) => void;
  setFinalResult: (finalResult: BackendSseFinalPayload) => void;
  setHistorySelection: (historySelection: ScanHistorySelection) => void;
  setScanResponse: (scanResponse: BackendScanResponse) => void;
};

const scanSessionStorageKey = 'veriq.scanSession';

const noopStorage: StateStorage = {
  getItem: () => null,
  removeItem: () => {},
  setItem: () => {},
};

function createScanSessionStorage(): StateStorage {
  if (typeof window === 'undefined') {
    return noopStorage;
  }

  try {
    return window.localStorage ?? noopStorage;
  } catch {
    return noopStorage;
  }
}

const initialState: ScanSessionSnapshot = {
  analysisDetail: null,
  decodedUrl: null,
  finalResult: null,
  historySelection: null,
  isUrl: null,
  riskLevel: null,
  scanResponse: null,
  schemeType: null,
};

function resolveDecodedUrl(source: unknown): string | null {
  return pickString(source, [
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
  ]);
}

function resolveSchemeType(source: unknown, decodedUrl: string | null): string | null {
  const explicitSchemeType = pickString(source, ['schemeType', 'scheme_type']);

  if (explicitSchemeType) {
    return explicitSchemeType;
  }

  if (!decodedUrl) {
    return null;
  }

  if (/^https?:\/\//iu.test(decodedUrl)) {
    return 'WEB';
  }

  return 'NON_WEB';
}

function resolveIsUrl(
  source: unknown,
  decodedUrl: string | null,
  schemeType: string | null,
): boolean | null {
  const explicitIsUrl = pickBoolean(source, ['isUrl', 'is_url']);

  if (explicitIsUrl !== null) {
    return explicitIsUrl;
  }

  if (schemeType) {
    return schemeType.trim().toUpperCase() === 'WEB';
  }

  if (decodedUrl) {
    return /^https?:\/\//iu.test(decodedUrl);
  }

  return null;
}

function resolveRiskLevel(source: unknown): ResultTone | null {
  return resolveResultToneFromSource(source);
}

export const useScanSessionStore = create<ScanSessionState>()(
  persist(
    (set) => ({
      ...initialState,
      clearSession: () => {
        set(initialState);
      },
      resetForNewScan: () => {
        set({
          analysisDetail: null,
          decodedUrl: null,
          finalResult: null,
          historySelection: null,
          isUrl: null,
          riskLevel: null,
          scanResponse: null,
          schemeType: null,
        });
      },
      setAnalysisDetail: (analysisDetail) => {
        const sources = [analysisDetail];
        const decodedUrl = resolveDecodedUrl(analysisDetail);

        set((state) => ({
          analysisDetail,
          decodedUrl: decodedUrl ?? state.decodedUrl,
          riskLevel: resolveRiskLevel(analysisDetail) ?? state.riskLevel,
          schemeType: pickSourceString(sources, ['schemeType', 'scheme_type']) ?? state.schemeType,
        }));
      },
      setFinalResult: (finalResult) => {
        const decodedUrl = resolveDecodedUrl(finalResult);
        const schemeType = resolveSchemeType(finalResult, decodedUrl);

        set((state) => ({
          decodedUrl: decodedUrl ?? state.decodedUrl,
          finalResult,
          historySelection: state.historySelection,
          isUrl:
            resolveIsUrl(
              finalResult,
              decodedUrl ?? state.decodedUrl,
              schemeType ?? state.schemeType,
            ) ?? state.isUrl,
          riskLevel: resolveRiskLevel(finalResult) ?? state.riskLevel,
          schemeType: schemeType ?? state.schemeType,
        }));
      },
      setHistorySelection: (historySelection) => {
        const schemeType = resolveSchemeType(historySelection, historySelection.url);

        set({
          analysisDetail: null,
          decodedUrl: historySelection.url,
          finalResult: null,
          historySelection,
          isUrl: resolveIsUrl(historySelection, historySelection.url, schemeType),
          riskLevel: historySelection.riskLevel,
          scanResponse: null,
          schemeType,
        });
      },
      setScanResponse: (scanResponse) => {
        const decodedUrl = resolveDecodedUrl(scanResponse);
        const schemeType = resolveSchemeType(scanResponse, decodedUrl);

        set({
          analysisDetail: null,
          decodedUrl,
          finalResult: null,
          historySelection: null,
          isUrl: resolveIsUrl(scanResponse, decodedUrl, schemeType),
          riskLevel: resolveRiskLevel(scanResponse),
          scanResponse,
          schemeType,
        });
      },
    }),
    {
      name: scanSessionStorageKey,
      partialize: (state) => ({
        analysisDetail: state.analysisDetail,
        decodedUrl: state.decodedUrl,
        finalResult: state.finalResult,
        historySelection: state.historySelection,
        isUrl: state.isUrl,
        riskLevel: state.riskLevel,
        scanResponse: state.scanResponse,
        schemeType: state.schemeType,
      }),
      storage: createJSONStorage(createScanSessionStorage),
    },
  ),
);

export function getScanSessionSnapshot(): ScanSessionSnapshot {
  const state = useScanSessionStore.getState();

  return {
    analysisDetail: state.analysisDetail,
    decodedUrl: state.decodedUrl,
    finalResult: state.finalResult,
    historySelection: state.historySelection,
    isUrl: state.isUrl,
    riskLevel: state.riskLevel,
    scanResponse: state.scanResponse,
    schemeType: state.schemeType,
  };
}
