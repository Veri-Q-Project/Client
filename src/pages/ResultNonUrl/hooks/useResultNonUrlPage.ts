import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';
import { useSessionGuardedPageData } from '@/shared/lib/page/useSessionGuardedPageData';
import { useScanProgressStore } from '@/shared/store/scanProgressStore';
import { useScanSessionStore } from '@/shared/store/scanSessionStore';

import {
  fetchResultNonUrlPageData,
  getInitialResultNonUrlPageData,
} from '../api/fetchResultNonUrlPageData';

import type { ResultNonUrlPageData } from '../types/resultNonUrlPage.types';

type UseResultNonUrlPageReturn = {
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  resultNonUrlPageData: ResultNonUrlPageData | null;
};

export function useResultNonUrlPage(): UseResultNonUrlPageReturn {
  const navigate = useNavigate();
  const clearScanSession = useScanSessionStore((state) => state.clearSession);
  const resetScanProgress = useScanProgressStore((state) => state.reset);
  const { data: resultNonUrlPageData } = useSessionGuardedPageData({
    fetchPageData: fetchResultNonUrlPageData,
    getInitialPageData: getInitialResultNonUrlPageData,
    loadErrorMessage: '비 URL 결과를 불러오지 못했습니다.',
    logMessage: '[ResultNonUrlPage] failed to load page data',
  });

  const handleRescan = useCallback(() => {
    clearScanSession();
    resetScanProgress();
    void navigate({ to: '/' });
  }, [clearScanSession, navigate, resetScanProgress]);

  const handleShareResult = useCallback(async () => {
    await shareCurrentPage({
      text: 'Veri-Q 비 URL 분석 결과를 확인해 보세요.',
      title: 'Veri-Q 비 URL 분석 결과',
    });
  }, []);

  return {
    handleRescan,
    handleShareResult,
    resultNonUrlPageData,
  };
}
