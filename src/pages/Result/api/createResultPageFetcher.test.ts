import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api/errors/apiError';
import { useScanSessionStore } from '@/shared/store/scanSessionStore';

import { createResultPageFetcher, DETAIL_UNAVAILABLE_MESSAGE } from './createResultPageFetcher';

vi.mock('@/shared/lib/scan-session/ensureScanDetail', () => {
  return {
    ensureScanDetail: vi.fn(),
    resolveRequestedUrlFromSearch: vi.fn(() => null),
  };
});

describe('createResultPageFetcher', () => {
  beforeEach(() => {
    useScanSessionStore.getState().clearSession();
    vi.resetAllMocks();
  });

  it('falls back to session result data when scan detail is not found yet', async () => {
    const { ensureScanDetail } = await import('@/shared/lib/scan-session/ensureScanDetail');
    vi.mocked(ensureScanDetail).mockRejectedValue(
      new ApiError({
        message: 'Request failed with status code 404',
        statusCode: 404,
      }),
    );

    useScanSessionStore.getState().setFinalResult({
      finalUrl: 'http://naver-login-check.xyz',
      originalUrl: 'http://naver-login-check.xyz',
      riskLevel: 'safe',
      score: 23,
    });

    const { fetchResultPageData } = createResultPageFetcher('safe');

    await expect(fetchResultPageData()).resolves.toMatchObject({
      riskLevel: 'safe',
      siteName: 'http://naver-login-check.xyz',
      siteUrl: 'http://naver-login-check.xyz',
      trustScore: 23,
    });
  });

  it('returns detail-unavailable data when scan detail is missing and only URL query is available', async () => {
    const { ensureScanDetail, resolveRequestedUrlFromSearch } =
      await import('@/shared/lib/scan-session/ensureScanDetail');
    vi.mocked(ensureScanDetail).mockRejectedValue(
      new ApiError({
        message: 'Request failed with status code 404',
        statusCode: 404,
      }),
    );
    vi.mocked(resolveRequestedUrlFromSearch).mockReturnValue('https://www.daum.net/');

    const { fetchResultPageData } = createResultPageFetcher('safe');

    await expect(fetchResultPageData()).resolves.toMatchObject({
      detailUnavailable: true,
      riskLevel: 'warning',
      siteMeta: DETAIL_UNAVAILABLE_MESSAGE,
      siteName: 'https://www.daum.net/',
      siteUrl: 'https://www.daum.net/',
      trustScore: 0,
    });
  });

  it('propagates non-404 API errors from scan detail request', async () => {
    const { ensureScanDetail } = await import('@/shared/lib/scan-session/ensureScanDetail');
    vi.mocked(ensureScanDetail).mockRejectedValue(
      new ApiError({
        message: 'Request failed with status code 500',
        statusCode: 500,
      }),
    );

    useScanSessionStore.getState().setHistorySelection({
      isUrl: true,
      riskLevel: 'safe',
      scannedAt: null,
      schemeType: 'WEB',
      url: 'https://www.daum.net/',
    });

    const { fetchResultPageData } = createResultPageFetcher('safe');

    await expect(fetchResultPageData()).rejects.toThrow('Request failed with status code 500');
  });

  it('throws SCAN_SESSION_REQUIRED when there is no session data and no recoverable URL', async () => {
    const { ensureScanDetail, resolveRequestedUrlFromSearch } =
      await import('@/shared/lib/scan-session/ensureScanDetail');
    vi.mocked(resolveRequestedUrlFromSearch).mockReturnValue(null);

    const { fetchResultPageData } = createResultPageFetcher('safe');

    await expect(fetchResultPageData()).rejects.toThrow('SCAN_SESSION_REQUIRED');
    expect(ensureScanDetail).not.toHaveBeenCalled();
  });
});
