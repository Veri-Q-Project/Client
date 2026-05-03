import { describe, expect, it } from 'vitest';

import { isHttpUrl, isWebScanTarget, normalizeScanSchemeTypeAlias } from './scanClassification';

describe('scanClassification', () => {
  it('normalizes URL scheme aliases to WEB', () => {
    expect(normalizeScanSchemeTypeAlias('URL')).toBe('WEB');
    expect(normalizeScanSchemeTypeAlias(' web ')).toBe('WEB');
  });

  it('detects http and https targets as web URLs', () => {
    expect(isHttpUrl('https://example.com')).toBe(true);
    expect(isHttpUrl('http://example.com')).toBe(true);
    expect(isHttpUrl('sms:01012345678')).toBe(false);
  });

  it('treats history items with URL scheme aliases as web scans', () => {
    expect(
      isWebScanTarget({
        isUrl: false,
        schemeType: 'URL',
        url: 'https://example.com/path',
      }),
    ).toBe(true);
  });
});
