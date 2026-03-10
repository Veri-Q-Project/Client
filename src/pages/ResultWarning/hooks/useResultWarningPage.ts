import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

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
    window.open(resultWarningData.visitUrl, '_blank', 'noopener,noreferrer');
  }, [resultWarningData.visitUrl]);

  const handleShareResult = useCallback(async () => {
    const shareData: ShareData = {
      title: 'Veri-Q 분석 결과',
      text: 'Veri-Q 분석 결과를 확인해 보세요.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      window.alert('결과 링크를 복사했습니다.');
    } catch {
      window.alert('현재 환경에서는 공유를 지원하지 않습니다.');
    }
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
