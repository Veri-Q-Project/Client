#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import QRCode from 'qrcode';

const outputDirectory = fileURLToPath(new URL('./generated-qr/', import.meta.url));

function normalizeUrl(input) {
  const trimmedInput = input.trim();

  if (/^https?:[^/]/iu.test(trimmedInput)) {
    return trimmedInput.replace(/^(https?):/iu, '$1://');
  }

  if (!/^[a-z][a-z0-9+.-]*:/iu.test(trimmedInput)) {
    return `https://${trimmedInput}`;
  }

  return trimmedInput;
}

function createFileName(urlText) {
  const hash = createHash('sha256').update(urlText).digest('hex').slice(0, 8);
  let readablePart = urlText;

  try {
    const url = new URL(urlText);
    readablePart = `${url.hostname}${url.pathname}`;
  } catch {
    readablePart = urlText;
  }

  const slug = readablePart
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 72);

  return `${slug || 'qr-code'}-${hash}.png`;
}

function printUsage() {
  console.error('Usage: pnpm test-code <url>');
  console.error('Alias: pnpm test-code: <url>');
  console.error('Example: pnpm test-code https://naver.com');
}

async function generateQrPng(rawUrl) {
  const urlText = normalizeUrl(rawUrl);
  const filePath = path.join(outputDirectory, createFileName(urlText));

  await mkdir(outputDirectory, { recursive: true });
  await QRCode.toFile(filePath, urlText, {
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
    margin: 2,
    scale: 10,
    type: 'png',
  });

  console.log(`QR text: ${urlText}`);
  console.log(`Saved: ${filePath}`);
}

const urls = process.argv.slice(2).filter((argument) => argument.trim().length > 0);

if (urls.length === 0) {
  printUsage();
  process.exitCode = 1;
} else {
  for (const url of urls) {
    await generateQrPng(url);
  }
}
