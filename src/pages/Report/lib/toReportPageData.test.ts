import { describe, expect, it } from 'vitest';

import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { toReportPageData } from './toReportPageData';

describe('toReportPageData', () => {
  it('maps detail payload into report page data', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        destinationUrl: 'https://danger.example',
        detectedRiskTypes: ['phishing'],
        domainComparison: {
          officialUrl: 'https://official.example',
          riskBadgeText: 'high risk',
          summary: 'similar to official domain',
          suspiciousUrl: 'https://danger.example',
        },
        originalUrl: 'https://qr.example/source',
        reputation: {
          detailDescription: 'unsafe history was found',
          providerName: 'Google Safe Browsing',
          providerStatusText: 'checked',
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
          certificateStatusText: 'expired',
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

  it('keeps scanned and destination URLs distinct for redirect reports', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        originalUrl: 'https://short.example/a',
        redirect: {
          finalUrl: 'https://final.example/path',
        },
        riskLevel: 'warning',
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

    expect(reportPageData.scannedUrl).toBe('https://short.example/a');
    expect(reportPageData.urlAnalysis.originalUrl).toBe('https://short.example/a');
    expect(reportPageData.urlAnalysis.destinationUrl).toBe('https://final.example/path');
  });

  it('prefers session decoded URL over final URL when scanned URL fields are absent', () => {
    const session: ScanSessionSnapshot = {
      analysisDetail: {
        finalUrl: 'https://final.example/path',
        riskLevel: 'safe',
      },
      decodedUrl: 'https://short.example/a',
      finalResult: null,
      historySelection: null,
      isUrl: true,
      riskLevel: null,
      scanResponse: null,
      schemeType: 'WEB',
    };

    const reportPageData = toReportPageData(session);

    expect(reportPageData.scannedUrl).toBe('https://short.example/a');
    expect(reportPageData.urlAnalysis.destinationUrl).toBe('https://final.example/path');
  });
});
