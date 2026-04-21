import { createResultPageFetcher } from '@/shared/api/createResultPageFetcher';

export const {
  fetchResultPageData: fetchResultSafePageData,
  getInitialResultPageData: getInitialResultSafePageData,
} = createResultPageFetcher('safe');
