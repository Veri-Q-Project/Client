import { describe, expect, it } from 'vitest';

import { shouldResolveDetailAfterTerminalProgress } from './loadingProgressResolution';

describe('loadingProgressResolution', () => {
  it('detects completed terminal progress payloads', () => {
    expect(
      shouldResolveDetailAfterTerminalProgress({
        current_step_id: 'risk_score',
        status: 'completed',
      }),
    ).toBe(true);

    expect(
      shouldResolveDetailAfterTerminalProgress({
        state: 'completed',
        step: 'report',
      }),
    ).toBe(true);
  });

  it('ignores unfinished or non-terminal progress payloads', () => {
    expect(
      shouldResolveDetailAfterTerminalProgress({
        status: 'running',
        step: 'report',
      }),
    ).toBe(false);

    expect(
      shouldResolveDetailAfterTerminalProgress({
        status: 'completed',
        step: 'decode',
      }),
    ).toBe(false);
  });
});
