import { describe, expect, it } from 'vitest';

import { normalizeRiskLevel } from './normalizeRiskLevel';

describe('normalizeRiskLevel', () => {
  it('maps common backend labels to ui tones', () => {
    expect(normalizeRiskLevel('SAFE')).toBe('safe');
    expect(normalizeRiskLevel('medium')).toBe('warning');
    expect(normalizeRiskLevel('HIGH')).toBe('critical');
    expect(normalizeRiskLevel('danger')).toBe('critical');
  });

  it('returns null for empty or unknown values', () => {
    expect(normalizeRiskLevel('')).toBeNull();
    expect(normalizeRiskLevel('unmapped')).toBeNull();
    expect(normalizeRiskLevel(null)).toBeNull();
  });
});
