import type { ResultTone } from '@/shared/types/resultTone';

const normalizedRiskLevelMap: Record<string, ResultTone> = {
  clean: 'safe',
  critical: 'critical',
  danger: 'critical',
  high: 'critical',
  low: 'safe',
  malicious: 'critical',
  medium: 'warning',
  normal: 'safe',
  safe: 'safe',
  suspicious: 'warning',
  unsafe: 'critical',
  warning: 'warning',
};

export function normalizeRiskLevel(rawRiskLevel: string | null | undefined): ResultTone | null {
  if (!rawRiskLevel) {
    return null;
  }

  const normalizedKey = rawRiskLevel
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '');
  return normalizedRiskLevelMap[normalizedKey] ?? null;
}
