import { describe, expect, it } from 'vitest';

import { parseSseMessage } from './sseEvents';

describe('parseSseMessage', () => {
  it('treats default message events with progress fields as progress messages', () => {
    const parsedMessage = parseSseMessage(
      JSON.stringify({
        guestUuid: 'guest-1',
        message: 'Decoding QR image',
        status: 'IN_PROGRESS',
        step: 'decode',
      }),
      'message',
    );

    expect(parsedMessage.type).toBe('progress');
  });

  it('treats completed step payloads as progress even on complete events', () => {
    const parsedMessage = parseSseMessage(
      JSON.stringify({
        message: '최종 위험도 계산이 완료되었습니다.',
        status: 'COMPLETED',
        step: 'SCORING',
      }),
      'COMPLETE',
    );

    expect(parsedMessage.type).toBe('progress');
  });

  it('treats default message events with final analysis fields as final messages', () => {
    const parsedMessage = parseSseMessage(
      JSON.stringify({
        originalUrl: 'https://example.com',
        redirect: false,
        riskLevel: 'LOW',
        score: 92,
      }),
      'message',
    );

    expect(parsedMessage.type).toBe('final');
  });

  it('treats failed status payloads as error messages', () => {
    const parsedMessage = parseSseMessage(
      JSON.stringify({
        message: 'analysis failed',
        status: 'FAILED',
      }),
      'message',
    );

    expect(parsedMessage.type).toBe('error');
  });
});
