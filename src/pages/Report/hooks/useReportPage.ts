import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { showApiError } from '@/shared/lib/feedback/showApiError';
import { useScanProgressStore } from '@/shared/store/scanProgressStore';
import { useScanSessionStore } from '@/shared/store/scanSessionStore';

import { fetchReportPageData, getInitialReportPageData } from '../api/fetchReportPageData';

import type { ReportPageData } from '../types/reportPage.types';

type UseReportPageReturn = {
  handleRescan: () => void;
  reportPageData: ReportPageData | null;
};

export function useReportPage(): UseReportPageReturn {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const clearScanSession = useScanSessionStore((state) => state.clearSession);
  const resetScanProgress = useScanProgressStore((state) => state.reset);
  const [reportPageData, setReportPageData] = useState<ReportPageData | null>(
    getInitialReportPageData,
  );

  useEffect(() => {
    let isMounted = true;

    const loadReportPageData = async () => {
      try {
        const response = await fetchReportPageData();

        if (isMounted) {
          setReportPageData(response);
        }
      } catch (error) {
        console.error('Failed to load report page data.', error);

        if (error instanceof Error && error.message === 'SCAN_SESSION_REQUIRED') {
          void navigate({ to: '/' });
          return;
        }

        showApiError(message, error, '상세 리포트를 불러오지 못했습니다.');
        void navigate({ to: '/' });
      }
    };

    void loadReportPageData();

    return () => {
      isMounted = false;
    };
  }, [message, navigate]);

  const handleRescan = useCallback(() => {
    clearScanSession();
    resetScanProgress();
    void navigate({ to: '/' });
  }, [clearScanSession, navigate, resetScanProgress]);

  return {
    handleRescan,
    reportPageData,
  };
}
