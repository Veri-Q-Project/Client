import { toApiError } from '@/shared/api/errors/apiError';

type MessageApiLike = {
  error: (content: string) => void;
};

export function showApiError(
  messageApi: MessageApiLike,
  error: unknown,
  fallbackMessage = '요청 처리 중 오류가 발생했습니다.',
): void {
  const apiError = toApiError(error);
  const message = apiError.message?.trim() || fallbackMessage;
  messageApi.error(message);
}
