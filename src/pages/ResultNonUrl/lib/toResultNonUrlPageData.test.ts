import { describe, expect, it } from 'vitest';

import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { toResultNonUrlPageData } from './toResultNonUrlPageData';

import type { NonUrlActionType } from '../types/resultNonUrlPage.types';

const baseSession: ScanSessionSnapshot = {
  analysisDetail: null,
  decodedUrl: null,
  finalResult: null,
  historySelection: null,
  isUrl: false,
  pendingTextScanUrl: null,
  riskLevel: null,
  scanResponse: null,
  schemeType: null,
};

describe('toResultNonUrlPageData', () => {
  it.each([
    ['WEB', 'https://example.com', 'WEB'],
    ['SHORT_URL', 'https://bit.ly/veriq', 'SHORT_URL'],
    ['OTP', 'otpauth://totp/VeriQ:user@example.com?secret=ABC123', 'OTP'],
    ['CRYPTO', 'bitcoin:1BoatSLRHtKNngkdXEeobR76b53LETtpyT', 'CRYPTO'],
    ['SMS', 'smsto:01012345678', 'SMS'],
    ['WIFI', 'WIFI:T:WPA;S:VeriQ;P:secret123;;', 'WIFI'],
    ['CONTACT', 'BEGIN:VCARD\nFN:Veri-Q\nTEL:01012345678\nEND:VCARD', 'CONTACT'],
    ['DEEP_LINK', 'kakaotalk://chat', 'DEEP_LINK'],
    ['TEL', 'tel:01012345678', 'TEL'],
    ['EMAIL', 'mailto:help@example.com', 'EMAIL'],
    ['APP_STORE', 'https://play.google.com/store/apps/details?id=com.example.veriq', 'APP_STORE'],
    ['OTHER', 'plain text payload', 'OTHER'],
  ] satisfies Array<[string, string, NonUrlActionType]>)(
    'maps %s scheme payload into page copy',
    (schemeType, targetValue, expectedActionType) => {
      const resultNonUrlPageData = toResultNonUrlPageData({
        ...baseSession,
        scanResponse: {
          schemeType,
          targetValue,
        },
        schemeType,
      });

      expect(resultNonUrlPageData.detectedActionType).toBe(expectedActionType);
      expect(resultNonUrlPageData.targetValue).toBe(targetValue);
      expect(resultNonUrlPageData.sectionTitle).toBeTruthy();
      expect(resultNonUrlPageData.sectionDescription).toBeTruthy();
    },
  );

  it('infers the action type from the target value when schemeType is missing', () => {
    const resultNonUrlPageData = toResultNonUrlPageData({
      ...baseSession,
      decodedUrl: 'mailto:help@example.com',
      scanResponse: {
        targetValue: 'mailto:help@example.com',
      },
    });

    expect(resultNonUrlPageData.detectedActionType).toBe('EMAIL');
    expect(resultNonUrlPageData.sectionTitle).toBe('탐지된 이메일 작성 정보');
  });
});
