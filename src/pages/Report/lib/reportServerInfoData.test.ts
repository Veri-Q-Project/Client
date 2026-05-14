import { describe, expect, it } from 'vitest';

import { buildReportServerInfo, resolveReportServerInfoRecords } from './reportServerInfoData';
import { missingReportInfoLabel } from '../constants/reportText';

describe('reportServerInfoData', () => {
  it('normalizes nested certificate fields into server info fields', () => {
    const { certificateRecord, serverInfoRecord } = resolveReportServerInfoRecords({
      certificate: {
        issuer: 'ACME CA',
        valid: true,
        validFrom: '2026-01-01',
        validTo: '2027-01-01',
      },
      location: 'Seoul, KR',
      type: 'nginx',
    });

    expect(serverInfoRecord).toMatchObject({
      certificateStatusText: '유효한 인증서',
      certificateValidityPeriod: '2026-01-01 - 2027-01-01',
      serverLocation: 'Seoul, KR',
      serverType: 'nginx',
    });
    expect(buildReportServerInfo(serverInfoRecord, certificateRecord)).toMatchObject({
      certificateIssuer: 'ACME CA',
      certificateStatusTone: 'success',
      serverLocation: 'Seoul, KR',
      serverType: 'nginx',
    });
  });

  it('marks invalid certificate status as error', () => {
    const { certificateRecord, serverInfoRecord } = resolveReportServerInfoRecords({
      certificate: {
        valid: false,
      },
    });

    expect(buildReportServerInfo(serverInfoRecord, certificateRecord)).toMatchObject({
      certificateStatusText: '유효하지 않은 인증서',
      certificateStatusTone: 'error',
    });
  });

  it('fills missing server fields with the shared missing label', () => {
    expect(buildReportServerInfo(null, null)).toMatchObject({
      certificateIssuer: missingReportInfoLabel,
      certificateStatusText: '확인 필요',
      certificateStatusTone: 'warning',
      certificateValidityPeriod: missingReportInfoLabel,
      serverLocation: missingReportInfoLabel,
      serverType: missingReportInfoLabel,
    });
  });
});
