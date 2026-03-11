import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const envExamplePath = path.join(rootDir, '.env.example');
const envLocalPath = path.join(rootDir, '.env.local');
const serverEnvExamplePath = path.join(rootDir, '.env.server.example');
const serverEnvLocalPath = path.join(rootDir, '.env.server.local');

const defaultEnvContent = [
  '# Captcha provider: mock | googleRecaptchaEnterprise',
  'VITE_CAPTCHA_PROVIDER=googleRecaptchaEnterprise',
  '',
  '# Google reCAPTCHA Enterprise checkbox site key (required when provider is googleRecaptchaEnterprise)',
  'VITE_RECAPTCHA_SITE_KEY=',
  '',
  '# Optional backend verification endpoint',
  '# Example: http://localhost:8080/api/captcha/verify',
  'VITE_CAPTCHA_VERIFY_ENDPOINT=http://localhost:8080/api/captcha/verify',
  '',
].join('\n');

const defaultServerEnvContent = [
  '# Node captcha verify server port',
  'CAPTCHA_SERVER_PORT=8080',
  '',
  '# Allowed frontend origin for CORS',
  'CAPTCHA_ALLOWED_ORIGIN=http://localhost:5173',
  '',
  '# Google reCAPTCHA secret key (server only, never commit)',
  'CAPTCHA_SECRET_KEY=',
  '',
].join('\n');

function createEnvFile({ filePath, examplePath, defaultContent, fileName, exampleName }) {
  if (fs.existsSync(filePath)) {
    console.info(`[setupEnv] ${fileName} already exists. Skipping.`);
    return;
  }

  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, filePath);
    console.info(`[setupEnv] ${fileName} created from ${exampleName}`);
    return;
  }

  fs.writeFileSync(filePath, defaultContent, 'utf8');
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
});
