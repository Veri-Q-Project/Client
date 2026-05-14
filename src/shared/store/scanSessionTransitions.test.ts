import { describe, expect, it } from 'vitest';

import {
  buildAnalysisDetailPatch,
  buildFinalResultPatch,
  buildHistorySelectionPatch,
  buildScanResponsePatch,
} from './scanSessionTransitions';

import type { ScanHistorySelection, ScanSessionSnapshot } from './scanSessionStore';

function createSnapshot(overrides: Partial<ScanSessionSnapshot> = {}): ScanSessionSnapshot {
  return {
    analysisDetail: null,
    decodedUrl: 'https://previous.example/path',
    finalResult: null,
    historySelection: null,
    isUrl: true,
    riskLevel: 'warning',
    scanResponse: null,
    schemeType: 'WEB',
    ...overrides,
  };
}

describe('scanSessionTransitions', () => {
  it('keeps previous URL classification when analysis detail omits URL fields', () => {
    const patch = buildAnalysisDetailPatch(createSnapshot(), {
      riskLevel: 'safe',
      score: 72,
    });

    expect(patch).toMatchObject({
      decodedUrl: 'https://previous.example/path',
      isUrl: true,
      riskLevel: 'critical',
      schemeType: 'WEB',
    });
  });

  it('keeps previous scan identity when final result only carries risk fields', () => {
    const historySelection: ScanHistorySelection = {
      isUrl: true,
      riskLevel: 'warning',
      scannedAt: '2026.05.14',
      schemeType: 'WEB',
      url: 'https://history.example/path',
    };
    const patch = buildFinalResultPatch(createSnapshot({ historySelection }), {
      riskLevel: 'critical',
    });

    expect(patch).toMatchObject({
      decodedUrl: 'https://previous.example/path',
      historySelection,
      isUrl: true,
      riskLevel: 'critical',
      schemeType: 'WEB',
    });
  });

  it('clears active scan payloads when selecting a history item', () => {
    const historySelection: ScanHistorySelection = {
      isUrl: false,
      riskLevel: 'safe',
      scannedAt: '2026.05.14',
      schemeType: 'URL',
      url: 'https://example.com/history',
    };

    expect(buildHistorySelectionPatch(historySelection)).toMatchObject({
      analysisDetail: null,
      decodedUrl: 'https://example.com/history',
      finalResult: null,
      historySelection,
      isUrl: true,
      riskLevel: 'safe',
      scanResponse: null,
      schemeType: 'WEB',
    });
  });

  it('normalizes scan responses from backend typeInfo and score fields', () => {
    const scanResponse = {
      scheme_type: 'SMS',
      score: 85,
      typeInfo: '01012345678',
    };

    expect(buildScanResponsePatch(scanResponse)).toMatchObject({
      analysisDetail: null,
      decodedUrl: '01012345678',
      finalResult: null,
      historySelection: null,
      isUrl: false,
      riskLevel: 'critical',
      scanResponse,
      schemeType: 'SMS',
    });
  });
});
