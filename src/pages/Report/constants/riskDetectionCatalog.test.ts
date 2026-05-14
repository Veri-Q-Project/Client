import { describe, expect, it } from 'vitest';

import { resolveRiskDetectionContent } from './riskDetectionCatalog';

const backendThreatCodes = [
  'SHORTENED_URL',
  'percent_encoding_detected',
  'double_encoding_suspected',
  'suspicious_query_param_detected',
  'embedded_url',
  'suspicious_query_keyword_detected',
  'suspicious_path_keyword_detected',
  'suspicious_fragment_keyword_detected',
  'MALWARE',
  'SOCIAL_ENGINEERING',
  'UNWANTED_SOFTWARE',
  'POTENTIALLY_HARMFUL_APPLICATION',
  'PHISHING',
  'RANSOMWARE',
  'BOTNET',
  'SPAM',
  'C2',
  'SUSPICIOUS',
  'hostname_missing',
  'certificate_request_timeout',
  'invalid certificate response',
  'peer certificate not available',
] as const;

describe('resolveRiskDetectionContent', () => {
  it('maps every backend threat code to a dedicated catalog entry', () => {
    backendThreatCodes.forEach((threatCode) => {
      const content = resolveRiskDetectionContent(threatCode, 'safe');

      expect(content.englishLabel).not.toBe('UNMAPPED LOW RISK SIGNAL');
      expect(content.description).not.toContain('정책 테이블에 상세 설명이 등록되지 않았습니다.');
      expect(content.title).not.toBe(`${threatCode} 감지`);
    });
  });

  it('maps DNS hostname errors to the hostname failure description', () => {
    const content = resolveRiskDetectionContent('[Errno -2] Name or service not known', 'safe');

    expect(content.englishLabel).toBe('HOSTNAME MISSING');
    expect(content.title).toBe('호스트명 확인 실패 감지');
  });

  it('ignores array-like punctuation around backend threat codes', () => {
    const content = resolveRiskDetectionContent("'PHISHING']", 'safe');

    expect(content.englishLabel).toBe('PHISHING');
    expect(content.title).toBe('피싱 위협 감지');
  });
});
