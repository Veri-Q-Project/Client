import { describe, expect, it } from 'vitest';

import { resolveScanUrls } from './scanUrlResolution';

describe('resolveScanUrls', () => {
  it('keeps scanned and destination URLs distinct for redirects', () => {
    expect(
      resolveScanUrls({
        sources: [
          {
            originalUrl: 'https://short.example/a',
            redirect: {
              finalUrl: 'https://final.example/path',
            },
          },
        ],
      }),
    ).toMatchObject({
      destinationUrl: 'https://final.example/path',
      originalUrl: 'https://short.example/a',
      previewUrl: 'https://final.example/path',
      scannedUrl: 'https://short.example/a',
    });
  });

  it('uses session decoded URL when scanned URL fields are absent', () => {
    expect(
      resolveScanUrls({
        decodedUrl: 'https://short.example/a',
        sources: [
          {
            finalUrl: 'https://final.example/path',
          },
        ],
      }),
    ).toMatchObject({
      destinationUrl: 'https://final.example/path',
      scannedUrl: 'https://short.example/a',
    });
  });

  it('falls back to history URL and scanned timestamp', () => {
    expect(
      resolveScanUrls({
        historyScannedAt: '2026.05.14',
        historyUrl: 'https://history.example/path',
        sources: [],
      }),
    ).toMatchObject({
      destinationUrl: 'https://history.example/path',
      scannedAt: '2026.05.14',
      scannedUrl: 'https://history.example/path',
    });
  });
});
