import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';

import {
  fetchResultNonUrlPageData,
  getInitialResultNonUrlPageData,
} from '../api/fetchResultNonUrlPageData';

import type { ResultNonUrlPageData } from '../types/resultNonUrlPage.types';

type UseResultNonUrlPageReturn = {
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  resultNonUrlPageData: ResultNonUrlPageData;
};

export function useResultNonUrlPage(): UseResultNonUrlPageReturn {
  const navigate = useNavigate();
  const [resultNonUrlPageData, setResultNonUrlPageData] = useState<ResultNonUrlPageData>(
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
      }
    };

    void loadResultNonUrlPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRescan = useCallback(() => {
    void navigate({ to: '/' });
  }, [navigate]);

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
