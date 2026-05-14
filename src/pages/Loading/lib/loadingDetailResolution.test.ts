import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api/errors/apiError';

import {
  DETAIL_RESOLUTION_TIMEOUT_MESSAGE,
  resolveLoadingDetailWithRetry,
} from './loadingDetailResolution';

describe('loadingDetailResolution', () => {
  it('resolves detail immediately when the backend detail is available', async () => {
    const onResolved = vi.fn();
    const onFailure = vi.fn();

    await expect(
      resolveLoadingDetailWithRetry({
        ensureDetail: vi.fn().mockResolvedValue({}),
        isActive: () => true,
        onFailure,
        onResolved,
        retryMax: 1,
      }),
    ).resolves.toBe('resolved');

    expect(onResolved).toHaveBeenCalledTimes(1);
    expect(onFailure).not.toHaveBeenCalled();
  });

  it('retries 404 detail responses before resolving', async () => {
    const delay = vi.fn().mockResolvedValue(undefined);
    const ensureDetail = vi
      .fn()
      .mockRejectedValueOnce(
        new ApiError({
          message: 'Not found',
          statusCode: 404,
        }),
      )
      .mockResolvedValue({});

    await expect(
      resolveLoadingDetailWithRetry({
        delay,
        ensureDetail,
        isActive: () => true,
        onFailure: vi.fn(),
        onResolved: vi.fn(),
        retryDelayMs: 25,
        retryMax: 2,
      }),
    ).resolves.toBe('resolved');

    expect(delay).toHaveBeenCalledWith(25);
    expect(ensureDetail).toHaveBeenCalledTimes(2);
  });

  it('returns session-required without treating it as a failed detail lookup', async () => {
    const onFailure = vi.fn();

    await expect(
      resolveLoadingDetailWithRetry({
        ensureDetail: vi.fn().mockRejectedValue(new Error('SCAN_SESSION_REQUIRED')),
        isActive: () => true,
        onFailure,
        onResolved: vi.fn(),
        retryMax: 1,
      }),
    ).resolves.toBe('session-required');

    expect(onFailure).not.toHaveBeenCalled();
  });

  it('fails and rethrows non-404 errors', async () => {
    const onFailure = vi.fn();

    await expect(
      resolveLoadingDetailWithRetry({
        ensureDetail: vi.fn().mockRejectedValue(new Error('network failed')),
        isActive: () => true,
        onFailure,
        onResolved: vi.fn(),
        retryMax: 1,
      }),
    ).rejects.toThrow('network failed');

    expect(onFailure).toHaveBeenCalledWith('network failed');
  });

  it('times out after retryable 404 responses exceed the retry limit', async () => {
    const onFailure = vi.fn();

    await expect(
      resolveLoadingDetailWithRetry({
        delay: vi.fn().mockResolvedValue(undefined),
        ensureDetail: vi.fn().mockRejectedValue(
          new ApiError({
            message: 'Not found',
            statusCode: 404,
          }),
        ),
        isActive: () => true,
        onFailure,
        onResolved: vi.fn(),
        retryMax: 2,
      }),
    ).resolves.toBe('timeout');

    expect(onFailure).toHaveBeenCalledWith(DETAIL_RESOLUTION_TIMEOUT_MESSAGE);
  });
});
