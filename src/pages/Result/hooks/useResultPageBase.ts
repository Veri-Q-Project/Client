import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';
import { useSessionGuardedPageData } from '@/shared/lib/page/useSessionGuardedPageData';
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
  const navigate = useNavigate();
  const clearScanSession = useScanSessionStore((state) => state.clearSession);
  const resetScanProgress = useScanProgressStore((state) => state.reset);
  const { data: resultData } = useSessionGuardedPageData({
    fetchPageData,
    getInitialPageData,
    loadErrorMessage,
    logMessage: 'Failed to load result page data.',
  });

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
