import fs from 'node:fs';
import path from 'node:path';

if (process.env.CI) {
  console.info('[setupEnv] CI environment detected. Skipping local env file generation.');
  process.exit(0);
}

const rootDir = process.cwd();
const envExamplePath = path.join(rootDir, '.env.example');
const envLocalPath = path.join(rootDir, '.env.local');
const serverEnvExamplePath = path.join(rootDir, '.env.server.example');
const serverEnvLocalPath = path.join(rootDir, '.env.server.local');
const OWNER_READ_WRITE_MODE = 0o600;

const defaultEnvContent = [
  '# Captcha provider: mock | googleRecaptchaEnterprise',
  'VITE_CAPTCHA_PROVIDER=googleRecaptchaEnterprise',
  '',
  '# Google reCAPTCHA Enterprise checkbox site key (required when provider is googleRecaptchaEnterprise)',
  'VITE_RECAPTCHA_SITE_KEY=',
  '',
  '# Enable mock/debug controls on CaptchaPage (true | false)',
  'VITE_ENABLE_DEBUG_CAPTCHA=false',
  '',
  '# Backend base URLs',
  'VITE_BE1_BASE_URL=http://34.64.182.89:8081',
  'VITE_BE3_BASE_URL=http://34.64.182.89:8083',
  '',
  '# Enable mock API fallback in development only (true | false)',
  'VITE_USE_MOCK_API=false',
  '',
  '# Shared request timeout',
  'VITE_API_TIMEOUT_MS=10000',
  '',
  '# Upload request timeout',
  'VITE_UPLOAD_TIMEOUT_MS=60000',
  '',
  '# Maximum SSE reconnect attempts',
  'VITE_SSE_RECONNECT_MAX=3',
  '',
].join('\n');

const defaultServerEnvContent = [
  '# Node captcha verify server port',
  'CAPTCHA_SERVER_PORT=8080',
  '',
  '# Allowed frontend origin for CORS',
  'CAPTCHA_ALLOWED_ORIGIN=http://localhost:5173',
  '',
  '# Allow localhost origins automatically when not listed in CAPTCHA_ALLOWED_ORIGIN',
  'ALLOW_LOCALHOST_ORIGINS=true',
  '',
  '# Google reCAPTCHA secret key (server only, never commit)',
  'CAPTCHA_SECRET_KEY=',
  '',
].join('\n');

function applyOwnerOnlyMode(filePath) {
  try {
    fs.chmodSync(filePath, OWNER_READ_WRITE_MODE);
  } catch (error) {
    console.warn(`[setupEnv] failed to set secure permission for ${filePath}`);
    if (error instanceof Error) {
      console.warn(`[setupEnv] ${error.message}`);
    }
  }
}

function createEnvFile({
  filePath,
  examplePath,
  defaultContent,
  fileName,
  exampleName,
  secureMode = false,
}) {
  if (fs.existsSync(filePath)) {
    if (secureMode) {
      applyOwnerOnlyMode(filePath);
    }
    console.info(`[setupEnv] ${fileName} already exists. Skipping.`);
    return;
  }

  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, filePath);
    if (secureMode) {
      applyOwnerOnlyMode(filePath);
    }
    console.info(`[setupEnv] ${fileName} created from ${exampleName}`);
    return;
  }

  fs.writeFileSync(filePath, defaultContent, {
    encoding: 'utf8',
    mode: secureMode ? OWNER_READ_WRITE_MODE : undefined,
  });
  if (secureMode) {
    applyOwnerOnlyMode(filePath);
  }
  console.info(`[setupEnv] ${fileName} created with default template`);
}

createEnvFile({
  defaultContent: defaultEnvContent,
  exampleName: '.env.example',
  examplePath: envExamplePath,
  fileName: '.env.local',
  filePath: envLocalPath,
});

createEnvFile({
  defaultContent: defaultServerEnvContent,
  exampleName: '.env.server.example',
  examplePath: serverEnvExamplePath,
  fileName: '.env.server.local',
  filePath: serverEnvLocalPath,
  secureMode: true,
});
