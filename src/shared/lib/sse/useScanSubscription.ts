import { useEffect, useRef } from 'react';

import { getBe3BaseUrl, getSseReconnectMax } from '@/shared/api/apiConfig';
import { apiEndpoints } from '@/shared/api/endpoints';
import { parseSseMessage } from '@/shared/api/types';

type UseScanSubscriptionParams = {
  enabled: boolean;
  guestUuid: string | null;
  onError?: (errorMessage: string) => void;
  onFinal?: (payload: Record<string, unknown>) => void;
  onProgress?: (payload: Record<string, unknown>) => void;
};

const INACTIVITY_TIMEOUT_MS = 120_000;
const RECONNECT_DELAY_MS = 1_000;
const sseEventNames = [
  'INIT',
  'COMPLETE',
  'complete',
  'completed',
  'error',
  'final',
  'progress',
  'result',
] as const;

function normalizeFinalPayload(payload: unknown): Record<string, unknown> | null {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }

  if (typeof payload === 'string') {
    const normalizedUrl = payload.trim();

    if (!normalizedUrl) {
      return null;
    }

    return {
      decodedUrl: normalizedUrl,
      destinationUrl: normalizedUrl,
      finalUrl: normalizedUrl,
      originalUrl: normalizedUrl,
    };
  }

  return null;
}

function buildSubscriptionUrl(guestUuid: string): string {
  const baseUrl = getBe3BaseUrl();
  const searchParams = new URLSearchParams({
    guest_uuid: guestUuid,
  });

  if (!baseUrl) {
    return `${apiEndpoints.scanSubscribe}?${searchParams.toString()}`;
  }

  if (baseUrl.startsWith('/')) {
    return `${baseUrl}${apiEndpoints.scanSubscribe}?${searchParams.toString()}`;
  }

  const resolvedUrl = new URL(apiEndpoints.scanSubscribe, `${baseUrl}/`);
  resolvedUrl.search = searchParams.toString();
  return resolvedUrl.toString();
}

export function useScanSubscription({
  enabled,
  guestUuid,
  onError,
  onFinal,
  onProgress,
}: UseScanSubscriptionParams): void {
  const callbacksRef = useRef({
    onError,
    onFinal,
    onProgress,
  });

  callbacksRef.current = {
    onError,
    onFinal,
    onProgress,
  };

  useEffect(() => {
    if (!enabled || !guestUuid) {
      return;
    }

    let reconnectAttempts = 0;
    let reconnectTimerId: number | null = null;
    let inactivityTimerId: number | null = null;
    let isDisposed = false;
    let eventSource: EventSource | null = null;

    const clearTimers = () => {
      if (reconnectTimerId !== null) {
        window.clearTimeout(reconnectTimerId);
        reconnectTimerId = null;
      }

      if (inactivityTimerId !== null) {
        window.clearTimeout(inactivityTimerId);
        inactivityTimerId = null;
      }
    };

    const closeEventSource = () => {
      if (!eventSource) {
        return;
      }

      eventSource.close();
      eventSource = null;
    };

    const resetInactivityTimer = () => {
      if (inactivityTimerId !== null) {
        window.clearTimeout(inactivityTimerId);
      }

      inactivityTimerId = window.setTimeout(() => {
        scheduleReconnect('실시간 분석 연결이 지연되어 다시 연결합니다.');
      }, INACTIVITY_TIMEOUT_MS);
    };

    const handleParsedMessage = (rawData: string, eventType?: string) => {
      const parsedMessage = parseSseMessage(rawData, eventType);
      resetInactivityTimer();

      if (
        parsedMessage.type === 'progress' &&
        parsedMessage.payload &&
        typeof parsedMessage.payload === 'object'
      ) {
        callbacksRef.current.onProgress?.(parsedMessage.payload as Record<string, unknown>);
        return;
      }

      if (parsedMessage.type === 'final') {
        const finalPayload = normalizeFinalPayload(parsedMessage.payload);

        if (finalPayload) {
          callbacksRef.current.onFinal?.(finalPayload);
        }

        return;
      }

      if (parsedMessage.type === 'error') {
        callbacksRef.current.onError?.(
          typeof parsedMessage.payload === 'string'
            ? parsedMessage.payload
            : '실시간 분석 중 오류가 발생했습니다.',
        );
      }
    };

    const scheduleReconnect = (errorMessage: string) => {
      if (isDisposed) {
        return;
      }

      closeEventSource();

      if (reconnectAttempts >= getSseReconnectMax()) {
        callbacksRef.current.onError?.(errorMessage);
        clearTimers();
        return;
      }

      reconnectAttempts += 1;
      reconnectTimerId = window.setTimeout(() => {
        connect();
      }, RECONNECT_DELAY_MS * reconnectAttempts);
    };

    const connect = () => {
      if (isDisposed) {
        return;
      }

      closeEventSource();
      clearTimers();

      const nextEventSource = new EventSource(buildSubscriptionUrl(guestUuid));
      eventSource = nextEventSource;

      nextEventSource.onopen = () => {
        reconnectAttempts = 0;
        resetInactivityTimer();
      };

      nextEventSource.onmessage = (event) => {
        handleParsedMessage(event.data, 'message');
      };

      nextEventSource.onerror = () => {
        scheduleReconnect('실시간 분석 연결이 종료되었습니다. 다시 시도해 주세요.');
      };

      for (const eventName of sseEventNames) {
        nextEventSource.addEventListener(eventName, (event) => {
          if (!(event instanceof MessageEvent)) {
            return;
          }

          handleParsedMessage(event.data, eventName);
        });
      }

      resetInactivityTimer();
    };

    connect();

    return () => {
      isDisposed = true;
      clearTimers();
      closeEventSource();
    };
  }, [enabled, guestUuid]);
}
