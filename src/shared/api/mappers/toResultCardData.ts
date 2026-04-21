import {
  pickSourceNumber,
  pickSourceRecord,
  pickSourceString,
} from '@/shared/api/mappers/payloadAccess';
import { resolveResultToneFromSources } from '@/shared/api/mappers/resolveResultTone';
import type { ResultSafeData } from '@/shared/api/result-safe';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ResultTone } from '@/shared/types/resultTone';

const trustScoreFallbackByTone: Record<ResultTone, number> = {
  critical: 82,
  safe: 18,
  warning: 45,
};

function clampTrustScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function toResultCardData(
  session: ScanSessionSnapshot,
  fallbackTone: ResultTone,
): ResultSafeData {
  const sources = [
    session.analysisDetail,
    session.finalResult,
    session.scanResponse,
    session.historySelection,
  ];

  const resolvedOriginalUrl =
    pickSourceString(sources, [
      'originalUrl',
      'original_url',
      'sourceUrl',
      'source_url',
      'scannedUrl',
      'scanned_url',
      'decodedUrl',
      'decoded_url',
      'url',
    ]) ??
    session.decodedUrl ??
    session.historySelection?.url ??
    '';

  const redirectRecord = pickSourceRecord(sources, ['redirect']);
  const resolvedFinalUrl =
    pickSourceString([redirectRecord], ['finalUrl', 'final_url']) ??
    pickSourceString(sources, [
      'finalUrl',
      'final_url',
      'destinationUrl',
      'destination_url',
      'visitUrl',
      'visit_url',
    ]) ??
    resolvedOriginalUrl;

  const resolvedPreviewUrl =
    pickSourceString(sources, ['previewUrl', 'preview_url']) ?? resolvedFinalUrl;
  const resolvedTone = resolveResultToneFromSources(sources, session.riskLevel) ?? fallbackTone;
  const resolvedTrustScore =
    pickSourceNumber(sources, ['trustScore', 'trust_score', 'score']) ??
    trustScoreFallbackByTone[resolvedTone];

  return {
    previewUrl: resolvedPreviewUrl,
    siteName: resolvedOriginalUrl,
    siteUrl: resolvedFinalUrl,
    trustScore: clampTrustScore(resolvedTrustScore),
    visitUrl: resolvedFinalUrl,
  };
}
