import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api/errors/apiError';
import { useScanSessionStore } from '@/shared/store/scanSessionStore';

import { createResultPageFetcher } from './createResultPageFetcher';

vi.mock('@/shared/lib/scan-session/ensureScanDetail', () => {
  return {
    ensureScanDetail: vi.fn(),
    resolveRequestedUrlFromSearch: vi.fn(() => null),
  };
});

describe('createResultPageFetcher', () => {
  beforeEach(() => {
    useScanSessionStore.getState().clearSession();
    vi.clearAllMocks();
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
      siteMeta: '상세 분석 데이터를 찾지 못했습니다. 잠시 후 다시 시도하거나 다시 검사해 주세요.',
      siteName: 'https://www.daum.net/',
      siteUrl: 'https://www.daum.net/',
      trustScore: 0,
    });
  });
});
