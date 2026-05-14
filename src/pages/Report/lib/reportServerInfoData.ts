import {
  pickBoolean,
  pickSourceRecord,
  pickSourceString,
} from '@/shared/api/responseAccess/payloadAccess';

import { missingReportInfoLabel } from '../constants/reportText';

import type { ReportPageData } from '../types/reportPage.types';

type ReportServerInfoRecords = {
  certificateRecord: Record<string, unknown> | null;
  serverInfoRecord: Record<string, unknown> | null;
};

function formatCertificateStatus(certificateRecord: Record<string, unknown> | null): string | null {
  const isValid = pickBoolean(certificateRecord, ['valid', 'isValid', 'is_valid']);

  if (isValid === null) {
    return null;
  }

  return isValid ? '유효한 인증서' : '유효하지 않은 인증서';
}

function formatCertificateValidityPeriod(
  certificateRecord: Record<string, unknown> | null,
): string | null {
  const validFrom = pickSourceString([certificateRecord], ['validFrom', 'valid_from']);
  const validTo = pickSourceString([certificateRecord], ['validTo', 'valid_to']);

  if (!validFrom && !validTo) {
    return null;
  }

  return `${validFrom ?? '정보 없음'} - ${validTo ?? '정보 없음'}`;
}

function resolveCertificateTone(
  rawStatusText: string | null,
): ReportPageData['serverInfo']['certificateStatusTone'] {
  if (!rawStatusText) {
    return 'warning';
  }

  const normalizedStatusText = rawStatusText.trim().toLowerCase();
  const errorSignals = ['expired', 'invalid', 'revoked', '만료', '위조', '유효하지 않'];
  const successSignals = ['valid', 'active', '유효', '정상'];

  if (errorSignals.some((signal) => normalizedStatusText.includes(signal))) {
    return 'error';
  }

  if (successSignals.some((signal) => normalizedStatusText.includes(signal))) {
    return 'success';
  }

  return 'warning';
}

export function resolveReportServerInfoRecords(
  rawServerInfoRecord: Record<string, unknown> | null,
): ReportServerInfoRecords {
  if (!rawServerInfoRecord) {
    return {
      certificateRecord: null,
      serverInfoRecord: null,
    };
  }

  const certificateRecord = pickSourceRecord([rawServerInfoRecord], ['certificate']);

  return {
    certificateRecord,
    serverInfoRecord: {
      ...rawServerInfoRecord,
      certificateStatusText:
        pickSourceString(
          [rawServerInfoRecord],
          ['certificateStatusText', 'certificate_status_text'],
        ) ?? formatCertificateStatus(certificateRecord),
      certificateValidityPeriod:
        pickSourceString(
          [rawServerInfoRecord],
          ['certificateValidityPeriod', 'certificate_validity_period'],
        ) ?? formatCertificateValidityPeriod(certificateRecord),
      serverLocation: pickSourceString(
        [rawServerInfoRecord],
        ['serverLocation', 'server_location', 'location'],
      ),
      serverType: pickSourceString([rawServerInfoRecord], ['serverType', 'server_type', 'type']),
    },
  };
}

export function buildReportServerInfo(
  serverInfoRecord: Record<string, unknown> | null,
  certificateRecord: Record<string, unknown> | null,
): ReportPageData['serverInfo'] {
  const certificateStatusText =
    pickSourceString([serverInfoRecord], ['certificateStatusText', 'certificate_status_text']) ??
    formatCertificateStatus(certificateRecord) ??
    '확인 필요';

  return {
    certificateIssuer:
      pickSourceString([serverInfoRecord], ['certificateIssuer', 'certificate_issuer']) ??
      pickSourceString([certificateRecord], ['issuer']) ??
      missingReportInfoLabel,
    certificateStatusText,
    certificateStatusTone: resolveCertificateTone(certificateStatusText),
    certificateValidityPeriod:
      pickSourceString(
        [serverInfoRecord],
        ['certificateValidityPeriod', 'certificate_validity_period'],
      ) ?? missingReportInfoLabel,
    serverLocation:
      pickSourceString([serverInfoRecord], ['serverLocation', 'server_location']) ??
      missingReportInfoLabel,
    serverType:
      pickSourceString([serverInfoRecord], ['serverType', 'server_type']) ?? missingReportInfoLabel,
  };
}
