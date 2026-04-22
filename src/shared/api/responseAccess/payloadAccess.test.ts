import { describe, expect, it } from 'vitest';

import { pickNumber, pickString } from './payloadAccess';

describe('payloadAccess', () => {
  it('finds records nested behind multiple response envelopes', () => {
    expect(
      pickString(
        {
          data: {
            result: {
              serverInfo: {
                status: 'success',
              },
            },
          },
        },
        ['status'],
      ),
    ).toBe('success');
  });

  it('rejects malformed numeric strings', () => {
    expect(pickNumber({ score: '12abc' }, ['score'])).toBeNull();
    expect(pickNumber({ score: '12.5' }, ['score'])).toBe(12.5);
  });
});
