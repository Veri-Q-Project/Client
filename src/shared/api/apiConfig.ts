const DEFAULT_API_TIMEOUT_MS = 10_000;
const DEFAULT_UPLOAD_TIMEOUT_MS = 60_000;
const DEFAULT_SSE_RECONNECT_MAX = 3;
const DEV_BE1_PROXY_BASE_URL = '/be1';
const DEV_BE3_PROXY_BASE_URL = '/be3';

function parsePositiveInteger(rawValue: string | undefined, fallback: number): number {
  const parsedValue = Number.parseInt(rawValue ?? '', 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

function trimEnvValue(rawValue: string | undefined): string {
  return (rawValue ?? '').trim();
}

function requireProdEnvValue(rawValue: string | undefined, variableName: string): string {
  const trimmedValue = trimEnvValue(rawValue);

  if (!trimmedValue) {
    throw new Error(`${variableName} is required for production builds.`);
  }

  return trimmedValue;
}

export function getBe1BaseUrl(): string {
  if (import.meta.env.DEV) {
    return DEV_BE1_PROXY_BASE_URL;
  }

  return requireProdEnvValue(import.meta.env.VITE_BE1_BASE_URL, 'VITE_BE1_BASE_URL');
}

export function getBe3BaseUrl(): string {
  if (import.meta.env.DEV) {
    return DEV_BE3_PROXY_BASE_URL;
  }

  return requireProdEnvValue(import.meta.env.VITE_BE3_BASE_URL, 'VITE_BE3_BASE_URL');
}

export function getApiTimeoutMs(): number {
  return parsePositiveInteger(import.meta.env.VITE_API_TIMEOUT_MS, DEFAULT_API_TIMEOUT_MS);
}

export function getUploadTimeoutMs(): number {
  return parsePositiveInteger(import.meta.env.VITE_UPLOAD_TIMEOUT_MS, DEFAULT_UPLOAD_TIMEOUT_MS);
}

export function getSseReconnectMax(): number {
  return parsePositiveInteger(import.meta.env.VITE_SSE_RECONNECT_MAX, DEFAULT_SSE_RECONNECT_MAX);
}
