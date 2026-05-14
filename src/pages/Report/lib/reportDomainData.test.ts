import { describe, expect, it } from 'vitest';

import type { ResolvedScanUrls } from '@/shared/lib/scan-session/scanUrlResolution';

import { buildReportDomainComparison } from './reportDomainData';

const urls: ResolvedScanUrls = {
  destinationUrl: 'https://final.example/path',
  originalUrl: 'https://short.example/a',
  previewUrl: 'https://final.example/path',
  scannedAt: null,
  scannedUrl: 'https://short.example/a',
};

describe('reportDomainData', () => {
  it('uses backend domain comparison fields when present', () => {
    expect(
      buildReportDomainComparison(
        {
          officialUrl: 'https://official.example',
          riskBadgeText: 'high risk',
          summary: 'similar to official domain',
          suspiciousUrl: 'https://danger.example',
        },
        'critical',
        urls,
      ),
    ).toEqual({
      officialUrl: 'https://official.example',
      riskBadgeText: 'high risk',
      summary: 'similar to official domain',
      suspiciousUrl: 'https://danger.example',
    });
  });

  it('falls back to resolved URLs and redirect summary', () => {
    expect(buildReportDomainComparison(null, 'warning', urls)).toMatchObject({
      officialUrl: 'https://final.example/path',
      summary: '스캔된 QR URL이 최종 목적지와 다른 주소로 리다이렉트되었습니다.',
      suspiciousUrl: 'https://short.example/a',
    });
  });
});
