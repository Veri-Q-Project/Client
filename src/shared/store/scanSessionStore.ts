import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type {
  BackendAnalysisDetailResponse,
  BackendScanResponse,
  BackendSseFinalPayload,
} from '@/shared/api/types';
import { normalizeScanSchemeTypeAlias } from '@/shared/lib/scan-session/scanClassification';
import {
  normalizeScanResult,
  resolveScanDecodedUrl,
  resolveScanIsUrl,
  resolveScanRiskLevel,
  resolveScanSchemeType,
} from '@/shared/lib/scan-session/scanResultNormalization';
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
  getItem: (_key) => null,
  removeItem: (_key) => {},
  setItem: (_key, _value) => {},
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

function mergePersistedLightSession(
  persistedState: unknown,
  currentState: ScanSessionState,
): ScanSessionState {
  if (!persistedState || typeof persistedState !== 'object' || Array.isArray(persistedState)) {
    return currentState;
  }

  const persisted = persistedState as Partial<ScanSessionSnapshot>;

  return {
    ...currentState,
    decodedUrl: typeof persisted.decodedUrl === 'string' ? persisted.decodedUrl : null,
    historySelection: persisted.historySelection ?? null,
    isUrl: typeof persisted.isUrl === 'boolean' ? persisted.isUrl : null,
    riskLevel: persisted.riskLevel ?? null,
    schemeType:
      typeof persisted.schemeType === 'string'
        ? normalizeScanSchemeTypeAlias(persisted.schemeType)
        : null,
  };
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
        const normalizedResult = normalizeScanResult(analysisDetail);

        set((state) => {
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
        });
      },
      setFinalResult: (finalResult) => {
        const normalizedResult = normalizeScanResult(finalResult);

        set((state) => ({
          decodedUrl: normalizedResult.decodedUrl ?? state.decodedUrl,
          finalResult,
          historySelection: state.historySelection,
          isUrl:
            resolveScanIsUrl(
              finalResult,
              normalizedResult.decodedUrl ?? state.decodedUrl,
              normalizedResult.schemeType ?? state.schemeType,
            ) ?? state.isUrl,
          riskLevel: normalizedResult.riskLevel ?? state.riskLevel,
          schemeType: normalizedResult.schemeType ?? state.schemeType,
        }));
      },
      setHistorySelection: (historySelection) => {
        const schemeType = resolveScanSchemeType(historySelection, historySelection.url);

        set({
          analysisDetail: null,
          decodedUrl: historySelection.url,
          finalResult: null,
          historySelection,
          isUrl: resolveScanIsUrl(historySelection, historySelection.url, schemeType),
          riskLevel: historySelection.riskLevel,
          scanResponse: null,
          schemeType,
        });
      },
      setScanResponse: (scanResponse) => {
        const decodedUrl = resolveScanDecodedUrl(scanResponse);
        const schemeType = resolveScanSchemeType(scanResponse, decodedUrl);

        set({
          analysisDetail: null,
          decodedUrl,
          finalResult: null,
          historySelection: null,
          isUrl: resolveScanIsUrl(scanResponse, decodedUrl, schemeType),
          riskLevel: resolveScanRiskLevel(scanResponse),
          scanResponse,
          schemeType,
        });
      },
    }),
    {
      name: scanSessionStorageKey,
      partialize: (state) => ({
        decodedUrl: state.decodedUrl,
        historySelection: state.historySelection,
        isUrl: state.isUrl,
        riskLevel: state.riskLevel,
        schemeType: state.schemeType,
      }),
      merge: mergePersistedLightSession,
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
