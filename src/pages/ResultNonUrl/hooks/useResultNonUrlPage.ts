import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';
import { showApiError } from '@/shared/lib/feedback/showApiError';
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
  const { message } = App.useApp();
  const navigate = useNavigate();
  const clearScanSession = useScanSessionStore((state) => state.clearSession);
  const resetScanProgress = useScanProgressStore((state) => state.reset);
  const [resultNonUrlPageData, setResultNonUrlPageData] = useState<ResultNonUrlPageData | null>(
    getInitialResultNonUrlPageData,
  );

  useEffect(() => {
    let isMounted = true;

    const loadResultNonUrlPageData = async () => {
      try {
        const response = await fetchResultNonUrlPageData();

        if (isMounted) {
          setResultNonUrlPageData(response);
        }
      } catch (error) {
        console.error('[ResultNonUrlPage] failed to load page data', error);

        if (error instanceof Error && error.message === 'SCAN_SESSION_REQUIRED') {
          void navigate({ to: '/' });
          return;
        }

        showApiError(message, error, '비 URL 결과를 불러오지 못했습니다.');
        void navigate({ to: '/' });
      }
    };

    void loadResultNonUrlPageData();

    return () => {
      isMounted = false;
    };
  }, [message, navigate]);

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
