import { createResultPageFetcher } from '@/shared/api/createResultPageFetcher';

export const {
  fetchResultPageData: fetchResultCriticalPageData,
  getInitialResultPageData: getInitialResultCriticalPageData,
} = createResultPageFetcher('critical');
