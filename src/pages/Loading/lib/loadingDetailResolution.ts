import { isApiError } from '@/shared/api/errors/apiError';

export const DETAIL_RETRY_DELAY_MS = 2_000;
export const DETAIL_RETRY_MAX = 60;
export const DETAIL_RESOLUTION_ERROR_MESSAGE =
  'Analysis detail could not be loaded. Please try again.';
export const DETAIL_RESOLUTION_TIMEOUT_MESSAGE =
  'Analysis detail was not ready in time. Please retry.';

export type LoadingDetailResolutionStatus =
  | 'inactive'
  | 'resolved'
  | 'session-required'
  | 'timeout';

type ResolveLoadingDetailWithRetryParams = {
  delay?: (delayMs: number) => Promise<void>;
  ensureDetail: () => Promise<unknown>;
  isActive: () => boolean;
  onFailure: (errorMessage: string) => void;
  onResolved: () => void;
  retryDelayMs?: number;
  retryMax?: number;
};

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(), delayMs);
  });
}

export async function resolveLoadingDetailWithRetry({
  delay = wait,
  ensureDetail,
  isActive,
  onFailure,
  onResolved,
  retryDelayMs = DETAIL_RETRY_DELAY_MS,
  retryMax = DETAIL_RETRY_MAX,
}: ResolveLoadingDetailWithRetryParams): Promise<LoadingDetailResolutionStatus> {
  for (let attempt = 0; attempt < retryMax; attempt += 1) {
    if (!isActive()) {
      return 'inactive';
    }

    try {
      await ensureDetail();

      if (!isActive()) {
        return 'inactive';
      }

      onResolved();
      return 'resolved';
    } catch (error) {
      if (!isActive()) {
        return 'inactive';
      }

      if (error instanceof Error && error.message === 'SCAN_SESSION_REQUIRED') {
        return 'session-required';
      }

      if (!isApiError(error) || error.statusCode !== 404) {
        onFailure(error instanceof Error ? error.message : DETAIL_RESOLUTION_ERROR_MESSAGE);
        throw error;
      }

      await delay(retryDelayMs);
    }
  }

  onFailure(DETAIL_RESOLUTION_TIMEOUT_MESSAGE);
  return 'timeout';
}
