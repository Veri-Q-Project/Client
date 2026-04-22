import axios, { AxiosError } from 'axios';

type ApiErrorOptions = {
  cause?: unknown;
  code?: string;
  data?: unknown;
  message: string;
  statusCode?: number;
};

export class ApiError extends Error {
  code?: string;
  data?: unknown;
  statusCode?: number;

  constructor({ cause, code, data, message, statusCode }: ApiErrorOptions) {
    super(message, cause ? { cause } : undefined);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
    this.statusCode = statusCode;
  }
}

function resolveAxiosErrorMessage(error: AxiosError): string {
  const responseData = error.response?.data;

  if (responseData && typeof responseData === 'object') {
    const dataMessage = 'message' in responseData ? responseData.message : null;

    if (typeof dataMessage === 'string' && dataMessage.trim().length > 0) {
      return dataMessage.trim();
    }
  }

  if (typeof error.message === 'string' && error.message.trim().length > 0) {
    return error.message;
  }

  return 'API request failed.';
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return new ApiError({
      cause: error,
      code: error.code,
      data: error.response?.data,
      message: resolveAxiosErrorMessage(error),
      statusCode: error.response?.status,
    });
  }

  if (error instanceof Error) {
    const message = error.message.trim() || 'Unknown API error.';

    return new ApiError({
      cause: error,
      message,
    });
  }

  return new ApiError({
    cause: error,
    message: 'Unknown API error.',
  });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
