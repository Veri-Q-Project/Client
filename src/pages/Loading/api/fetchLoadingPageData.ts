import { getLoadingSteps } from '../loadingScenario';

import type {
  LoadingCaseNumber,
  LoadingPageData,
  LoadingRevealMode,
} from '../types/loadingPage.types';

const MOCK_LOADING_DELAY_MS = 120;
const DEFAULT_PROGRESS_INTERVAL_MS = 90;

function buildLoadingPageData(
  caseNumber: LoadingCaseNumber,
  revealMode: LoadingRevealMode,
): LoadingPageData {
  return {
    caseNumber,
    progressIntervalMs: DEFAULT_PROGRESS_INTERVAL_MS,
    revealMode,
    steps: getLoadingSteps(caseNumber),
  };
}

export const mockLoadingPageDataByCase: Record<LoadingCaseNumber, LoadingPageData> = {
  1: buildLoadingPageData(1, 'full'),
  2: buildLoadingPageData(2, 'full'),
  3: buildLoadingPageData(3, 'full'),
  4: buildLoadingPageData(4, 'full'),
  5: buildLoadingPageData(5, 'full'),
  6: buildLoadingPageData(6, 'full'),
  7: buildLoadingPageData(7, 'full'),
  8: buildLoadingPageData(8, 'full'),
};

export const mockSequentialLoadingPageDataByCase: Record<LoadingCaseNumber, LoadingPageData> = {
  1: buildLoadingPageData(1, 'sequential'),
  2: buildLoadingPageData(2, 'sequential'),
  3: buildLoadingPageData(3, 'sequential'),
  4: buildLoadingPageData(4, 'sequential'),
  5: buildLoadingPageData(5, 'sequential'),
  6: buildLoadingPageData(6, 'sequential'),
  7: buildLoadingPageData(7, 'sequential'),
  8: buildLoadingPageData(8, 'sequential'),
};

export async function fetchLoadingPageData(
  caseNumber: LoadingCaseNumber,
  revealMode: LoadingRevealMode,
): Promise<LoadingPageData> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_LOADING_DELAY_MS);
  });

  return getInitialLoadingPageData(caseNumber, revealMode);
}

export function getInitialLoadingPageData(
  caseNumber: LoadingCaseNumber,
  revealMode: LoadingRevealMode,
): LoadingPageData {
  return revealMode === 'sequential'
    ? mockSequentialLoadingPageDataByCase[caseNumber]
    : mockLoadingPageDataByCase[caseNumber];
}
