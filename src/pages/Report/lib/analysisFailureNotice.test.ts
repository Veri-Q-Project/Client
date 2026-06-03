import { describe, expect, it } from 'vitest';

import { resolveAnalysisFailureNotice } from './analysisFailureNotice';

describe('resolveAnalysisFailureNotice', () => {
  it('resolves failure labels with provider or module prefixes', () => {
    const notice = resolveAnalysisFailureNotice([
      'MODEL:ML:CHARCNN_FAILED',
      'OTX:OTX_FAILED',
      'PHISHING',
    ]);

    expect(notice).toEqual({
      hasFailureAlert: true,
      isOnlyAnalysisFailures: false,
      labels: ['문자 패턴 AI 분석', 'OTX 위협 정보 조회'],
    });
  });

  it('detects an all-failure result even when labels are deduplicated', () => {
    const notice = resolveAnalysisFailureNotice(['REDIRECT_FAILED', 'REDIRECT:REDIRECT_FAILED']);

    expect(notice).toEqual({
      hasFailureAlert: true,
      isOnlyAnalysisFailures: true,
      labels: ['리다이렉트 분석'],
    });
  });
});
