import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const rootDir = process.cwd();
const envFilePath = path.join(rootDir, '.env.server.local');

function parseEnvFile(content) {
  const env = {};
  const lines = content.split(/\r?\n/u);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function loadServerEnv() {
  let fileEnv = {};

  if (fs.existsSync(envFilePath)) {
    const rawContent = fs.readFileSync(envFilePath, 'utf8');
    fileEnv = parseEnvFile(rawContent);
  }

  const mergedEnv = {
    ...fileEnv,
  };

  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value !== 'string') {
      continue;
    }

    if (value.trim().length === 0) {
      continue;
    }

    mergedEnv[key] = value;
  }

  return mergedEnv;
}

function isLocalDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/u.test(origin);
}

function resolveAllowedOrigin(requestOrigin, configuredOrigin, allowLocalhostOrigins) {
  if (!requestOrigin) {
    return configuredOrigin;
  }

  if (configuredOrigin === '*') {
    return '*';
  }

  const configuredOrigins = configuredOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (configuredOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  if (allowLocalhostOrigins && isLocalDevOrigin(requestOrigin)) {
    return requestOrigin;
  }

  return configuredOrigins[0] ?? configuredOrigin;
}

function setCorsHeaders(response, allowedOrigin) {
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  response.setHeader('Vary', 'Origin');
}

function sendJson(response, statusCode, payload, allowedOrigin) {
  setCorsHeaders(response, allowedOrigin);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

async function verifyCaptchaToken(secretKey, token) {
  const body = new URLSearchParams({
    response: token,
    secret: secretKey,
  });

  let response;
  try {
    response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      body: body.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? `Failed to call Google verify API: ${error.message}`
          : 'Failed to call Google verify API.',
      success: false,
    };
  }

  if (!response.ok) {
    return {
      message: `Google verify request failed (HTTP ${response.status}).`,
      success: false,
    };
  }

  let data;
  let errorCodes = [];
  try {
    data = await response.json();
    errorCodes = Array.isArray(data['error-codes']) ? data['error-codes'] : [];
  } catch (error) {
    console.error('[captcha-server] failed to parse Google verify response');
    console.error(error);
    return {
      message: 'Failed to parse Google verify response payload.',
      success: false,
    };
  }

  if (!data.success) {
    return {
      message:
        errorCodes.length > 0
          ? `Captcha verification failed: ${errorCodes.join(', ')}`
          : 'Captcha verification failed.',
      success: false,
    };
  }

  return {
    message: 'Captcha verification succeeded.',
    success: true,
  };
}

async function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let rawBody = '';

    request.on('data', (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 1024 * 1024) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });

    request.on('end', () => {
      resolve(rawBody);
    });

    request.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const env = loadServerEnv();
  const port = Number.parseInt(env.CAPTCHA_SERVER_PORT ?? '8080', 10);
  const allowedOrigin = env.CAPTCHA_ALLOWED_ORIGIN ?? 'http://localhost:5173';
  const secretKey = (env.CAPTCHA_SECRET_KEY ?? '').trim();
  const allowLocalhostOriginsRaw =
    env.ALLOW_LOCALHOST_ORIGINS ?? (env.NODE_ENV === 'production' ? 'false' : 'true');
  const allowLocalhostOrigins = allowLocalhostOriginsRaw.toLowerCase() === 'true';

  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? '/', `http://localhost:${port}`);
    const requestOrigin = typeof request.headers.origin === 'string' ? request.headers.origin : '';
    const allowedOriginForRequest = resolveAllowedOrigin(
      requestOrigin,
      allowedOrigin,
      allowLocalhostOrigins,
    );

    if (request.method === 'OPTIONS') {
      setCorsHeaders(response, allowedOriginForRequest);
      response.writeHead(204);
      response.end();
      return;
    }

    if (requestUrl.pathname === '/health' && request.method === 'GET') {
      sendJson(
        response,
        200,
        {
          status: 'ok',
        },
        allowedOriginForRequest,
      );
      return;
    }

    if (requestUrl.pathname !== '/api/captcha/verify' || request.method !== 'POST') {
      sendJson(
        response,
        404,
        {
          message: 'Not found.',
          success: false,
        },
        allowedOriginForRequest,
      );
      return;
    }

    if (!secretKey) {
      sendJson(
        response,
        500,
        {
          message: 'CAPTCHA_SECRET_KEY is empty. Set it in .env.server.local.',
          success: false,
        },
        allowedOriginForRequest,
      );
      return;
    }

    try {
      const rawBody = await readRequestBody(request);
      const parsedBody = JSON.parse(rawBody);
      const token = typeof parsedBody.token === 'string' ? parsedBody.token.trim() : '';

      if (!token) {
        sendJson(
          response,
          400,
          {
            message: 'Captcha token is empty.',
            success: false,
          },
          allowedOriginForRequest,
        );
        return;
      }

      const result = await verifyCaptchaToken(secretKey, token);
      const statusCode = result.success ? 200 : 400;
      if (!result.success) {
        console.warn(`[captcha-server] verify failed: ${result.message ?? 'unknown reason'}`);
      }
      sendJson(response, statusCode, result, allowedOriginForRequest);
    } catch (error) {
      console.error('[captcha-server] unexpected error while verifying');
      console.error(error);
      sendJson(
        response,
        500,
        {
          message: error instanceof Error ? error.message : 'Unexpected server error.',
          success: false,
        },
        allowedOriginForRequest,
      );
    }
  });

  server.listen(port, () => {
    console.info(`[captcha-server] running at http://localhost:${port}`);
    console.info('[captcha-server] endpoint: POST /api/captcha/verify');
    console.info('[captcha-server] health: GET /health');
    console.info(`[captcha-server] allowed origin: ${allowedOrigin}`);
    console.info(`[captcha-server] allow localhost origins: ${allowLocalhostOrigins}`);
    console.info(`[captcha-server] secret key loaded: ${secretKey.length > 0 ? 'yes' : 'no'}`);
  });

  server.on('error', (error) => {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {
      console.error(`[captcha-server] port ${port} is already in use.`);
      console.error('[captcha-server] stop the old process or change CAPTCHA_SERVER_PORT.');
      process.exit(1);
    }

    console.error('[captcha-server] failed to listen');
    console.error(error);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error('[captcha-server] failed to start');
  console.error(error);
  process.exit(1);
});
