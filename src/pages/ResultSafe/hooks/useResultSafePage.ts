import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

import { openExternalLink } from '@/shared/lib/browser/openExternalLink';
import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';

import {
  fetchResultSafePageData,
  getInitialResultSafePageData,
} from '../api/fetchResultSafePageData';

import type { ResultSafePageData } from '../types/resultSafePage.types';

type UseResultSafePageReturn = {
  handleOpenVisitSite: () => void;
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleToggleReport: () => void;
  isReportOpen: boolean;
  resultSafeData: ResultSafePageData;
};

export function useResultSafePage(): UseResultSafePageReturn {
  const navigate = useNavigate();
  const [resultSafeData, setResultSafeData] = useState<ResultSafePageData>(
    getInitialResultSafePageData,
  );
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadResultSafeData = async () => {
      const response = await fetchResultSafePageData();

      if (isMounted) {
        setResultSafeData(response);
      }
    };

    void loadResultSafeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenVisitSite = useCallback(() => {
    openExternalLink(resultSafeData.visitUrl);
  }, [resultSafeData.visitUrl]);

  const handleShareResult = useCallback(async () => {
    await shareCurrentPage({
      text: 'Veri-Q 분석 결과를 확인해 보세요.',
      title: 'Veri-Q 분석 결과',
    });
  }, []);

  const handleRescan = useCallback(() => {
    void navigate({ to: '/' });
  }, [navigate]);

  const handleToggleReport = useCallback(() => {
    setIsReportOpen((prev) => !prev);
  }, []);

  return {
    handleOpenVisitSite,
    handleRescan,
    handleShareResult,
    handleToggleReport,
    isReportOpen,
    resultSafeData,
  };
}
