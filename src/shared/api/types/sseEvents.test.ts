import { describe, expect, it } from 'vitest';

import { parseSseMessage } from './sseEvents';

describe('parseSseMessage', () => {
  it('treats default message events with progress fields as progress messages', () => {
    const payload = {
      guestUuid: 'guest-1',
      message: 'Decoding QR image',
      status: 'IN_PROGRESS',
      step: 'decode',
    };
    const parsedMessage = parseSseMessage(JSON.stringify(payload), 'message');

    expect(parsedMessage.type).toBe('progress');
    expect(parsedMessage.payload).toMatchObject({
      guestUuid: 'guest-1',
      message: 'Decoding QR image',
      status: 'IN_PROGRESS',
      step: 'decode',
    });
  });

  it('treats explicit complete events as final even when progress fields are present', () => {
    const payload = {
      message: 'Scoring completed',
      status: 'COMPLETED',
      step: 'SCORING',
    };
    const parsedMessage = parseSseMessage(JSON.stringify(payload), 'COMPLETE');

    expect(parsedMessage.type).toBe('final');
    expect(parsedMessage.payload).toMatchObject({
      message: 'Scoring completed',
      status: 'COMPLETED',
      step: 'SCORING',
    });
  });

  it('treats default message events with final analysis fields as final messages', () => {
    const payload = {
      originalUrl: 'https://example.com',
      redirect: false,
      riskLevel: 'LOW',
      score: 92,
    };
    const parsedMessage = parseSseMessage(JSON.stringify(payload), 'message');

    expect(parsedMessage.type).toBe('final');
    expect(parsedMessage.payload).toMatchObject({
      originalUrl: 'https://example.com',
      redirect: false,
      riskLevel: 'LOW',
      score: 92,
    });
  });

  it('treats failed status payloads as error messages', () => {
    const payload = {
      message: 'analysis failed',
      status: 'FAILED',
    };
    const parsedMessage = parseSseMessage(JSON.stringify(payload), 'message');

    expect(parsedMessage.type).toBe('error');
    expect(parsedMessage.payload).toMatchObject({
      message: 'analysis failed',
      status: 'FAILED',
    });
  });
});
