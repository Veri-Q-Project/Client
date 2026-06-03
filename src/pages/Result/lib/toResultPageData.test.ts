import { describe, expect, it } from 'vitest';

import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { toResultPageData } from './toResultPageData';

describe('toResultPageData', () => {
  it('maps certificate metadata into result page site meta', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        originalUrl: 'https://qr.generatorqr.com/1SpwYoKyl',
        score: 23,
        serverInfo: {
          certificate: {
            issuer: null,
            valid: false,
            validFrom: null,
            validTo: null,
          },
        },
      },
      decodedUrl: null,
      finalResult: null,
      historySelection: null,
      isUrl: true,
      pendingTextScanUrl: null,
      riskLevel: null,
      scanResponse: null,
      schemeType: 'WEB',
    };

    const resultPageData = toResultPageData(session, 'safe');

    expect(resultPageData.riskLevel).toBe('safe');
    expect(resultPageData.siteMeta).toBe('SSL 인증서 유효하지 않음 · 발급자 정보 없음');
  });

  it('uses score-derived risk level even when fallback route tone is lower', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        riskLevel: 'safe',
        score: 85,
      },
      decodedUrl: 'https://testsafebrowsing.appspot.com/s/phishing.html',
      finalResult: null,
      historySelection: null,
      isUrl: true,
      pendingTextScanUrl: null,
      riskLevel: null,
      scanResponse: null,
      schemeType: 'WEB',
    };

    const resultPageData = toResultPageData(session, 'warning');

    expect(resultPageData.riskLevel).toBe('critical');
    expect(resultPageData.trustScore).toBe(85);
  });

  it('keeps scanned and destination URLs distinct for redirects', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        originalUrl: 'https://short.example/a',
        redirect: {
          finalUrl: 'https://final.example/path',
        },
        score: 45,
      },
      decodedUrl: null,
      finalResult: null,
      historySelection: null,
      isUrl: true,
      pendingTextScanUrl: null,
      riskLevel: null,
      scanResponse: null,
      schemeType: 'WEB',
    };

    const resultPageData = toResultPageData(session, 'warning');

    expect(resultPageData.siteName).toBe('https://short.example/a');
    expect(resultPageData.siteUrl).toBe('https://final.example/path');
    expect(resultPageData.visitUrl).toBe('https://final.example/path');
  });
});
