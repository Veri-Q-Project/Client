import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { buildTargetUrl } = require('./_proxy');

describe('buildTargetUrl', () => {
  const targetBase = new URL('https://backend.example.com');

  it('strips the rewritten Vercel function prefix', () => {
    const targetUrl = buildTargetUrl(
      '/api/be1/api/v1/scan?limit=3',
      {
        prefixes: ['/api/be1', '/be1'],
      },
      targetBase,
    );

    expect(targetUrl.toString()).toBe('https://backend.example.com/api/v1/scan?limit=3');
  });

  it('strips the original public proxy prefix', () => {
    const targetUrl = buildTargetUrl(
      '/be1/api/v1/scan',
      {
        prefixes: ['/api/be1', '/be1'],
      },
      targetBase,
    );

    expect(targetUrl.toString()).toBe('https://backend.example.com/api/v1/scan');
  });

  it('does not partially strip similarly named paths', () => {
    const targetUrl = buildTargetUrl(
      '/be10/api/v1/scan',
      {
        prefixes: ['/be1'],
      },
      targetBase,
    );

    expect(targetUrl.toString()).toBe('https://backend.example.com/be10/api/v1/scan');
  });
});
