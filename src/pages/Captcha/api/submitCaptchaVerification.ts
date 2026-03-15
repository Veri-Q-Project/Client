import type {
  CaptchaVerifyResponse,
  SubmitCaptchaVerificationPayload,
} from '../types/captcha.types';

const MOCK_RESPONSE_DELAY_MS = 500;
const DEFAULT_VERIFY_TIMEOUT_MS = 5000;

function getVerifyTimeoutMs(): number {
  const rawTimeout = import.meta.env.VITE_CAPTCHA_VERIFY_TIMEOUT_MS;
  const parsedTimeout = Number.parseInt(rawTimeout ?? '', 10);

  if (Number.isNaN(parsedTimeout) || parsedTimeout <= 0) {
    return DEFAULT_VERIFY_TIMEOUT_MS;
  }

  return parsedTimeout;
}

function getVerifyEndpoint(): string | null {
  const endpoint = import.meta.env.VITE_CAPTCHA_VERIFY_ENDPOINT;

  if (!endpoint) {
    return null;
  }

  const trimmedEndpoint = endpoint.trim();
  return trimmedEndpoint.length > 0 ? trimmedEndpoint : null;
}

async function parseResponse(response: Response): Promise<CaptchaVerifyResponse> {
  try {
    const data = (await response.json()) as Partial<CaptchaVerifyResponse>;
    return {
      message: data.message,
      success: data.success === true,
    };
  } catch {
    return {
      message: 'Unable to parse response from verification server.',
      success: false,
    };
  }
}

export async function submitCaptchaVerification({
  token,
}: SubmitCaptchaVerificationPayload): Promise<CaptchaVerifyResponse> {
  const endpoint = getVerifyEndpoint();
  const timeoutMs = getVerifyTimeoutMs();

  if (!endpoint) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, MOCK_RESPONSE_DELAY_MS);
    });

    if (!token) {
      return {
        message: 'Captcha token is empty.',
        success: false,
      };
    }

    const isDebugCaptchaEnabled = import.meta.env.VITE_ENABLE_DEBUG_CAPTCHA === 'true';
    const isMockToken = token.startsWith('mock-token-');

    if (isDebugCaptchaEnabled && isMockToken) {
      return {
        message: 'Mock verification succeeded.',
        success: true,
      };
    }

    return {
      message: 'Captcha verification endpoint is not configured.',
      success: false,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    let response: Response;
    try {
      response = await fetch(endpoint, {
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timeoutId);
    }

    const result = await parseResponse(response);

    if (!response.ok) {
      return {
        message: result.message ?? `Verification request failed. (HTTP ${response.status})`,
        success: false,
      };
    }

    if (result.success) {
      return result;
    }

    return {
      message: result.message ?? 'Captcha verification failed.',
      success: false,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        message: `Verification request timed out. (${timeoutMs}ms)`,
        success: false,
      };
    }

    return {
      message: 'Unable to connect to verification server.',
      success: false,
    };
  }
}
