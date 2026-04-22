import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';
import { useCallback, useEffect, useRef } from 'react';

import { isApiError } from '@/shared/api/errors/apiError';
import { pickNumber, pickString } from '@/shared/api/responseAccess/payloadAccess';
import { resolveResultToneFromSources } from '@/shared/api/risk/resolveResultTone';
import { mapSseStepId } from '@/shared/api/sse/sseStepMapper';
import { ensureScanDetail } from '@/shared/lib/scan-session/ensureScanDetail';
import { useScanSubscription } from '@/shared/lib/sse/useScanSubscription';
import { useGuestStore } from '@/shared/store/guestStore';
import { useScanProgressStore } from '@/shared/store/scanProgressStore';
import { getScanSessionSnapshot, useScanSessionStore } from '@/shared/store/scanSessionStore';

import { getLoadingSteps } from '../loadingScenario';

import type { LoadingPageData } from '../types/loadingPage.types';

type UseLoadingPageReturn = {
  loadingPageData: LoadingPageData;
};

const DETAIL_RETRY_DELAY_MS = 2_000;
const DETAIL_RETRY_MAX = 60;
const DETAIL_POLL_START_DELAY_MS = 5_000;
const DEFAULT_LOADING_PAGE_DATA: LoadingPageData = {
  steps: getLoadingSteps(),
};

function openResultRouteForCurrentSession() {
  const session = getScanSessionSnapshot();

  if (
    session.isUrl === false ||
    (session.schemeType && session.schemeType.trim().toUpperCase() !== 'WEB')
  ) {
    window.location.assign('/result/non-url');
    return;
  }

  const riskLevel =
    resolveResultToneFromSources(
      [session.analysisDetail, session.finalResult, session.scanResponse, session.historySelection],
      session.riskLevel,
    ) ?? 'warning';
  const routeByRiskLevel = {
    critical: '/result/critical',
    safe: '/result/safe',
    warning: '/result/warning',
  } as const;
  const route = routeByRiskLevel[riskLevel];

  if (session.decodedUrl) {
    window.location.assign(`${route}?url=${encodeURIComponent(session.decodedUrl)}`);
    return;
  }

  window.location.assign(route);
}

export function useLoadingPage(): UseLoadingPageReturn {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const guestUuid = useGuestStore((state) => state.guestUuid);
  const finalResult = useScanSessionStore((state) => state.finalResult);
  const scanResponse = useScanSessionStore((state) => state.scanResponse);
  const setFinalResult = useScanSessionStore((state) => state.setFinalResult);
  const resetProgress = useScanProgressStore((state) => state.reset);
  const setCompleted = useScanProgressStore((state) => state.setCompleted);
  const setConnecting = useScanProgressStore((state) => state.setConnecting);
  const setError = useScanProgressStore((state) => state.setError);
  const updateFromProgressEvent = useScanProgressStore((state) => state.updateFromProgressEvent);
  const detailResolutionStartedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!scanResponse && !finalResult) {
      void navigate({ to: '/' });
      return;
    }

    resetProgress();
    detailResolutionStartedRef.current = false;
    setConnecting();
  }, [finalResult, navigate, resetProgress, scanResponse, setConnecting]);

  const resolveDetailAndOpenResult = useCallback(async () => {
    if (detailResolutionStartedRef.current) {
      return false;
    }

    detailResolutionStartedRef.current = true;

    for (let attempt = 0; attempt < DETAIL_RETRY_MAX; attempt += 1) {
      try {
        await ensureScanDetail();

        if (!isMountedRef.current) {
          return false;
        }

        setCompleted();
        openResultRouteForCurrentSession();
        return true;
      } catch (error) {
        if (!isMountedRef.current) {
          return false;
        }

        if (error instanceof Error && error.message === 'SCAN_SESSION_REQUIRED') {
          detailResolutionStartedRef.current = false;
          return false;
        }

        if (!isApiError(error) || error.statusCode !== 404) {
          detailResolutionStartedRef.current = false;
          return false;
        }

        await new Promise<void>((resolve) => {
          window.setTimeout(() => resolve(), DETAIL_RETRY_DELAY_MS);
        });
      }
    }

    detailResolutionStartedRef.current = false;
    return false;
  }, [setCompleted]);

  const tryResolveDetailAfterTerminalProgress = useCallback(
    async (payload: Record<string, unknown>) => {
      const rawStatus = pickString(payload, ['status', 'state'])?.trim().toLowerCase();
      const rawStep = pickString(payload, [
        'currentStepId',
        'current_step_id',
        'step',
        'stepId',
        'step_id',
      ]);
      const mappedStepId = mapSseStepId(rawStep);
      const isTerminalStep =
        mappedStepId === 'riskScore' || mappedStepId === 'report' || mappedStepId === 'completed';

      if (rawStatus !== 'completed' || !isTerminalStep) {
        return;
      }

      await resolveDetailAndOpenResult();
    },
    [resolveDetailAndOpenResult],
  );

  useEffect(() => {
    if (finalResult || !scanResponse) {
      return;
    }

    const session = getScanSessionSnapshot();

    if (!session.decodedUrl && !session.historySelection?.url) {
      return;
    }

    let isDisposed = false;
    let pollTimerId: number | null = null;

    const startPolling = async () => {
      if (isDisposed || detailResolutionStartedRef.current) {
        return;
      }

      const isResolved = await resolveDetailAndOpenResult();

      if (isDisposed || isResolved) {
        return;
      }

      pollTimerId = window.setTimeout(() => {
        void startPolling();
      }, DETAIL_POLL_START_DELAY_MS);
    };

    pollTimerId = window.setTimeout(() => {
      void startPolling();
    }, DETAIL_POLL_START_DELAY_MS);

    return () => {
      isDisposed = true;

      if (pollTimerId !== null) {
        window.clearTimeout(pollTimerId);
      }
    };
  }, [finalResult, resolveDetailAndOpenResult, scanResponse]);

  useScanSubscription({
    enabled: Boolean(guestUuid) && Boolean(scanResponse || finalResult),
    guestUuid,
    onError: (errorMessage) => {
      setError(errorMessage);
      message.error(errorMessage);
    },
    onFinal: async (payload) => {
      setFinalResult(payload);

      const hasResolvedRiskLevel =
        Boolean(pickString(payload, ['riskLevel', 'risk_level', 'status', 'result'])) ||
        pickNumber(payload, ['trustScore', 'trust_score', 'score']) !== null;

      if (!hasResolvedRiskLevel) {
        const isResolved = await resolveDetailAndOpenResult();

        if (isResolved) {
          return;
        }
      }

      detailResolutionStartedRef.current = true;
      setCompleted();
      openResultRouteForCurrentSession();
    },
    onProgress: (payload) => {
      updateFromProgressEvent(payload);
      void tryResolveDetailAfterTerminalProgress(payload);
    },
  });

  return {
    loadingPageData: DEFAULT_LOADING_PAGE_DATA,
  };
}
