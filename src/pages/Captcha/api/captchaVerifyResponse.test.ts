import { describe, expect, it } from 'vitest';

import { toCaptchaVerifyResponse } from './captchaVerifyResponse';

describe('toCaptchaVerifyResponse', () => {
  it('treats 200 payloads without explicit failure markers as success', () => {
    expect(
      toCaptchaVerifyResponse({
        guestUuid: 'guest-1',
        message: '인증 완료',
      }),
    ).toEqual({
      message: '인증 완료',
      success: true,
    });
  });

  it('treats error_code payloads as failure', () => {
    expect(
      toCaptchaVerifyResponse({
        error_code: 'CAPTCHA_REQUIRED',
        message: '캡차 인증이 필요합니다.',
      }),
    ).toEqual({
      message: '캡차 인증이 필요합니다.',
      success: false,
    });
  });

  it('respects explicit boolean success fields', () => {
    expect(
      toCaptchaVerifyResponse({
        message: 'failed',
        success: false,
      }),
    ).toEqual({
      message: 'failed',
      success: false,
    });
  });
});
