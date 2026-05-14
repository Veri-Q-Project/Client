import { afterEach, describe, expect, it, vi } from 'vitest';

import { openExternalLink } from './openExternalLink';

describe('openExternalLink', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens safe http and https URLs with noreferrer protections', () => {
    const open = vi.fn();

    vi.stubGlobal('window', { open });

    expect(openExternalLink('https://example.com/path')).toBe(true);
    expect(open).toHaveBeenCalledWith('https://example.com/path', '_blank', 'noopener,noreferrer');
  });

  it('blocks unsafe protocols before opening a new tab', () => {
    const open = vi.fn();
    const scriptUrl = ['java', 'script:alert(1)'].join('');

    vi.stubGlobal('window', { open });

    expect(openExternalLink(scriptUrl)).toBe(false);
    expect(open).not.toHaveBeenCalled();
  });

  it('blocks URLs with embedded credentials', () => {
    const open = vi.fn();
    const credentialUrl = ['https://user', 'pass@example.com'].join(':');

    vi.stubGlobal('window', { open });

    expect(openExternalLink(credentialUrl)).toBe(false);
    expect(open).not.toHaveBeenCalled();
  });
});
