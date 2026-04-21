import type { ResultTone } from '@/shared/types/resultTone';

import { normalizeRiskLevel } from './normalizeRiskLevel';
import { pickNumber, pickSourceNumber, pickSourceString, pickString } from './payloadAccess';

const SAFE_MAX_SCORE = 29;
const WARNING_MAX_SCORE = 59;

function normalizeScore(rawScore: number | null | undefined): number | null {
  if (rawScore === null || rawScore === undefined || !Number.isFinite(rawScore)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

function resolveResultToneFromScore(rawScore: number | null | undefined): ResultTone | null {
  const score = normalizeScore(rawScore);

  if (score === null) {
    return null;
  }

  if (score <= SAFE_MAX_SCORE) {
    return 'safe';
  }

  if (score <= WARNING_MAX_SCORE) {
    return 'warning';
  }

  return 'critical';
}

export function resolveResultTone(
  rawRiskLevel: string | null | undefined,
  rawScore: number | null | undefined,
): ResultTone | null {
  return resolveResultToneFromScore(rawScore) ?? normalizeRiskLevel(rawRiskLevel);
}

export function resolveResultToneFromSource(source: unknown): ResultTone | null {
  return resolveResultTone(
    pickString(source, ['riskLevel', 'risk_level', 'status', 'result']),
    pickNumber(source, ['trustScore', 'trust_score', 'score']),
  );
}

export function resolveResultToneFromSources(
  sources: unknown[],
  fallbackTone?: ResultTone | null,
): ResultTone | null {
  return (
    resolveResultTone(
      pickSourceString(sources, ['riskLevel', 'risk_level', 'status', 'result']),
      pickSourceNumber(sources, ['trustScore', 'trust_score', 'score']),
    ) ??
    fallbackTone ??
    null
  );
}
