import { useCallback, useEffect, useState } from 'react';

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
};

const DEFAULT_LOADING_CASE: LoadingCaseNumber = 6;
const AVAILABLE_LOADING_CASES: LoadingCaseNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

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

export function useLoadingPage(): UseLoadingPageReturn {
  const [loadingCaseNumber, setLoadingCaseNumber] = useState<LoadingCaseNumber>(
    resolveInitialLoadingCaseNumber,
  );
  const [revealMode, setRevealMode] = useState<LoadingRevealMode>('full');
  const [scenarioVersion, setScenarioVersion] = useState(0);
  const [loadingPageData, setLoadingPageData] = useState<LoadingPageData>(() =>
    getInitialLoadingPageData(resolveInitialLoadingCaseNumber(), 'full'),
  );

  useEffect(() => {
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
  }, [loadingCaseNumber, revealMode, scenarioVersion]);

  const handleCaseChange = useCallback((caseNumber: LoadingCaseNumber) => {
    setLoadingCaseNumber(caseNumber);
    setRevealMode('full');
    setScenarioVersion((prev) => prev + 1);
    updateCaseSearchParam(caseNumber);
  }, []);

  const handleRandomCaseChange = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_LOADING_CASES.length);
    const randomCase = AVAILABLE_LOADING_CASES[randomIndex];

    handleCaseChange(randomCase);
  }, [handleCaseChange]);

  const handleSequentialDemoStart = useCallback(() => {
    setRevealMode('sequential');
    setScenarioVersion((prev) => prev + 1);
  }, []);

  const isSequentialDemoMode = revealMode === 'sequential';

  return {
    handleCaseChange,
    handleRandomCaseChange,
    handleSequentialDemoStart,
    isSequentialDemoMode,
    loadingCaseNumber,
    loadingPageData,
  };
}
