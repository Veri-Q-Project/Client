import { describe, expect, it } from 'vitest';

import { resolveNonUrlActionExecution } from './resolveNonUrlActionExecution';

describe('resolveNonUrlActionExecution', () => {
  it('normalizes web URLs and rejects credential-bearing URLs', () => {
    expect(resolveNonUrlActionExecution('WEB', 'example.com')).toMatchObject({
      kind: 'open',
      url: 'https://example.com',
    });

    expect(resolveNonUrlActionExecution('WEB', 'https://user:password@example.com')).toMatchObject({
      kind: 'unsupported',
    });
  });

  it('sanitizes phone and message schemes before navigation', () => {
    expect(resolveNonUrlActionExecution('TEL', 'tel:010-1234-5678?ignored=1')).toMatchObject({
      confirmationTitle: expect.any(String),
      href: 'tel:01012345678',
      kind: 'navigate',
    });

    expect(resolveNonUrlActionExecution('SMS', 'sms:+82 10 1234 5678?body=hello')).toMatchObject({
      href: 'smsto:+821012345678',
      kind: 'navigate',
    });
  });

  it('sanitizes mailto payloads before navigation', () => {
    expect(
      resolveNonUrlActionExecution('EMAIL', 'mailto:help@example.com?subject=secret'),
    ).toMatchObject({
      href: 'mailto:help@example.com',
      kind: 'navigate',
    });
  });

  it('allows only known deep link schemes', () => {
    expect(resolveNonUrlActionExecution('DEEP_LINK', 'kakaotalk://chat')).toMatchObject({
      href: 'kakaotalk://chat',
      kind: 'navigate',
    });

    expect(resolveNonUrlActionExecution('DEEP_LINK', 'unknownapp://open')).toMatchObject({
      kind: 'unsupported',
    });
  });

  it('blocks script-like schemes for app and crypto actions', () => {
    const scriptLikeScheme = `java${'script'}:alert(1)`;

    expect(resolveNonUrlActionExecution('DEEP_LINK', scriptLikeScheme)).toMatchObject({
      kind: 'unsupported',
    });

    expect(resolveNonUrlActionExecution('CRYPTO', scriptLikeScheme)).toMatchObject({
      kind: 'unsupported',
    });
  });

  it('allows known crypto schemes and safely prefixes bare addresses', () => {
    expect(
      resolveNonUrlActionExecution('CRYPTO', 'bitcoin:1BoatSLRHtKNngkdXEeobR76b53LETtpyT'),
    ).toMatchObject({
      href: 'bitcoin:1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
      kind: 'navigate',
    });

    expect(
      resolveNonUrlActionExecution('CRYPTO', '1BoatSLRHtKNngkdXEeobR76b53LETtpyT'),
    ).toMatchObject({
      href: 'bitcoin:1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
      kind: 'navigate',
    });
  });
});
