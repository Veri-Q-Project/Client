import { isApiError } from '@/shared/api/errors/apiError';

export function isCaptchaRequiredUploadError(error: unknown): boolean {
  return isApiError(error) && error.statusCode === 429;
}
