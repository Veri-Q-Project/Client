import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import { useSessionGuardedPageData } from '@/shared/lib/page/useSessionGuardedPageData';
import { useScanProgressStore } from '@/shared/store/scanProgressStore';
import { useScanSessionStore } from '@/shared/store/scanSessionStore';

import { fetchReportPageData, getInitialReportPageData } from '../api/fetchReportPageData';

import type { ReportPageData } from '../types/reportPage.types';

type UseReportPageReturn = {
  handleRescan: () => void;
  reportPageData: ReportPageData | null;
};

export function useReportPage(): UseReportPageReturn {
  const navigate = useNavigate();
  const clearScanSession = useScanSessionStore((state) => state.clearSession);
  const resetScanProgress = useScanProgressStore((state) => state.reset);
  const { data: reportPageData } = useSessionGuardedPageData({
    fetchPageData: fetchReportPageData,
    getInitialPageData: getInitialReportPageData,
    loadErrorMessage: '상세 리포트를 불러오지 못했습니다.',
    logMessage: 'Failed to load report page data.',
  });

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
