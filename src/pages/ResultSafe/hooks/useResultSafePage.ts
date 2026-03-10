import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

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
    window.open(resultSafeData.visitUrl, '_blank', 'noopener,noreferrer');
  }, [resultSafeData.visitUrl]);

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
    resultSafeData,
  };
}
