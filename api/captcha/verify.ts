type CaptchaRequestBody = {
  token?: string;
};

type CaptchaSiteVerifyResponse = {
  challenge_ts?: string;
  'error-codes'?: string[];
  hostname?: string;
  success?: boolean;
};

type ApiRequest = {
  body?: CaptchaRequestBody | string;
  headers: Record<string, string | string[] | undefined>;
  method?: string;
};

type ApiResponse = {
  end: (body?: string) => void;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string | string[]) => void;
  status: (statusCode: number) => ApiResponse;
};

type CaptchaResponseBody = {
  challengeTs?: string;
  errorCodes?: string[];
  hostname?: string;
  message: string;
  success: boolean;
};

const CAPTCHA_VERIFY_TIMEOUT_MS = 8_000;

function getOriginHeader(headers: ApiRequest['headers']): string | null {
  const originHeader = headers.origin;

  if (typeof originHeader === 'string' && originHeader.trim().length > 0) {
    return originHeader;
  }

  if (Array.isArray(originHeader) && originHeader[0]?.trim()) {
    return originHeader[0];
  }

  return null;
}

function getRemoteIp(headers: ApiRequest['headers']): string | null {
  const forwardedFor = headers['x-forwarded-for'];
  const rawValue = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;

  if (!rawValue) {
    return null;
  }

  const [remoteIp] = rawValue.split(',');

  return remoteIp?.trim() ?? null;
}

function setCorsHeaders(request: ApiRequest, response: ApiResponse) {
  const configuredOrigin = process.env.CAPTCHA_ALLOWED_ORIGIN?.trim();
  const requestOrigin = getOriginHeader(request.headers);

  if (!configuredOrigin || !requestOrigin || configuredOrigin !== requestOrigin) {
    return;
  }

  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Origin', configuredOrigin);
  response.setHeader('Vary', 'Origin');
}

function buildFailureResponse(message: string, errorCodes: string[] = []): CaptchaResponseBody {
  return {
    errorCodes,
    message,
    success: false,
  };
}

function resolveFailureMessage(errorCodes: string[]): string {
  if (errorCodes.includes('timeout-or-duplicate')) {
    return '캡차가 만료되었거나 이미 사용되었습니다. 다시 시도해 주세요.';
  }

  if (errorCodes.includes('invalid-input-response')) {
    return '캡차 응답이 올바르지 않습니다. 다시 시도해 주세요.';
  }

  if (errorCodes.includes('missing-input-response')) {
    return '캡차 응답이 비어 있습니다. 다시 검증해 주세요.';
  }

  return '캡차 검증에 실패했습니다. 다시 시도해 주세요.';
}

function resolveRequestBody(body: ApiRequest['body']): CaptchaRequestBody {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as CaptchaRequestBody;
    } catch {
      return {};
    }
  }

  return body ?? {};
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  setCorsHeaders(request, response);
  response.setHeader('Cache-Control', 'no-store');

  if (request.method === 'OPTIONS') {
    response.status(204).end();

    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json(buildFailureResponse('허용되지 않은 요청 방식입니다.'));

    return;
  }

  const captchaSecretKey = process.env.CAPTCHA_SECRET_KEY?.trim();

  if (!captchaSecretKey) {
    response.status(500).json(buildFailureResponse('캡차 시크릿 키가 설정되지 않았습니다.'));

    return;
  }

  const requestBody = resolveRequestBody(request.body);
  const token = requestBody.token?.trim();

  if (!token) {
    response.status(400).json(buildFailureResponse('캡차 토큰이 전달되지 않았습니다.'));

    return;
  }

  const verifyPayload = new URLSearchParams({
    response: token,
    secret: captchaSecretKey,
  });

  const remoteIp = getRemoteIp(request.headers);

  if (remoteIp) {
    verifyPayload.set('remoteip', remoteIp);
  }

  let verifyResponse: globalThis.Response;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), CAPTCHA_VERIFY_TIMEOUT_MS);

  try {
    verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      body: verifyPayload,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      signal: abortController.signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      response
        .status(504)
        .json(buildFailureResponse('Google reCAPTCHA 검증 시간이 초과되었습니다.'));

      return;
    }

    response
      .status(502)
      .json(buildFailureResponse('Google reCAPTCHA 검증 서버에 연결하지 못했습니다.'));

    return;
  } finally {
    clearTimeout(timeoutId);
  }

  let verifyData: CaptchaSiteVerifyResponse;

  try {
    verifyData = (await verifyResponse.json()) as CaptchaSiteVerifyResponse;
  } catch {
    response.status(502).json(buildFailureResponse('reCAPTCHA 검증 응답을 해석하지 못했습니다.'));

    return;
  }

  if (!verifyResponse.ok) {
    response
      .status(502)
      .json(
        buildFailureResponse(
          'reCAPTCHA 검증 요청이 실패했습니다.',
          verifyData['error-codes'] ?? [],
        ),
      );

    return;
  }

  if (!verifyData.success) {
    const errorCodes = verifyData['error-codes'] ?? [];

    response.status(400).json(buildFailureResponse(resolveFailureMessage(errorCodes), errorCodes));

    return;
  }

  response.status(200).json({
    challengeTs: verifyData.challenge_ts,
    hostname: verifyData.hostname,
    message: '캡차 검증에 성공했습니다.',
    success: true,
  } satisfies CaptchaResponseBody);
}
