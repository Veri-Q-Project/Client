import { describe, expect, it } from 'vitest';

import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { createReportPageDataContext, getReportSessionSources } from './reportPageDataContext';

function createSession(overrides: Partial<ScanSessionSnapshot> = {}): ScanSessionSnapshot {
  return {
    analysisDetail: null,
    decodedUrl: null,
    finalResult: null,
    historySelection: null,
    isUrl: true,
    riskLevel: null,
    scanResponse: null,
    schemeType: 'WEB',
    ...overrides,
  };
}

describe('reportPageDataContext', () => {
  it('keeps report session sources in priority order', () => {
    const session = createSession({
      analysisDetail: { source: 'analysis' },
      finalResult: { source: 'final' },
      historySelection: {
        isUrl: true,
        riskLevel: 'safe',
        scannedAt: '2026.05.14',
        schemeType: 'WEB',
        url: 'https://history.example',
      },
      scanResponse: { source: 'scan' },
    });

    expect(getReportSessionSources(session)).toEqual([
      session.analysisDetail,
      session.finalResult,
      session.scanResponse,
      session.historySelection,
    ]);
  });

  it('resolves risk, urls, and section records from backend payloads', () => {
    const context = createReportPageDataContext(
      createSession({
        analysisDetail: {
          domainComparison: {
            summary: 'domain mismatch',
          },
          externalApi: {
            provider: 'Google Safe Browsing',
          },
          internalDb: {
            reportCount: 2,
          },
          originalUrl: 'https://short.example/a',
          redirect: {
            finalUrl: 'https://final.example/path',
          },
          score: 85,
          serverInfo: {
            location: 'Seoul, KR',
          },
        },
        decodedUrl: 'https://fallback.example',
        riskLevel: 'safe',
      }),
    );

    expect(context.riskLevel).toBe('critical');
    expect(context.urls.scannedUrl).toBe('https://short.example/a');
    expect(context.urls.destinationUrl).toBe('https://final.example/path');
    expect(context.domainComparisonRecord).toMatchObject({ summary: 'domain mismatch' });
    expect(context.internalDbRecord).toMatchObject({ reportCount: 2 });
    expect(context.reputationRecord).toMatchObject({ provider: 'Google Safe Browsing' });
    expect(context.serverInfoRecord).toMatchObject({ location: 'Seoul, KR' });
  });
});
