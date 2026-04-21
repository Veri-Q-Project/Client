import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';
import { showApiError } from '@/shared/lib/feedback/showApiError';
import { useScanProgressStore } from '@/shared/store/scanProgressStore';
import { useScanSessionStore } from '@/shared/store/scanSessionStore';

type UseResultPageBaseOptions<T> = {
  fetchPageData: () => Promise<T>;
  getInitialPageData: () => T | null;
  loadErrorMessage: string;
};

type UseResultPageBaseReturn<T> = {
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleViewReport: () => void;
  resultData: T | null;
};

export function useResultPageBase<T>({
  fetchPageData,
  getInitialPageData,
  loadErrorMessage,
}: UseResultPageBaseOptions<T>): UseResultPageBaseReturn<T> {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const clearScanSession = useScanSessionStore((state) => state.clearSession);
  const resetScanProgress = useScanProgressStore((state) => state.reset);
  const [resultData, setResultData] = useState<T | null>(getInitialPageData);

  useEffect(() => {
    let isMounted = true;

    const loadResultData = async () => {
      try {
        const response = await fetchPageData();

        if (isMounted) {
          setResultData(response);
        }
      } catch (error) {
        console.error('Failed to load result page data.', error);

        if (error instanceof Error && error.message === 'SCAN_SESSION_REQUIRED') {
          void navigate({ to: '/' });
          return;
        }

        showApiError(message, error, loadErrorMessage);
        void navigate({ to: '/' });
      }
    };

    void loadResultData();

    return () => {
      isMounted = false;
    };
  }, [fetchPageData, loadErrorMessage, message, navigate]);

  const handleShareResult = useCallback(async () => {
    await shareCurrentPage({
      text: 'Veri-Q 분석 결과를 확인해 보세요.',
      title: 'Veri-Q 분석 결과',
    });
  }, []);

  const handleRescan = useCallback(() => {
    clearScanSession();
    resetScanProgress();
    void navigate({ to: '/' });
  }, [clearScanSession, navigate, resetScanProgress]);

  const handleViewReport = useCallback(() => {
    void navigate({ to: '/report' });
  }, [navigate]);

  return {
    handleRescan,
    handleShareResult,
    handleViewReport,
    resultData,
  };
}
