import { pickSourceRecord } from '@/shared/api/responseAccess/payloadAccess';
import { resolveResultToneFromSources } from '@/shared/api/risk/resolveResultTone';
import {
  resolveScanUrls,
  type ResolvedScanUrls,
} from '@/shared/lib/scan-session/scanUrlResolution';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ResultTone } from '@/shared/types/resultTone';

export type ReportPageDataContext = {
  domainComparisonRecord: Record<string, unknown> | null;
  internalDbRecord: Record<string, unknown> | null;
  reputationRecord: Record<string, unknown> | null;
  riskLevel: ResultTone;
  serverInfoRecord: Record<string, unknown> | null;
  sources: unknown[];
  urls: ResolvedScanUrls;
};

export function getReportSessionSources(session: ScanSessionSnapshot): unknown[] {
  return [
    session.analysisDetail,
    session.finalResult,
    session.scanResponse,
    session.historySelection,
  ];
}

export function createReportPageDataContext(session: ScanSessionSnapshot): ReportPageDataContext {
  const sources = getReportSessionSources(session);
  const riskLevel = resolveResultToneFromSources(sources, session.riskLevel) ?? 'warning';
  const urls = resolveScanUrls({
    decodedUrl: session.decodedUrl,
    historyScannedAt: session.historySelection?.scannedAt,
    historyUrl: session.historySelection?.url,
    sources,
  });

  return {
    domainComparisonRecord: pickSourceRecord(sources, ['domainComparison', 'domain_compare']),
    internalDbRecord: pickSourceRecord(sources, ['internalDb', 'internal_db']),
    reputationRecord: pickSourceRecord(sources, [
      'reputation',
      'reputationSummary',
      'externalApi',
      'external_api',
    ]),
    riskLevel,
    serverInfoRecord: pickSourceRecord(sources, ['serverInfo', 'server_info']),
    sources,
    urls,
  };
}
