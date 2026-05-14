import { describe, expect, it, vi } from 'vitest';

import { startLoadingDetailPolling } from './loadingDetailPolling';

function createManualTimer() {
  const callbacks: Array<() => void> = [];

  return {
    callbacks,
    clearTimer: vi.fn(),
    scheduleTimer: vi.fn((callback: () => void) => {
      callbacks.push(callback);
      return callbacks.length;
    }),
  };
}

describe('loadingDetailPolling', () => {
  it('schedules detail resolution after the configured delay', async () => {
    const timer = createManualTimer();
    const resolveDetail = vi.fn().mockResolvedValue(true);

    startLoadingDetailPolling({
      canPoll: () => true,
      clearTimer: timer.clearTimer,
      onTimeout: vi.fn(),
      resolveDetail,
      scheduleTimer: timer.scheduleTimer,
      startDelayMs: 25,
    });

    expect(timer.scheduleTimer).toHaveBeenCalledWith(expect.any(Function), 25);

    timer.callbacks[0]?.();
    await Promise.resolve();

    expect(resolveDetail).toHaveBeenCalledTimes(1);
  });

  it('reports timeout when polling exhausts the attempt limit without resolving', async () => {
    const timer = createManualTimer();
    const onTimeout = vi.fn();

    startLoadingDetailPolling({
      canPoll: () => true,
      clearTimer: timer.clearTimer,
      maxAttempts: 1,
      onTimeout,
      resolveDetail: vi.fn().mockResolvedValue(false),
      scheduleTimer: timer.scheduleTimer,
    });

    timer.callbacks[0]?.();
    await Promise.resolve();

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('stops polling when disposed before the timer runs', async () => {
    const timer = createManualTimer();
    const resolveDetail = vi.fn().mockResolvedValue(true);
    const dispose = startLoadingDetailPolling({
      canPoll: () => true,
      clearTimer: timer.clearTimer,
      onTimeout: vi.fn(),
      resolveDetail,
      scheduleTimer: timer.scheduleTimer,
    });

    dispose();
    timer.callbacks[0]?.();
    await Promise.resolve();

    expect(timer.clearTimer).toHaveBeenCalledWith(1);
    expect(resolveDetail).not.toHaveBeenCalled();
  });

  it('does not poll while the caller marks polling as unavailable', async () => {
    const timer = createManualTimer();
    const resolveDetail = vi.fn().mockResolvedValue(true);

    startLoadingDetailPolling({
      canPoll: () => false,
      clearTimer: timer.clearTimer,
      onTimeout: vi.fn(),
      resolveDetail,
      scheduleTimer: timer.scheduleTimer,
    });

    timer.callbacks[0]?.();
    await Promise.resolve();

    expect(resolveDetail).not.toHaveBeenCalled();
  });
});
