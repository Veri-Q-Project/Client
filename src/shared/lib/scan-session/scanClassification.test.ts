import { describe, expect, it } from 'vitest';

import { isHttpUrl, isWebScanTarget, normalizeScanSchemeTypeAlias } from './scanClassification';

describe('scanClassification', () => {
  describe('normalizeScanSchemeTypeAlias', () => {
    it('returns null for missing and empty scheme values', () => {
      expect(normalizeScanSchemeTypeAlias(null)).toBeNull();
      expect(normalizeScanSchemeTypeAlias(undefined)).toBeNull();
      expect(normalizeScanSchemeTypeAlias('')).toBeNull();
      expect(normalizeScanSchemeTypeAlias('   ')).toBeNull();
    });

    it('normalizes known web scheme aliases regardless of casing and whitespace', () => {
      expect(normalizeScanSchemeTypeAlias('URL')).toBe('WEB');
      expect(normalizeScanSchemeTypeAlias(' Url ')).toBe('WEB');
      expect(normalizeScanSchemeTypeAlias(' web ')).toBe('WEB');
    });

    it('preserves unknown schemes after normalization', () => {
      expect(normalizeScanSchemeTypeAlias('sms')).toBe('SMS');
      expect(normalizeScanSchemeTypeAlias(' ftp ')).toBe('FTP');
    });
  });

  describe('isHttpUrl', () => {
    it('accepts http and https URLs across casing and surrounding whitespace', () => {
      expect(isHttpUrl('https://example.com')).toBe(true);
      expect(isHttpUrl(' HTTP://example.com/path ')).toBe(true);
      expect(isHttpUrl('HtTpS://example.com')).toBe(true);
    });

    it('rejects non-string inputs and non-http schemes', () => {
      expect(isHttpUrl(null)).toBe(false);
      expect(isHttpUrl(undefined)).toBe(false);
      expect(isHttpUrl(42)).toBe(false);
      expect(isHttpUrl('ftp://example.com')).toBe(false);
      expect(isHttpUrl('mailto:help@example.com')).toBe(false);
    });
  });

  describe('isWebScanTarget', () => {
    it('treats URL scheme aliases as web scans even when isUrl is false', () => {
      expect(
        isWebScanTarget({
          isUrl: false,
          schemeType: 'URL',
          url: 'https://example.com/path',
        }),
      ).toBe(true);
    });

    it('normalizes scheme casing and whitespace before classification', () => {
      expect(
        isWebScanTarget({
          isUrl: null,
          schemeType: ' web ',
          url: '',
        }),
      ).toBe(true);
    });

    it('falls back to the URL when the scheme is null', () => {
      expect(
        isWebScanTarget({
          isUrl: null,
          schemeType: null,
          url: 'https://example.com/fallback',
        }),
      ).toBe(true);
    });

    it('prefers an explicit true isUrl flag when scheme and URL are missing', () => {
      expect(
        isWebScanTarget({
          isUrl: true,
          schemeType: null,
          url: '',
        }),
      ).toBe(true);
    });

    it('rejects unknown schemes with empty or invalid URLs', () => {
      expect(
        isWebScanTarget({
          isUrl: null,
          schemeType: 'sms',
          url: '',
        }),
      ).toBe(false);
      expect(
        isWebScanTarget({
          isUrl: null,
          schemeType: null,
          url: 'mailto:help@example.com',
        }),
      ).toBe(false);
    });
  });
});
