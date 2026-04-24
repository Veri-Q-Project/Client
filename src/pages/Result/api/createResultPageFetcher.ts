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

function resolveRecoverableUrl(session: ScanSessionSnapshot): string | null {
  return session.decodedUrl ?? session.historySelection?.url ?? resolveRequestedUrlFromSearch();
}

function createDetailUnavailableResultPageData(url: string): ResultPageData {
  return {
    detailUnavailable: true,
    previewUrl: url,
    siteMeta: '상세 분석 데이터를 찾지 못했습니다. 잠시 후 다시 시도하거나 다시 검사해 주세요.',
    siteName: url,
    siteUrl: url,
    trustScore: 0,
    visitUrl: url,
  };
}

export function createResultPageFetcher(tone: ResultTone): ResultPageFetcher {
  async function fetchResultPageData(): Promise<ResultPageData> {
    const session = getScanSessionSnapshot();
    const recoverableUrl = resolveRecoverableUrl(session);
    const hasRecoverableUrl = Boolean(recoverableUrl);

    if (!session.analysisDetail && hasRecoverableUrl) {
      try {
        const detailSession = await ensureScanDetail();
        return toResultPageData(detailSession, tone);
      } catch (error) {
        if (isApiError(error) && error.statusCode === 404) {
          if (hasSessionResult(session)) {
            return toResultPageData(session, tone);
          }

          return createDetailUnavailableResultPageData(recoverableUrl ?? '');
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
