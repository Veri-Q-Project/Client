import { fetchResultSafeData, mockResultSafeData } from '@/shared/api/result-safe';

import type { ResultSafePageData } from '../types/resultSafePage.types';

export async function fetchResultSafePageData(): Promise<ResultSafePageData> {
  return fetchResultSafeData();
}

export function getInitialResultSafePageData(): ResultSafePageData {
  return mockResultSafeData;
}
