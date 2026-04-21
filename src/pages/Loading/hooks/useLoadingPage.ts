import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

import { isMockApiEnabled } from '@/shared/api/apiConfig';
import { ensureScanDetail } from '@/shared/api/ensureScanDetail';
import { isApiError } from '@/shared/api/errors/apiError';
import { pickNumber, pickString } from '@/shared/api/mappers/payloadAccess';
import { resolveResultToneFromSources } from '@/shared/api/mappers/resolveResultTone';
import { mapSseStepId } from '@/shared/api/mappers/sseStepMapper';
import { useScanSubscription } from '@/shared/lib/sse/useScanSubscription';
import { useGuestStore } from '@/shared/store/guestStore';
import { useScanProgressStore } from '@/shared/store/scanProgressStore';
import { getScanSessionSnapshot, useScanSessionStore } from '@/shared/store/scanSessionStore';

import { fetchLoadingPageData, getInitialLoadingPageData } from '../api/fetchLoadingPageData';
import { isLoadingCaseNumber } from '../loadingScenario';

import type {
  LoadingCaseNumber,
  LoadingPageData,
  LoadingRevealMode,
} from '../types/loadingPage.types';

type UseLoadingPageReturn = {
  handleCaseChange: (caseNumber: LoadingCaseNumber) => void;
  handleRandomCaseChange: () => void;
  handleSequentialDemoStart: () => void;
  isSequentialDemoMode: boolean;
  loadingCaseNumber: LoadingCaseNumber;
  loadingPageData: LoadingPageData;
  showCaseControls: boolean;
  useMockProgressDemo: boolean;
};

const DEFAULT_LOADING_CASE: LoadingCaseNumber = 6;
const AVAILABLE_LOADING_CASES: LoadingCaseNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];
const DETAIL_RETRY_DELAY_MS = 2_000;
const DETAIL_RETRY_MAX = 60;
const DETAIL_POLL_START_DELAY_MS = 5_000;

function resolveInitialLoadingCaseNumber() {
  if (typeof window === 'undefined') {
    return DEFAULT_LOADING_CASE;
  }

  const caseParam = Number(new URLSearchParams(window.location.search).get('case'));

  if (isLoadingCaseNumber(caseParam)) {
    return caseParam;
  }

  return DEFAULT_LOADING_CASE;
}

function updateCaseSearchParam(caseNumber: LoadingCaseNumber) {
  if (typeof window === 'undefined') {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('case', String(caseNumber));

  const nextSearch = searchParams.toString();
  const nextUrl = nextSearch
    ? `${window.location.pathname}?${nextSearch}`
    : window.location.pathname;

  window.history.replaceState(null, '', nextUrl);
}

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
  const useMockProgressDemo = isMockApiEnabled();
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
  const [loadingCaseNumber, setLoadingCaseNumber] = useState<LoadingCaseNumber>(
    resolveInitialLoadingCaseNumber,
  );
  const [revealMode, setRevealMode] = useState<LoadingRevealMode>('full');
  const [scenarioVersion, setScenarioVersion] = useState(0);
  const [loadingPageData, setLoadingPageData] = useState<LoadingPageData>(() =>
    useMockProgressDemo
      ? getInitialLoadingPageData(resolveInitialLoadingCaseNumber(), 'full')
      : getInitialLoadingPageData(DEFAULT_LOADING_CASE, 'sequential'),
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!useMockProgressDemo) {
      setLoadingPageData(getInitialLoadingPageData(DEFAULT_LOADING_CASE, 'sequential'));
      return;
    }

    const fallbackData = getInitialLoadingPageData(loadingCaseNumber, revealMode);

    setLoadingPageData(fallbackData);

    let isMounted = true;

    const loadLoadingPageData = async () => {
      try {
        const response = await fetchLoadingPageData(loadingCaseNumber, revealMode);

        if (isMounted) {
          setLoadingPageData(response);
        }
      } catch (error) {
        console.error('Failed to load loading page data.', error);

        if (isMounted) {
          setLoadingPageData(fallbackData);
        }
      }
    };

    void loadLoadingPageData();

    return () => {
      isMounted = false;
    };
  }, [loadingCaseNumber, revealMode, scenarioVersion, useMockProgressDemo]);

  useEffect(() => {
    if (useMockProgressDemo) {
      return;
    }

    if (!scanResponse && !finalResult) {
      void navigate({ to: '/' });
      return;
    }

    resetProgress();
    detailResolutionStartedRef.current = false;
    setConnecting();
  }, [finalResult, navigate, resetProgress, scanResponse, setConnecting, useMockProgressDemo]);

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
    if (useMockProgressDemo || finalResult || !scanResponse) {
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
  }, [finalResult, resolveDetailAndOpenResult, scanResponse, useMockProgressDemo]);

  useScanSubscription({
    enabled: !useMockProgressDemo && Boolean(guestUuid) && Boolean(scanResponse || finalResult),
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

  const handleCaseChange = useCallback(
    (caseNumber: LoadingCaseNumber) => {
      if (!useMockProgressDemo) {
        return;
      }

      setLoadingCaseNumber(caseNumber);
      setRevealMode('full');
      setScenarioVersion((prev) => prev + 1);
      updateCaseSearchParam(caseNumber);
    },
    [useMockProgressDemo],
  );

  const handleRandomCaseChange = useCallback(() => {
    if (!useMockProgressDemo) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * AVAILABLE_LOADING_CASES.length);
    const randomCase = AVAILABLE_LOADING_CASES[randomIndex];

    handleCaseChange(randomCase);
  }, [handleCaseChange, useMockProgressDemo]);

  const handleSequentialDemoStart = useCallback(() => {
    if (!useMockProgressDemo) {
      return;
    }

    setRevealMode('sequential');
    setScenarioVersion((prev) => prev + 1);
  }, [useMockProgressDemo]);

  const isSequentialDemoMode = useMockProgressDemo ? revealMode === 'sequential' : true;

  return {
    handleCaseChange,
    handleRandomCaseChange,
    handleSequentialDemoStart,
    isSequentialDemoMode,
    loadingCaseNumber: useMockProgressDemo ? loadingCaseNumber : DEFAULT_LOADING_CASE,
    loadingPageData,
    showCaseControls: useMockProgressDemo,
    useMockProgressDemo,
  };
}
