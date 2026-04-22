import { describe, expect, it } from 'vitest';

import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { toResultNonUrlPageData } from './toResultNonUrlPageData';

describe('toResultNonUrlPageData', () => {
  it('maps non-web scan payload into non-url result page data', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: null,
      decodedUrl: null,
      finalResult: null,
      historySelection: null,
      isUrl: false,
      riskLevel: null,
      scanResponse: {
        schemeType: 'TEL',
        targetValue: '010-1234-5678',
      },
      schemeType: 'TEL',
    };

    const resultNonUrlPageData = toResultNonUrlPageData(session);

    expect(resultNonUrlPageData.detectedActionType).toBe('telSms');
    expect(resultNonUrlPageData.targetValue).toBe('010-1234-5678');
  });
});
