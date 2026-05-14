import { describe, expect, it } from 'vitest';

import { isSameScanSource, resolveScanIdentifier } from './scanIdentity';

describe('scanIdentity', () => {
  it('resolves common scan identifier fields', () => {
    expect(resolveScanIdentifier({ scanId: 'scan-1' })).toBe('scan-1');
    expect(resolveScanIdentifier({ scan_id: 'scan-2' })).toBe('scan-2');
    expect(resolveScanIdentifier({ id: 'scan-3' })).toBe('scan-3');
  });

  it('matches sources only when both identifiers exist and are equal', () => {
    expect(isSameScanSource({ scanId: 'scan-1' }, { scan_id: 'scan-1' })).toBe(true);
    expect(isSameScanSource({ scanId: 'scan-1' }, { scan_id: 'scan-2' })).toBe(false);
    expect(isSameScanSource({ scanId: 'scan-1' }, {})).toBe(false);
  });
});
