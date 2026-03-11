import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';

import {
  fetchResultCriticalPageData,
  mockResultCriticalPageData,
} from '../api/fetchResultCriticalPageData';

import type { ResultCriticalPageData } from '../types/resultCriticalPage.types';

type UseResultCriticalPageReturn = {
  handleBlockAccess: () => void;
  handleReport: () => void;
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleToggleReport: () => void;
  isReportOpen: boolean;
  resultCriticalData: ResultCriticalPageData;
};

export function useResultCriticalPage(): UseResultCriticalPageReturn {
  const navigate = useNavigate();
  const [resultCriticalData, setResultCriticalData] = useState<ResultCriticalPageData>(
    mockResultCriticalPageData,
  );
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadResultCriticalData = async () => {
      const response = await fetchResultCriticalPageData();

      if (isMounted) {
        setResultCriticalData(response);
      }
    };

    void loadResultCriticalData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBlockAccess = useCallback(() => {
    window.alert('위험 사이트 접속을 차단했습니다.');
  }, []);

  const handleReport = useCallback(() => {
    window.alert('신고가 접수되었습니다. 빠르게 확인하겠습니다.');
  }, []);

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
    handleBlockAccess,
    handleReport,
    handleRescan,
    handleShareResult,
    handleToggleReport,
    isReportOpen,
    resultCriticalData,
  };
}
