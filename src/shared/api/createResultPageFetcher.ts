import { ensureScanDetail, resolveRequestedUrlFromSearch } from '@/shared/api/ensureScanDetail';
import { toResultCardData } from '@/shared/api/mappers/toResultCardData';
import type { ResultSafeData } from '@/shared/api/result-safe';
import { getScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ResultTone } from '@/shared/types/resultTone';

type ResultPageFetcher = {
  fetchResultPageData: () => Promise<ResultSafeData>;
  getInitialResultPageData: () => ResultSafeData | null;
};

function hasSessionResult(session: ScanSessionSnapshot): boolean {
  return Boolean(
    session.analysisDetail ||
    session.finalResult ||
    session.scanResponse ||
    session.historySelection,
  );
}

export function createResultPageFetcher(tone: ResultTone): ResultPageFetcher {
  async function fetchResultPageData(): Promise<ResultSafeData> {
    const session = getScanSessionSnapshot();
    const hasRecoverableUrl = Boolean(
      session.decodedUrl || session.historySelection?.url || resolveRequestedUrlFromSearch(),
    );

    if (!session.analysisDetail && hasRecoverableUrl) {
      const detailSession = await ensureScanDetail();
      return toResultCardData(detailSession, tone);
    }

    if (hasSessionResult(session)) {
      return toResultCardData(session, tone);
    }

    throw new Error('SCAN_SESSION_REQUIRED');
  }

  function getInitialResultPageData(): ResultSafeData | null {
    const session = getScanSessionSnapshot();

    if (hasSessionResult(session)) {
      return toResultCardData(session, tone);
    }

    return null;
  }

  return { fetchResultPageData, getInitialResultPageData };
}
