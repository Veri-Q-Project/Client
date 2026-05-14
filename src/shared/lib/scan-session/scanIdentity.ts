import { pickString } from '@/shared/api/responseAccess/payloadAccess';

export function resolveScanIdentifier(source: unknown): string | null {
  return pickString(source, ['scanId', 'scan_id', 'id']);
}

export function isSameScanSource(left: unknown, right: unknown): boolean {
  const leftId = resolveScanIdentifier(left);
  const rightId = resolveScanIdentifier(right);

  return Boolean(leftId && rightId && leftId === rightId);
}
