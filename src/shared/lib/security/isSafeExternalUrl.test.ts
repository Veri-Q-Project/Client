import { describe, expect, it } from 'vitest';

import { isSafeExternalUrl } from './isSafeExternalUrl';

describe('isSafeExternalUrl', () => {
  it('allows http and https URLs', () => {
    expect(isSafeExternalUrl('https://example.com')).toBe(true);
    expect(isSafeExternalUrl('http://example.com/path?q=1')).toBe(true);
  });

  it('rejects dangerous protocols', () => {
    const scriptUrl = ['java', 'script:alert(1)'].join('');

    expect(isSafeExternalUrl(scriptUrl)).toBe(false);
    expect(isSafeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeExternalUrl('file:///etc/passwd')).toBe(false);
  });

  it('rejects URLs with embedded credentials', () => {
    const credentialUrl = ['https://user', 'pass@example.com'].join(':');

    expect(isSafeExternalUrl(credentialUrl)).toBe(false);
  });

  it('rejects invalid and empty values', () => {
    expect(isSafeExternalUrl('')).toBe(false);
    expect(isSafeExternalUrl('not-a-url')).toBe(false);
    expect(isSafeExternalUrl('   ')).toBe(false);
  });
});
