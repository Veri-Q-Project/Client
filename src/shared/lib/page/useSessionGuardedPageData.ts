import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

import { showApiError } from '@/shared/lib/feedback/showApiError';

type UseSessionGuardedPageDataOptions<T> = {
  fetchPageData: () => Promise<T>;
  getInitialPageData: () => T | null;
  loadErrorMessage: string;
  logMessage: string;
};

type UseSessionGuardedPageDataReturn<T> = {
  data: T | null;
  reload: () => Promise<void>;
};

export function useSessionGuardedPageData<T>({
  fetchPageData,
  getInitialPageData,
  loadErrorMessage,
  logMessage,
}: UseSessionGuardedPageDataOptions<T>): UseSessionGuardedPageDataReturn<T> {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const isMountedRef = useRef(false);
  const [data, setData] = useState<T | null>(getInitialPageData);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const reload = useCallback(async () => {
    try {
      const response = await fetchPageData();

      if (isMountedRef.current) {
        setData(response);
      }
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      console.error(logMessage, error);

      if (error instanceof Error && error.message === 'SCAN_SESSION_REQUIRED') {
        void navigate({ to: '/' });
        return;
      }

      showApiError(message, error, loadErrorMessage);
      void navigate({ to: '/' });
    }
  }, [fetchPageData, loadErrorMessage, logMessage, message, navigate]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    data,
    reload,
  };
}
