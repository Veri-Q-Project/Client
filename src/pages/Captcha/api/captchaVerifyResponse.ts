import { pickBoolean, pickString } from '@/shared/api/responseAccess/payloadAccess';

import type { CaptchaVerifyResponse } from '../types/captcha.types';

const successStatuses = new Set([
  'complete',
  'completed',
  'ok',
  'pass',
  'passed',
  'success',
  'succeeded',
  'verified',
]);

const failureStatuses = new Set([
  'blocked',
  'denied',
  'error',
  'fail',
  'failed',
  'invalid',
  'rejected',
]);

function normalizeStatus(value: string | null): string {
  return value?.trim().toLowerCase() ?? '';
}

export function toCaptchaVerifyResponse(payload: unknown): CaptchaVerifyResponse {
  const explicitSuccess = pickBoolean(payload, ['success', 'verified', 'isVerified']);
  const errorCode = pickString(payload, ['error_code', 'errorCode', 'code']);
  const status = normalizeStatus(pickString(payload, ['status', 'result']));

  const success =
    Boolean(errorCode) || failureStatuses.has(status)
      ? false
      : explicitSuccess !== null
        ? explicitSuccess
        : successStatuses.has(status);

  const message =
    pickString(payload, ['message']) ??
    (success ? '캡차 검증이 완료되었습니다.' : '캡차 검증에 실패했습니다.');

  return {
    message,
    success,
  };
}
