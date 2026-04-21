import { describe, expect, it } from 'vitest';

import {
  buildHistoryItemId,
  pickHistoryRiskLevel,
  pickHistoryScannedAt,
  pickHistoryTargetValue,
  resolveHistoryTimestamp,
} from './historyItemAccess';

describe('historyItemAccess', () => {
  it('reads current scan history payload fields from the backend', () => {
    const historyItem = {
      riskLevel: 'safe',
      scannedAt: '2026-04-21 02:50:44',
      schemeType: 'URL',
      typeInfo: 'https://r-generator.com/1Ugy3mkc',
    };

    expect(pickHistoryTargetValue(historyItem)).toBe('https://r-generator.com/1Ugy3mkc');
    expect(pickHistoryScannedAt(historyItem)).toBe('2026-04-21 02:50:44');
    expect(pickHistoryRiskLevel(historyItem)).toBe('safe');
    expect(buildHistoryItemId(historyItem, 0)).toBe(
      'URL|https://r-generator.com/1Ugy3mkc|2026-04-21 02:50:44',
    );
  });

  it('sorts backend timestamp labels by recency', () => {
    expect(resolveHistoryTimestamp('2026-04-21 02:57:53')).toBeGreaterThan(
      resolveHistoryTimestamp('2026-04-21 02:50:44'),
    );
  });
});
