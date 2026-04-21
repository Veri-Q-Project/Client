import { describe, expect, it } from 'vitest';

import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { toReportPageData } from './toReportPageData';
import { toResultCardData } from './toResultCardData';
import { toResultNonUrlData } from './toResultNonUrlData';

describe('session mappers', () => {
  it('maps detail payload into report page data', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        destinationUrl: 'https://danger.example',
        detectedRiskTypes: ['도메인 사칭'],
        domainComparison: {
          officialUrl: 'https://official.example',
          riskBadgeText: '위험 등급: 높음',
          summary: '공식 도메인과 유사합니다.',
          suspiciousUrl: 'https://danger.example',
        },
        originalUrl: 'https://qr.example/source',
        reputation: {
          detailDescription: '위협 기록이 탐지되었습니다.',
          providerName: 'Google Safe Browsing',
          providerStatusText: '검사 완료',
          summary: {
            malwareCount: 1,
            phishingCount: 2,
            spamCount: 0,
          },
        },
        riskLevel: 'HIGH',
        scannedAt: '2026-04-20T12:34:00Z',
        serverInfo: {
          certificateIssuer: 'ACME CA',
          certificateStatusText: '만료됨',
          certificateValidityPeriod: '2025-01-01 - 2026-01-01',
          serverLocation: 'Seoul, KR',
          serverType: 'nginx',
        },
        trustScore: 83,
      },
      decodedUrl: null,
      finalResult: null,
      historySelection: null,
      isUrl: true,
      riskLevel: null,
      scanResponse: null,
      schemeType: 'WEB',
    };

    const reportPageData = toReportPageData(session);

    expect(reportPageData.riskLevel).toBe('critical');
    expect(reportPageData.trustScore).toBe(83);
    expect(reportPageData.urlAnalysis.destinationUrl).toBe('https://danger.example');
    expect(reportPageData.reputation.summary.phishingCount).toBe(2);
    expect(reportPageData.serverInfo.certificateStatusTone).toBe('error');
  });

  it('maps current backend analysis payloads by score and final destination URL', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        analysisTime: '2026-04-18T11:00:30.000000',
        externalApi: {
          checked: true,
          provider: 'Google Safe Browsing',
          result: 'False',
        },
        internalDb: {
          blockCount: 0,
          exists: false,
          reportCount: 0,
        },
        ml: {
          score: 61,
          threats: ['dummy_ml_threat'],
        },
        originalUrl: 'https://malware.testing.google/',
        redirect: {
          finalUrl: 'https://malware.testing.google/',
          redirectCount: 0,
        },
        riskLevel: 'safe',
        score: 61,
        serverInfo: {
          certificate: {
            issuer: null,
            valid: false,
            validFrom: null,
            validTo: null,
          },
          location: null,
          type: null,
        },
      },
      decodedUrl: null,
      finalResult: null,
      historySelection: null,
      isUrl: true,
      riskLevel: null,
      scanResponse: null,
      schemeType: 'WEB',
    };

    const reportPageData = toReportPageData(session);

    expect(reportPageData.riskLevel).toBe('critical');
    expect(reportPageData.trustScore).toBe(61);
    expect(reportPageData.scannedAt).toBe('2026-04-18 11:00');
    expect(reportPageData.scannedUrl).toBe('https://malware.testing.google/');
    expect(reportPageData.urlAnalysis.destinationUrl).toBe('https://malware.testing.google/');
    expect(reportPageData.detectedRiskTypes).toContain('dummy_ml_threat');
    expect(reportPageData.reputation.providerName).toBe('Google Safe Browsing');
    expect(reportPageData.serverInfo.certificateStatusTone).toBe('error');
  });

  it('maps certificate metadata into result card site meta', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        originalUrl: 'https://qr.generatorqr.com/1SpwYoKyl',
        score: 23,
        serverInfo: {
          certificate: {
            issuer: null,
            valid: false,
            validFrom: null,
            validTo: null,
          },
        },
      },
      decodedUrl: null,
      finalResult: null,
      historySelection: null,
      isUrl: true,
      riskLevel: null,
      scanResponse: null,
      schemeType: 'WEB',
    };

    const resultCardData = toResultCardData(session, 'safe');

    expect(resultCardData.siteMeta).toBe('SSL 인증서 유효하지 않음 · 발급자 정보 없음');
  });

  it('maps non-web scan payload into non-url result data', () => {
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

    const resultNonUrlData = toResultNonUrlData(session);

    expect(resultNonUrlData.detectedActionType).toBe('telSms');
    expect(resultNonUrlData.targetValue).toBe('010-1234-5678');
  });
});
