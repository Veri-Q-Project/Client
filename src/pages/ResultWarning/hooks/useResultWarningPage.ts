import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

import { openExternalLink } from '@/shared/lib/browser/openExternalLink';
import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';

import {
  fetchResultWarningPageData,
  mockResultWarningPageData,
} from '../api/fetchResultWarningPageData';

import type { ResultWarningPageData } from '../types/resultWarningPage.types';

type UseResultWarningPageReturn = {
  handleOpenVisitSite: () => void;
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleToggleReport: () => void;
  isReportOpen: boolean;
  resultWarningData: ResultWarningPageData;
};

export function useResultWarningPage(): UseResultWarningPageReturn {
  const navigate = useNavigate();
  const [resultWarningData, setResultWarningData] =
    useState<ResultWarningPageData>(mockResultWarningPageData);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadResultWarningData = async () => {
      const response = await fetchResultWarningPageData();

      if (isMounted) {
        setResultWarningData(response);
      }
    };

    void loadResultWarningData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenVisitSite = useCallback(() => {
    openExternalLink(resultWarningData.visitUrl);
  }, [resultWarningData.visitUrl]);

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
    resultWarningData,
  };
}
