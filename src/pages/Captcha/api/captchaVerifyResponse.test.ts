import { describe, expect, it } from 'vitest';

import { toCaptchaVerifyResponse } from './captchaVerifyResponse';

describe('toCaptchaVerifyResponse', () => {
  it('treats payloads without explicit success markers as failure', () => {
    expect(
      toCaptchaVerifyResponse({
        guestUuid: 'guest-1',
        message: 'verified',
      }),
    ).toEqual({
      message: 'verified',
      success: false,
    });
  });

  it('treats success statuses as success', () => {
    expect(
      toCaptchaVerifyResponse({
        message: 'verified',
        status: 'success',
      }),
    ).toEqual({
      message: 'verified',
      success: true,
    });
  });

  it('treats failure statuses as failure', () => {
    expect(
      toCaptchaVerifyResponse({
        message: 'failed',
        status: 'failed',
      }),
    ).toEqual({
      message: 'failed',
      success: false,
    });
  });

  it('fails closed for pending statuses', () => {
    expect(
      toCaptchaVerifyResponse({
        message: 'pending',
        status: 'pending',
      }),
    ).toEqual({
      message: 'pending',
      success: false,
    });
  });

  it('lets explicit error codes override success booleans', () => {
    expect(
      toCaptchaVerifyResponse({
        error_code: 'CAPTCHA_REQUIRED',
        message: 'captcha required',
        success: true,
      }),
    ).toEqual({
      message: 'captcha required',
      success: false,
    });
  });

  it('respects explicit boolean failure fields', () => {
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
