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

/**
 * Loads page data that requires an active scan session.
 * Pass stable fetch/getInitial callbacks when possible; fetchPageData is read via ref to avoid reload loops.
 */
export function useSessionGuardedPageData<T>({
  fetchPageData,
  getInitialPageData,
  loadErrorMessage,
  logMessage,
}: UseSessionGuardedPageDataOptions<T>): UseSessionGuardedPageDataReturn<T> {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const fetchPageDataRef = useRef(fetchPageData);
  const isMountedRef = useRef(false);
  const [data, setData] = useState<T | null>(getInitialPageData);

  useEffect(() => {
    fetchPageDataRef.current = fetchPageData;
  }, [fetchPageData]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const reload = useCallback(async () => {
    try {
      const response = await fetchPageDataRef.current();

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
    }
  }, [loadErrorMessage, logMessage, message, navigate]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    data,
    reload,
  };
}
