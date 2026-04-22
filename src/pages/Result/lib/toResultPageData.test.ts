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
      riskLevel: null,
      scanResponse: null,
      schemeType: 'WEB',
    };

    const resultPageData = toResultPageData(session, 'safe');

    expect(resultPageData.siteMeta).toBe('SSL 인증서 유효하지 않음 · 발급자 정보 없음');
  });
});
