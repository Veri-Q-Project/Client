import { describe, expect, it } from 'vitest';

import { buildReportReputation } from './reportReputationData';
import { missingReportInfoLabel } from '../constants/reportText';

describe('reportReputationData', () => {
  it('prefers reputation summary metrics for report count and domain age', () => {
    expect(
      buildReportReputation(
        {
          provider: 'AlienVault OTX',
          result: 'SAFE',
          summary: {
            domainAge: '4055',
            reportCount: 3,
          },
        },
        {
          reportCount: 1,
        },
        [],
      ),
    ).toMatchObject({
      providerName: 'AlienVault OTX',
      providerStatusText: '검사 결과: SAFE',
      summary: {
        domainAgeText: '4,055일',
        reportCount: 3,
      },
    });
  });

  it('falls back to internal DB metrics and handles missing domain age', () => {
    expect(
      buildReportReputation(
        null,
        {
          report_count: 2,
        },
        [],
      ).summary,
    ).toEqual({
      domainAgeText: missingReportInfoLabel,
      reportCount: 2,
    });
  });
});
