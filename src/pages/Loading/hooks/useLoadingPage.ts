import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';
import { useCallback, useEffect, useRef } from 'react';

import { resolveResultToneFromSources } from '@/shared/api/risk/resolveResultTone';
import { showApiError } from '@/shared/lib/feedback/showApiError';
import { ensureScanDetail } from '@/shared/lib/scan-session/ensureScanDetail';
import { isSameScanSource } from '@/shared/lib/scan-session/scanIdentity';
import { resolveScanResultRoute } from '@/shared/lib/scan-session/scanResultRoute';
import { useScanSubscription } from '@/shared/lib/sse/useScanSubscription';
import { useGuestStore } from '@/shared/store/guestStore';
import { useScanProgressStore } from '@/shared/store/scanProgressStore';
import { getScanSessionSnapshot, useScanSessionStore } from '@/shared/store/scanSessionStore';

import { submitScanUrl } from '@/features/scan-url/api/submitScanUrl';
import { isCaptchaRequiredUploadError } from '@/features/scan-url/api/uploadErrors';

import { startLoadingDetailPolling } from '../lib/loadingDetailPolling';
import {
  DETAIL_RESOLUTION_TIMEOUT_MESSAGE,
  resolveLoadingDetailWithRetry,
} from '../lib/loadingDetailResolution';
import { shouldResolveDetailAfterTerminalProgress } from '../lib/loadingProgressResolution';
import { getLoadingSteps } from '../loadingScenario';

import type { LoadingPageData } from '../types/loadingPage.types';

type UseLoadingPageReturn = {
  loadingPageData: LoadingPageData;
};

const DEFAULT_LOADING_PAGE_DATA: LoadingPageData = {
  steps: getLoadingSteps(),
};

function openResultRouteForCurrentSession() {
  // Keep a full reload here so lazy result pages initialize from the persisted scan session and URL query after SSE completion.
  window.location.assign(resolveScanResultRoute(getScanSessionSnapshot()).href);
}

export function useLoadingPage(): UseLoadingPageReturn {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const guestUuid = useGuestStore((state) => state.guestUuid);
  const finalResult = useScanSessionStore((state) => state.finalResult);
  const pendingTextScanUrl = useScanSessionStore((state) => state.pendingTextScanUrl);
  const scanResponse = useScanSessionStore((state) => state.scanResponse);
  const clearPendingTextScanUrl = useScanSessionStore((state) => state.clearPendingTextScanUrl);
  const setFinalResult = useScanSessionStore((state) => state.setFinalResult);
  const setScanResponse = useScanSessionStore((state) => state.setScanResponse);
  const resetProgress = useScanProgressStore((state) => state.reset);
  const setCompleted = useScanProgressStore((state) => state.setCompleted);
  const setConnecting = useScanProgressStore((state) => state.setConnecting);
  const setError = useScanProgressStore((state) => state.setError);
  const updateFromProgressEvent = useScanProgressStore((state) => state.updateFromProgressEvent);
  const detailResolutionFailedRef = useRef(false);
  const detailResolutionStartedRef = useRef(false);
  const isMountedRef = useRef(true);
  const submittedTextScanUrlRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!pendingTextScanUrl && !scanResponse && !finalResult) {
      void navigate({ to: '/' });
      return;
    }

    if (finalResult && scanResponse && isSameScanSource(finalResult, scanResponse)) {
      return;
    }

    resetProgress();
    detailResolutionFailedRef.current = false;
    detailResolutionStartedRef.current = false;
    setConnecting();
  }, [finalResult, navigate, pendingTextScanUrl, resetProgress, scanResponse, setConnecting]);

  const failDetailResolution = useCallback(
    (errorMessage: string) => {
      if (detailResolutionFailedRef.current) {
        return;
      }

      detailResolutionFailedRef.current = true;
      detailResolutionStartedRef.current = true;
      setError(errorMessage);
      message.error(errorMessage);
    },
    [message, setError],
  );

  const resolveDetailAndOpenResult = useCallback(async () => {
    if (detailResolutionStartedRef.current || detailResolutionFailedRef.current) {
      return false;
    }

    detailResolutionStartedRef.current = true;

    const resolutionStatus = await resolveLoadingDetailWithRetry({
      ensureDetail: ensureScanDetail,
      isActive: () => isMountedRef.current,
      onFailure: failDetailResolution,
      onResolved: () => {
        setCompleted();
        openResultRouteForCurrentSession();
      },
    });

    if (resolutionStatus === 'session-required') {
      detailResolutionStartedRef.current = false;
    }

    return resolutionStatus === 'resolved';
  }, [failDetailResolution, setCompleted]);

  const tryResolveDetailAfterTerminalProgress = useCallback(
    async (payload: Record<string, unknown>) => {
      if (!shouldResolveDetailAfterTerminalProgress(payload)) {
        return;
      }

      try {
        await resolveDetailAndOpenResult();
      } catch {
        return;
      }
    },
    [resolveDetailAndOpenResult],
  );

  const submitPendingTextScan = useCallback(() => {
    if (!pendingTextScanUrl || submittedTextScanUrlRef.current === pendingTextScanUrl) {
      return;
    }

    submittedTextScanUrlRef.current = pendingTextScanUrl;

    void submitScanUrl({
      url: pendingTextScanUrl,
    })
      .then((nextScanResponse) => {
        setScanResponse(nextScanResponse);
        clearPendingTextScanUrl();
        message.success('URL 분석을 시작했습니다.');
      })
      .catch((error) => {
        clearPendingTextScanUrl();
        submittedTextScanUrlRef.current = null;

        if (isCaptchaRequiredUploadError(error)) {
          message.warning('요청 횟수를 초과했습니다. 캡차 인증 후 다시 검사해 주세요.');
          void navigate({ to: '/captcha' });
          return;
        }

        console.error('Failed to submit URL scan.', error);
        setError('URL 분석 요청에 실패했습니다.');
        showApiError(message, error, 'URL 분석 요청에 실패했습니다.');
      });
  }, [clearPendingTextScanUrl, message, navigate, pendingTextScanUrl, setError, setScanResponse]);

  useEffect(() => {
    if (finalResult || !scanResponse) {
      return;
    }

    const session = getScanSessionSnapshot();

    if (!session.decodedUrl && !session.historySelection?.url) {
      return;
    }

    return startLoadingDetailPolling({
      canPoll: () => !detailResolutionFailedRef.current && !detailResolutionStartedRef.current,
      onTimeout: () => failDetailResolution(DETAIL_RESOLUTION_TIMEOUT_MESSAGE),
      resolveDetail: resolveDetailAndOpenResult,
    });
  }, [failDetailResolution, finalResult, resolveDetailAndOpenResult, scanResponse]);

  useScanSubscription({
    enabled: Boolean(guestUuid) && Boolean(pendingTextScanUrl || scanResponse || finalResult),
    guestUuid,
    onError: (errorMessage) => {
      setError(errorMessage);
      message.error(errorMessage);
    },
    onFinal: async (payload) => {
      setFinalResult(payload);

      const hasResolvedRiskLevel = resolveResultToneFromSources([payload], null) !== null;

      if (!hasResolvedRiskLevel) {
        try {
          await resolveDetailAndOpenResult();
        } catch {
          return;
        }

        return;
      }

      detailResolutionStartedRef.current = true;
      setCompleted();
      openResultRouteForCurrentSession();
    },
    onOpen: submitPendingTextScan,
    onProgress: (payload) => {
      updateFromProgressEvent(payload);
      void tryResolveDetailAfterTerminalProgress(payload);
    },
  });

  return {
    loadingPageData: DEFAULT_LOADING_PAGE_DATA,
  };
}
