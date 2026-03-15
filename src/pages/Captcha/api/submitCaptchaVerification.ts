import type {
  CaptchaVerificationResponse,
  SubmitCaptchaVerificationParams,
} from '../types/captcha.types';

const DEFAULT_CAPTCHA_TIMEOUT_MS = 8_000;

function buildFailureResponse(message: string): CaptchaVerificationResponse {
  return {
    errorCodes: [],
    message,
    success: false,
  };
}

export async function submitCaptchaVerification({
  endpoint,
  timeoutMs = DEFAULT_CAPTCHA_TIMEOUT_MS,
  token,
}: SubmitCaptchaVerificationParams): Promise<CaptchaVerificationResponse> {
  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify({ token }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: abortController.signal,
    });

    let responseData: Partial<CaptchaVerificationResponse> | null = null;

    try {
      responseData = (await response.json()) as Partial<CaptchaVerificationResponse>;
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      return {
        errorCodes: responseData?.errorCodes ?? [],
        message: responseData?.message ?? `인증 요청에 실패했습니다. (HTTP ${response.status})`,
        success: false,
      };
    }

    return {
      errorCodes: responseData?.errorCodes ?? [],
      message: responseData?.message ?? '캡차 검증에 성공했습니다.',
      success: responseData?.success === true,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return buildFailureResponse('캡차 검증 요청 시간이 초과되었습니다.');
    }

    return buildFailureResponse('검증 서버에 연결하지 못했습니다.');
  } finally {
    window.clearTimeout(timeoutId);
  }
}
