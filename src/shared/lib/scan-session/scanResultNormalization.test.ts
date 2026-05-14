import { describe, expect, it } from 'vitest';

import {
  normalizeScanResult,
  resolveScanDecodedUrl,
  resolveScanIsUrl,
  resolveScanRiskLevel,
  resolveScanSchemeType,
} from './scanResultNormalization';

describe('scanResultNormalization', () => {
  it('prefers final URL fields when decoding backend analysis detail', () => {
    expect(
      resolveScanDecodedUrl({
        originalUrl: 'https://short.example/a',
        redirect: {
          finalUrl: 'https://final.example/path',
        },
      }),
    ).toBe('https://final.example/path');
  });

  it('normalizes URL scheme aliases as web scans', () => {
    const decodedUrl = 'https://example.com/history';
    const schemeType = resolveScanSchemeType(
      {
        schemeType: 'URL',
      },
      decodedUrl,
    );

    expect(schemeType).toBe('WEB');
    expect(resolveScanIsUrl({ isUrl: false }, decodedUrl, schemeType)).toBe(true);
  });

  it('infers non-web scans from non-http target values', () => {
    expect(
      normalizeScanResult({
        scheme_type: 'SMS',
        targetValue: '01012345678',
      }),
    ).toMatchObject({
      decodedUrl: '01012345678',
      isUrl: false,
      schemeType: 'SMS',
    });
  });

  it('uses score before riskLevel when resolving risk', () => {
    expect(
      resolveScanRiskLevel({
        riskLevel: 'safe',
        score: 83,
      }),
    ).toBe('critical');
  });
});
