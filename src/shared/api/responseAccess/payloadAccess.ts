type UnknownRecord = Record<string, unknown>;

const nestedRecordKeys = [
  'analysis',
  'certificate',
  'data',
  'detail',
  'externalApi',
  'external_api',
  'final',
  'finalResult',
  'historyItem',
  'https',
  'internalDb',
  'internal_db',
  'item',
  'ml',
  'payload',
  'redirect',
  'response',
  'result',
  'scan',
  'scanDetail',
  'scanResponse',
  'scanResult',
  'scoring',
  'serverInfo',
  'server_info',
  'shortUrl',
  'short_url',
] as const;

function pushUniqueRecord(records: UnknownRecord[], candidate: UnknownRecord | null) {
  if (!candidate || records.includes(candidate)) {
    return;
  }

  records.push(candidate);
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as UnknownRecord;
}

export function getCandidateRecords(source: unknown): UnknownRecord[] {
  const rootRecord = asRecord(source);

  if (!rootRecord) {
    return [];
  }

  const records: UnknownRecord[] = [rootRecord];

  for (let recordIndex = 0; recordIndex < records.length; recordIndex += 1) {
    const record = records[recordIndex];

    for (const nestedKey of nestedRecordKeys) {
      pushUniqueRecord(records, asRecord(record[nestedKey]));
    }
  }

  return records;
}

export function pickUnknown(source: unknown, keys: string[]): unknown {
  const records = getCandidateRecords(source);

  for (const record of records) {
    for (const key of keys) {
      const value = record[key];

      if (value !== undefined && value !== null) {
        return value;
      }
    }
  }

  return null;
}

export function pickString(source: unknown, keys: string[]): string | null {
  const value = pickUnknown(source, keys);

  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function pickNumber(source: unknown, keys: string[]): number | null {
  const value = pickUnknown(source, keys);

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (!/^[+-]?\d+(?:\.\d+)?$/u.test(trimmedValue)) {
      return null;
    }

    const parsedValue = Number(trimmedValue);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

export function pickBoolean(source: unknown, keys: string[]): boolean | null {
  const value = pickUnknown(source, keys);

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }
  }

  return null;
}

export function pickRecord(source: unknown, keys: string[]): UnknownRecord | null {
  return asRecord(pickUnknown(source, keys));
}

function pickStringArray(
  source: unknown,
  keys: string[],
  splitDelimiter?: string | null,
): string[] {
  const value = pickUnknown(source, keys);

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    if (splitDelimiter) {
      return value
        .split(splitDelimiter)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? [trimmedValue] : [];
  }

  return [];
}

export function pickSourceString(sources: unknown[], keys: string[]): string | null {
  for (const source of sources) {
    const value = pickString(source, keys);

    if (value) {
      return value;
    }
  }

  return null;
}

export function pickSourceNumber(sources: unknown[], keys: string[]): number | null {
  for (const source of sources) {
    const value = pickNumber(source, keys);

    if (value !== null) {
      return value;
    }
  }

  return null;
}

export function pickSourceRecord(sources: unknown[], keys: string[]): UnknownRecord | null {
  for (const source of sources) {
    const value = pickRecord(source, keys);

    if (value) {
      return value;
    }
  }

  return null;
}

export function pickSourceStringArray(
  sources: unknown[],
  keys: string[],
  splitDelimiter?: string | null,
): string[] {
  for (const source of sources) {
    const value = pickStringArray(source, keys, splitDelimiter);

    if (value.length > 0) {
      return value;
    }
  }

  return [];
}
