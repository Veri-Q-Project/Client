import { describe, expect, it } from 'vitest';

import {
  buildScanResultHref,
  nonUrlResultRoute,
  resolveScanResultRoute,
  resolveScanResultRouteByRiskLevel,
} from './scanResultRoute';

describe('scanResultRoute', () => {
  it('builds encoded web result hrefs', () => {
    expect(buildScanResultHref('/result/critical', 'https://example.com/a b?x=1')).toBe(
      '/result/critical?url=https%3A%2F%2Fexample.com%2Fa%20b%3Fx%3D1',
    );
  });

  it('keeps non-url result routes free from URL query strings', () => {
    expect(buildScanResultHref(nonUrlResultRoute, 'tel:01012345678')).toBe(nonUrlResultRoute);
  });

  it('resolves non-web scans to the non-url result route', () => {
    expect(
      resolveScanResultRoute({
        decodedUrl: '01012345678',
        isUrl: false,
        riskLevel: 'critical',
        schemeType: 'SMS',
      }),
    ).toMatchObject({
      href: nonUrlResultRoute,
      route: nonUrlResultRoute,
      url: '01012345678',
    });
  });

  it('uses scan score before fallback risk level for web routes', () => {
    expect(
      resolveScanResultRoute({
        decodedUrl: 'https://example.com',
        finalResult: {
          score: 85,
        },
        isUrl: true,
        riskLevel: 'safe',
        schemeType: 'WEB',
      }),
    ).toMatchObject({
      href: '/result/critical?url=https%3A%2F%2Fexample.com',
      route: '/result/critical',
    });
  });

  it('maps risk levels to web result routes', () => {
    expect(resolveScanResultRouteByRiskLevel('safe')).toBe('/result/safe');
    expect(resolveScanResultRouteByRiskLevel('warning')).toBe('/result/warning');
    expect(resolveScanResultRouteByRiskLevel('critical')).toBe('/result/critical');
  });
});
