import { describe, expect, it } from 'vitest';

import { normalizeUrlInput } from './useQRScanPage';

describe('normalizeUrlInput', () => {
  it('prepends https to host-like inputs without a scheme', () => {
    expect(normalizeUrlInput('example.com/path')).toBe('https://example.com/path');
  });

  it('keeps http and https URLs', () => {
    expect(normalizeUrlInput('http://example.com')).toBe('http://example.com/');
    expect(normalizeUrlInput('https://example.com')).toBe('https://example.com/');
  });

  it('rejects non-http schemes instead of rewriting them', () => {
    expect(normalizeUrlInput('ftp://example.com/file')).toBeNull();
  });
});
