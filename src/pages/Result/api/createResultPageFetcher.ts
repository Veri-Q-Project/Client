import { isApiError } from '@/shared/api/errors/apiError';
import {
  ensureScanDetail,
  resolveRequestedUrlFromSearch,
} from '@/shared/lib/scan-session/ensureScanDetail';
import { getScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';
import type { ResultTone } from '@/shared/types/resultTone';

import { toResultPageData } from '../lib/toResultPageData';

import type { ResultPageData } from '../types/resultPage.types';

type ResultPageFetcher = {
  fetchResultPageData: () => Promise<ResultPageData>;
  getInitialResultPageData: () => ResultPageData | null;
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
  async function fetchResultPageData(): Promise<ResultPageData> {
    const session = getScanSessionSnapshot();
    const hasRecoverableUrl = Boolean(
      session.decodedUrl || session.historySelection?.url || resolveRequestedUrlFromSearch(),
    );

    if (!session.analysisDetail && hasRecoverableUrl) {
      try {
        const detailSession = await ensureScanDetail();
        return toResultPageData(detailSession, tone);
      } catch (error) {
        if (isApiError(error) && error.statusCode === 404 && hasSessionResult(session)) {
          return toResultPageData(session, tone);
        }

        throw error;
      }
    }

    if (hasSessionResult(session)) {
      return toResultPageData(session, tone);
    }

    throw new Error('SCAN_SESSION_REQUIRED');
  }

  function getInitialResultPageData(): ResultPageData | null {
    const session = getScanSessionSnapshot();

    if (hasSessionResult(session)) {
      return toResultPageData(session, tone);
    }

    return null;
  }

  return { fetchResultPageData, getInitialResultPageData };
}
