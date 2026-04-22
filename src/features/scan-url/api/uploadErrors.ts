import { isApiError } from '@/shared/api/errors/apiError';
import { pickString } from '@/shared/api/responseAccess/payloadAccess';

function normalizeValue(value: string | null): string {
  return value?.trim().toLowerCase() ?? '';
}

export function isCaptchaRequiredUploadError(error: unknown): boolean {
  if (!isApiError(error) || error.statusCode !== 429) {
    return false;
  }

  const errorCode = normalizeValue(pickString(error.data, ['error_code', 'errorCode', 'code']));
  const message = normalizeValue(error.message);

  return errorCode.includes('captcha') || message.includes('captcha') || message.includes('캡차');
}
