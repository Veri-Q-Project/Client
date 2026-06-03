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
  'CERT_SELF_SIGNED',
  'CERT_UNTRUSTED',
  'CERT_EXPIRED',
  'CERT_HOSTNAME_MISMATCH',
  'CERT_NOT_YET_VALID',
  'CERT_REVOKED',
  'CERT_SSL_ERROR',
  'CERT_INVALID_HOST',
  'CERT_CONNECTION_FAILED',
  'CERT_LOOKUP_FAILED',
  'CERT_TIMEOUT',
  'CERT_NO_CERTIFICATE',
  'CERT_UNKNOWN_ERROR',
  'GSB_FAILED',
  'OTX_FAILED',
  'WHOIS_FAILED',
  'REDIRECT_FAILED',
  'REDIRECT_REQUEST_FAILED',
  'REDIRECT_CLIENT_ERROR',
  'REDIRECT_LOOP_DETECTED',
  'REDIRECT_TOO_MANY_REDIRECTS',
  'REDIRECT_INVALID_LOCATION',
  'SERVER_INFO_FAILED',
  'CERTIFICATE_FAILED',
  'CHARCNN_FAILED',
  'XGB_FAILED',
  'ML_FAILED',
  'SCORING_FAILED',
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

  it('maps provider-prefixed threat codes from analysis threats', () => {
    expect(resolveRiskDetectionContent('GSB:SOCIAL_ENGINEERING', 'critical')).toMatchObject({
      englishLabel: 'SOCIAL ENGINEERING',
      title: '사회공학 위협 감지',
    });
    expect(resolveRiskDetectionContent('OTX:PHISHING', 'critical')).toMatchObject({
      englishLabel: 'PHISHING',
      title: '피싱 위협 감지',
    });
  });

  it('maps module-prefixed threat codes to the underlying backend threat description', () => {
    expect(resolveRiskDetectionContent('CERT:CERT_EXPIRED', 'critical')).toMatchObject({
      englishLabel: 'CERT EXPIRED',
      title: '만료된 인증서 감지',
    });
    expect(
      resolveRiskDetectionContent('REDIRECT:REDIRECT_LOOP_DETECTED', 'critical'),
    ).toMatchObject({
      englishLabel: 'REDIRECT LOOP DETECTED',
      title: '리다이렉트 루프 감지',
    });
    expect(resolveRiskDetectionContent('MODEL:ML:CHARCNN_FAILED', 'critical')).toMatchObject({
      englishLabel: 'CHARCNN FAILED',
      title: 'CharCNN 분석 실패 감지',
    });
  });

  it('keeps certificate timeout aliases mapped to their canonical timeout entry', () => {
    expect(resolveRiskDetectionContent('certificate_timeout', 'warning')).toMatchObject({
      englishLabel: 'CERT TIMEOUT',
      title: '인증서 검증 시간 초과 감지',
    });
    expect(resolveRiskDetectionContent('certificate_request_timeout', 'warning')).toMatchObject({
      englishLabel: 'CERTIFICATE REQUEST TIMEOUT',
      title: '인증서 요청 시간 초과 감지',
    });
  });

  it('uses user-facing copy for unknown threat fallbacks', () => {
    const content = resolveRiskDetectionContent('NEW_BACKEND_SIGNAL', 'critical');

    expect(content.description).not.toContain('백엔드');
    expect(content.description).not.toContain('정책 테이블');
    expect(content.risk).not.toContain('운영 정책');
    expect(content.englishLabel).toBe('UNKNOWN CRITICAL RISK SIGNAL');
  });
});
