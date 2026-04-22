import { isApiError } from '@/shared/api/errors/apiError';
import { pickString } from '@/shared/api/responseAccess/payloadAccess';

function normalizeValue(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

export function isCaptchaRequiredUploadError(error: unknown): boolean {
  if (!isApiError(error) || error.statusCode !== 429) {
    return false;
  }

  const errorCode = normalizeValue(
    pickString(error.data, ['error_code', 'errorCode', 'code', 'status']),
  );
  const payloadMessage = pickString(error.data, [
    'message',
    'detail',
    'error',
    'error_description',
    'description',
  ]);
  const message = normalizeValue([error.message, payloadMessage].filter(Boolean).join(' '));

  return errorCode.includes('captcha') || message.includes('captcha') || message.includes('캡차');
}
