import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/errors/apiError';

import { isCaptchaRequiredUploadError } from './uploadErrors';

describe('isCaptchaRequiredUploadError', () => {
  it('returns true for 429 captcha responses', () => {
    const error = new ApiError({
      data: {
        error_code: 'CAPTCHA_REQUIRED',
      },
      message: '요청 횟수 초과. 안전한 이용을 위해 캡차 인증이 필요합니다.',
      statusCode: 429,
    });

    expect(isCaptchaRequiredUploadError(error)).toBe(true);
  });

  it('detects captcha markers from nested payload messages', () => {
    const error = new ApiError({
      data: {
        data: {
          detail: 'captcha verification required',
        },
      },
      message: 'Too many requests.',
      statusCode: 429,
    });

    expect(isCaptchaRequiredUploadError(error)).toBe(true);
  });

  it('returns false for non-captcha responses', () => {
    const error = new ApiError({
      message: 'Request failed.',
      statusCode: 500,
    });

    expect(isCaptchaRequiredUploadError(error)).toBe(false);
  });

  it('returns true for plain 429 upload responses', () => {
    const error = new ApiError({
      data: {
        message: 'Too many requests.',
      },
      message: 'Too many requests.',
      statusCode: 429,
    });

    expect(isCaptchaRequiredUploadError(error)).toBe(true);
  });
});
