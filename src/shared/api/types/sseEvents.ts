type SseMessageType = 'error' | 'final' | 'message' | 'progress';

export type BackendSseFinalPayload = Record<string, unknown>;

type ParsedSseMessage = {
  payload: unknown;
  rawData: string;
  type: SseMessageType;
};

function parseJsonValue(rawData: string): unknown {
  const trimmedData = rawData.trim();

  if (!trimmedData) {
    return null;
  }

  if (
    (trimmedData.startsWith('{') && trimmedData.endsWith('}')) ||
    (trimmedData.startsWith('[') && trimmedData.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmedData);
    } catch {
      return trimmedData;
    }
  }

  return trimmedData;
}

function asRecord(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  return payload as Record<string, unknown>;
}

function hasAnyDefinedKey(payload: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => payload[key] !== undefined && payload[key] !== null);
}

function resolveMessageType(eventType: string | undefined, payload: unknown): SseMessageType {
  const normalizedEventType = (eventType ?? '').trim().toLowerCase();
  const payloadRecord = asRecord(payload);
  const payloadType =
    payloadRecord && typeof payloadRecord.type === 'string'
      ? payloadRecord.type.trim().toLowerCase()
      : '';
  const payloadStatus =
    payloadRecord && typeof payloadRecord.status === 'string'
      ? payloadRecord.status.trim().toLowerCase()
      : '';
  const candidateType = normalizedEventType || payloadType;

  if (candidateType === 'error' || candidateType === 'failed' || candidateType === 'failure') {
    return 'error';
  }

  if (payloadStatus === 'error' || payloadStatus === 'failed' || payloadStatus === 'failure') {
    return 'error';
  }

  if (
    payloadStatus === 'final' ||
    payloadStatus === 'result' ||
    payloadStatus === 'complete' ||
    payloadStatus === 'completed' ||
    payloadStatus === 'done'
  ) {
    return 'final';
  }

  if (
    candidateType === 'final' ||
    candidateType === 'result' ||
    candidateType === 'complete' ||
    candidateType === 'completed' ||
    candidateType === 'done'
  ) {
    return 'final';
  }

  if (
    payloadRecord &&
    hasAnyDefinedKey(payloadRecord, [
      'analysisTime',
      'analysis_time',
      'externalApi',
      'external_api',
      'https',
      'internalDb',
      'internal_db',
      'ml',
      'originalUrl',
      'original_url',
      'redirect',
      'riskLevel',
      'risk_level',
      'score',
      'scoring',
      'serverInfo',
      'server_info',
      'shortUrl',
      'short_url',
    ])
  ) {
    return 'final';
  }

  if (
    payloadRecord &&
    hasAnyDefinedKey(payloadRecord, [
      'currentStepId',
      'current_step_id',
      'step',
      'stepId',
      'step_id',
    ])
  ) {
    return 'progress';
  }

  if (
    candidateType === 'progress' ||
    candidateType === 'status' ||
    candidateType === 'step' ||
    candidateType === 'update'
  ) {
    return 'progress';
  }

  if (
    payloadRecord &&
    hasAnyDefinedKey(payloadRecord, [
      'guestUuid',
      'guest_uuid',
      'message',
      'percent',
      'progress',
      'step',
      'stepId',
      'step_id',
      'status',
    ])
  ) {
    return 'progress';
  }

  return 'message';
}

export function parseSseMessage(rawData: string, eventType?: string): ParsedSseMessage {
  const payload = parseJsonValue(rawData);

  return {
    payload,
    rawData,
    type: resolveMessageType(eventType, payload),
  };
}
