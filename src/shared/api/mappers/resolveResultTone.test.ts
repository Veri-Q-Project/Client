import { describe, expect, it } from 'vitest';

import { resolveResultTone, resolveResultToneFromSources } from './resolveResultTone';

describe('resolveResultTone', () => {
  it('uses score before riskLevel when both are present', () => {
    expect(resolveResultTone('critical', 23)).toBe('safe');
    expect(resolveResultTone('safe', 86)).toBe('critical');
  });

  it('maps score ranges into result tones', () => {
    expect(resolveResultTone(null, 29)).toBe('safe');
    expect(resolveResultTone(null, 30)).toBe('warning');
    expect(resolveResultTone(null, 59)).toBe('warning');
    expect(resolveResultTone(null, 60)).toBe('critical');
  });

  it('falls back to riskLevel when score is missing', () => {
    expect(resolveResultTone('HIGH', null)).toBe('critical');
  });

  it('reads nested score values from backend detail payloads', () => {
    expect(
      resolveResultToneFromSources([
        {
          ml: {
            score: 61,
          },
          riskLevel: 'safe',
        },
      ]),
    ).toBe('critical');
  });
});
