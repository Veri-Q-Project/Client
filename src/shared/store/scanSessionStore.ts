import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type {
  BackendAnalysisDetailResponse,
  BackendScanResponse,
  BackendSseFinalPayload,
} from '@/shared/api/types';
import { normalizeScanSchemeTypeAlias } from '@/shared/lib/scan-session/scanClassification';
import type { ResultTone } from '@/shared/types/resultTone';

import {
  buildAnalysisDetailPatch,
  buildFinalResultPatch,
  buildHistorySelectionPatch,
  buildScanResponsePatch,
} from './scanSessionTransitions';

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
  pendingTextScanUrl: string | null;
  riskLevel: ResultTone | null;
  scanResponse: BackendScanResponse | null;
  schemeType: string | null;
};

type ScanSessionState = ScanSessionSnapshot & {
  clearPendingTextScanUrl: () => void;
  clearSession: () => void;
  resetForNewScan: () => void;
  setAnalysisDetail: (detail: BackendAnalysisDetailResponse) => void;
  setFinalResult: (finalResult: BackendSseFinalPayload) => void;
  setHistorySelection: (historySelection: ScanHistorySelection) => void;
  setPendingTextScanUrl: (url: string) => void;
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
  pendingTextScanUrl: null,
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
    pendingTextScanUrl:
      typeof persisted.pendingTextScanUrl === 'string' ? persisted.pendingTextScanUrl : null,
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
      clearPendingTextScanUrl: () => {
        set({ pendingTextScanUrl: null });
      },
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
          pendingTextScanUrl: null,
          riskLevel: null,
          scanResponse: null,
          schemeType: null,
        });
      },
      setAnalysisDetail: (analysisDetail) => {
        set((state) => buildAnalysisDetailPatch(state, analysisDetail));
      },
      setFinalResult: (finalResult) => {
        set((state) => buildFinalResultPatch(state, finalResult));
      },
      setHistorySelection: (historySelection) => {
        set(buildHistorySelectionPatch(historySelection));
      },
      setPendingTextScanUrl: (url) => {
        set({
          analysisDetail: null,
          decodedUrl: url,
          finalResult: null,
          historySelection: null,
          isUrl: true,
          pendingTextScanUrl: url,
          riskLevel: null,
          scanResponse: null,
          schemeType: 'WEB',
        });
      },
      setScanResponse: (scanResponse) => {
        set((state) => buildScanResponsePatch(scanResponse, state));
      },
    }),
    {
      name: scanSessionStorageKey,
      partialize: (state) => ({
        decodedUrl: state.decodedUrl,
        historySelection: state.historySelection,
        isUrl: state.isUrl,
        pendingTextScanUrl: state.pendingTextScanUrl,
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
    pendingTextScanUrl: state.pendingTextScanUrl,
    riskLevel: state.riskLevel,
    scanResponse: state.scanResponse,
    schemeType: state.schemeType,
  };
}
