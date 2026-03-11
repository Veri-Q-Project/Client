import type {
  CaptchaVerifyResponse,
  SubmitCaptchaVerificationPayload,
} from '../types/captcha.types';

const MOCK_RESPONSE_DELAY_MS = 500;

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

  if (!endpoint) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, MOCK_RESPONSE_DELAY_MS);
    });

    return token
      ? {
          message: 'Mock verification succeeded.',
          success: true,
        }
      : {
          message: 'Captcha token is empty.',
          success: false,
        };
  }

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify({ token }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
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
  } catch {
    return {
      message: 'Unable to connect to verification server.',
      success: false,
    };
  }
}
