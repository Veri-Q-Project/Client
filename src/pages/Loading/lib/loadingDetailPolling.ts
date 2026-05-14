export const DETAIL_POLL_MAX_ATTEMPTS = 1;
export const DETAIL_POLL_START_DELAY_MS = 5_000;

type LoadingDetailPollingParams = {
  canPoll: () => boolean;
  clearTimer?: (timerId: number) => void;
  maxAttempts?: number;
  onTimeout: () => void;
  resolveDetail: () => Promise<boolean>;
  scheduleTimer?: (callback: () => void, delayMs: number) => number;
  startDelayMs?: number;
};

function clearTimeoutTimer(timerId: number): void {
  window.clearTimeout(timerId);
}

function scheduleTimeoutTimer(callback: () => void, delayMs: number): number {
  return window.setTimeout(callback, delayMs);
}

export function startLoadingDetailPolling({
  canPoll,
  clearTimer = clearTimeoutTimer,
  maxAttempts = DETAIL_POLL_MAX_ATTEMPTS,
  onTimeout,
  resolveDetail,
  scheduleTimer = scheduleTimeoutTimer,
  startDelayMs = DETAIL_POLL_START_DELAY_MS,
}: LoadingDetailPollingParams): () => void {
  let isDisposed = false;
  let pollAttemptCount = 0;
  let pollTimerId: number | null = null;

  const runPolling = async () => {
    if (isDisposed || !canPoll() || pollAttemptCount >= maxAttempts) {
      return;
    }

    pollAttemptCount += 1;

    let isResolved = false;

    try {
      isResolved = await resolveDetail();
    } catch {
      return;
    }

    if (isDisposed || isResolved || !canPoll()) {
      return;
    }

    if (pollAttemptCount >= maxAttempts) {
      onTimeout();
      return;
    }

    pollTimerId = scheduleTimer(() => {
      void runPolling();
    }, startDelayMs);
  };

  pollTimerId = scheduleTimer(() => {
    void runPolling();
  }, startDelayMs);

  return () => {
    isDisposed = true;

    if (pollTimerId !== null) {
      clearTimer(pollTimerId);
    }
  };
}
