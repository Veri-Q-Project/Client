import { describe, expect, it } from 'vitest';

import {
  buildHistoryItemId,
  pickHistoryIsUrl,
  pickHistoryRiskLevel,
  pickHistoryScannedAt,
  pickHistorySchemeType,
  pickHistoryTargetValue,
  resolveHistoryTimestamp,
} from './historyItemAccess';

describe('historyItemAccess', () => {
  it('reads current scan history payload fields from the backend', () => {
    const historyItem = {
      riskLevel: 'safe',
      scannedAt: '2026-04-21 02:50:44',
      is_url: false,
      schemeType: 'URL',
      typeInfo: 'https://r-generator.com/1Ugy3mkc',
    };

    expect(pickHistoryTargetValue(historyItem)).toBe('https://r-generator.com/1Ugy3mkc');
    expect(pickHistoryScannedAt(historyItem)).toBe('2026-04-21 02:50:44');
    expect(pickHistoryRiskLevel(historyItem)).toBe('safe');
    expect(pickHistorySchemeType(historyItem)).toBe('URL');
    expect(pickHistoryIsUrl(historyItem)).toBe(false);
    expect(buildHistoryItemId(historyItem, 0)).toBe(
      'URL|https://r-generator.com/1Ugy3mkc|2026-04-21 02:50:44|0',
    );
  });

  it('sorts backend timestamp labels by recency', () => {
    expect(resolveHistoryTimestamp('2026-04-21 02:57:53')).toBeGreaterThan(
      resolveHistoryTimestamp('2026-04-21 02:50:44'),
    );
  });

  it('normalizes dotted timestamp labels before parsing', () => {
    expect(resolveHistoryTimestamp('2026.04.21 02:50:44')).toBe(
      resolveHistoryTimestamp('2026-04-21T02:50:44'),
    );
  });
});
