import { describe, expect, it } from 'vitest';

import {
  getCandidateRecords,
  pickBoolean,
  pickNumber,
  pickSourceRecord,
  pickSourceString,
  pickSourceStringArray,
  pickString,
} from './payloadAccess';

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

  it('does not loop forever on self-referential response envelopes', () => {
    const source: Record<string, unknown> = {
      status: 'success',
    };
    source.data = source;

    expect(getCandidateRecords(source)).toEqual([source]);
  });

  it('trims strings and rejects whitespace-only strings', () => {
    expect(pickString({ message: '  ready  ' }, ['message'])).toBe('ready');
    expect(pickString({ message: '   ' }, ['message'])).toBeNull();
    expect(pickString({ detail: 'fallback', message: 123 }, ['message', 'detail'])).toBe(
      'fallback',
    );
  });

  it('parses only strict finite numeric values', () => {
    expect(pickNumber({ score: '12abc' }, ['score'])).toBeNull();
    expect(pickNumber({ score: '12.5' }, ['score'])).toBe(12.5);
    expect(pickNumber({ score: '-12' }, ['score'])).toBe(-12);
    expect(pickNumber({ score: ' 12 ' }, ['score'])).toBe(12);
    expect(pickNumber({ score: '1e3' }, ['score'])).toBeNull();
    expect(pickNumber({ score: '0' }, ['score'])).toBe(0);
    expect(pickNumber({ score: Number.NaN }, ['score'])).toBeNull();
    expect(pickNumber({ score: Number.POSITIVE_INFINITY }, ['score'])).toBeNull();
    expect(pickNumber({ score: '12abc', trustScore: '42' }, ['score', 'trustScore'])).toBe(42);
  });

  it('parses boolean strings and rejects unrelated values', () => {
    expect(pickBoolean({ isUrl: true }, ['isUrl'])).toBe(true);
    expect(pickBoolean({ isUrl: 'true' }, ['isUrl'])).toBe(true);
    expect(pickBoolean({ isUrl: 'false' }, ['isUrl'])).toBe(false);
    expect(pickBoolean({ isUrl: 'yes' }, ['isUrl'])).toBeNull();
    expect(pickBoolean({ isUrl: 1 }, ['isUrl'])).toBeNull();
    expect(pickBoolean({ isUrl: 'yes', is_url: ' TRUE ' }, ['isUrl', 'is_url'])).toBe(true);
  });

  it('uses the first source that contains a matching string', () => {
    expect(pickSourceString([null, { message: 'first' }, { message: 'second' }], ['message'])).toBe(
      'first',
    );
    expect(pickSourceString([null, { message: '   ' }], ['message'])).toBeNull();
  });

  it('uses the first source that contains a matching record', () => {
    const record = { finalUrl: 'https://example.com' };

    expect(pickSourceRecord([null, { redirect: record }], ['redirect'])).toBe(record);
    expect(pickSourceRecord([null, { redirect: null }], ['redirect'])).toBeNull();
  });

  it('keeps string arrays as arrays and only splits strings when a delimiter is supplied', () => {
    expect(pickSourceStringArray([{ threats: [' phishing ', ''] }], ['threats'])).toEqual([
      'phishing',
    ]);
    expect(pickSourceStringArray([{ threats: 'wallet,address' }], ['threats'])).toEqual([
      'wallet,address',
    ]);
    expect(pickSourceStringArray([{ threats: 'wallet,address' }], ['threats'], ',')).toEqual([
      'wallet',
      'address',
    ]);
  });

  it('finds threat arrays nested inside analysis response envelopes', () => {
    expect(
      pickSourceStringArray(
        [
          {
            analysisResponse: {
              threats: ['GSB:SOCIAL_ENGINEERING', 'OTX:PHISHING'],
            },
          },
        ],
        ['threats'],
      ),
    ).toEqual(['GSB:SOCIAL_ENGINEERING', 'OTX:PHISHING']);
  });
});
