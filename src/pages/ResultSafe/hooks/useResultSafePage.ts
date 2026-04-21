import { useCallback } from 'react';

import type { ResultSafeData } from '@/shared/api/result-safe';
import { openExternalLink } from '@/shared/lib/browser/openExternalLink';
import { useResultPageBase } from '@/shared/ui/resultPage';

import {
  fetchResultSafePageData,
  getInitialResultSafePageData,
} from '../api/fetchResultSafePageData';

type UseResultSafePageReturn = {
  handleOpenVisitSite: () => void;
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleViewReport: () => void;
  resultSafeData: ResultSafeData | null;
};

export function useResultSafePage(): UseResultSafePageReturn {
  const { handleRescan, handleShareResult, handleViewReport, resultData } = useResultPageBase({
    fetchPageData: fetchResultSafePageData,
    getInitialPageData: getInitialResultSafePageData,
    loadErrorMessage: '안전 결과를 불러오지 못했습니다.',
  });

  const handleOpenVisitSite = useCallback(() => {
    if (!resultData) {
      return;
    }

    openExternalLink(resultData.visitUrl);
  }, [resultData]);

  return {
    handleOpenVisitSite,
    handleRescan,
    handleShareResult,
    handleViewReport,
    resultSafeData: resultData,
  };
}
