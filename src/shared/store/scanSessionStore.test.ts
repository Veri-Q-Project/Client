import { afterEach, describe, expect, it } from 'vitest';

import { useScanSessionStore } from './scanSessionStore';

describe('scanSessionStore', () => {
  afterEach(() => {
    useScanSessionStore.getState().clearSession();
  });

  it('uses typeInfo as decodedUrl for web scan responses', () => {
    useScanSessionStore.getState().setScanResponse({
      guestUuid: 'guest-1',
      schemeType: 'WEB',
      typeInfo: 'https://example.com/path',
    });

    const state = useScanSessionStore.getState();

    expect(state.decodedUrl).toBe('https://example.com/path');
    expect(state.schemeType).toBe('WEB');
    expect(state.isUrl).toBe(true);
  });

  it('uses finalUrl and score from analysis detail payloads', () => {
    useScanSessionStore.getState().setAnalysisDetail({
      originalUrl: 'https://short.example/a',
      redirect: {
        finalUrl: 'https://final.example/path',
      },
      riskLevel: 'safe',
      score: 83,
    });

    const state = useScanSessionStore.getState();

    expect(state.decodedUrl).toBe('https://final.example/path');
    expect(state.riskLevel).toBe('critical');
    expect(state.isUrl).toBe(true);
  });

  it('updates URL classification from analysis detail payloads', () => {
    useScanSessionStore.getState().setAnalysisDetail({
      scheme_type: 'SMS',
      targetValue: '01012345678',
    });

    const state = useScanSessionStore.getState();

    expect(state.decodedUrl).toBe('01012345678');
    expect(state.schemeType).toBe('SMS');
    expect(state.isUrl).toBe(false);
  });

  it('normalizes URL history selections as web scans', () => {
    useScanSessionStore.getState().setHistorySelection({
      isUrl: false,
      riskLevel: 'safe',
      scannedAt: '2026.05.03',
      schemeType: 'URL',
      url: 'https://example.com/history',
    });

    const state = useScanSessionStore.getState();

    expect(state.decodedUrl).toBe('https://example.com/history');
    expect(state.schemeType).toBe('WEB');
    expect(state.isUrl).toBe(true);
  });
});
