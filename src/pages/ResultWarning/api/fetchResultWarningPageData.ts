import { createResultPageFetcher } from '@/shared/api/createResultPageFetcher';

export const {
  fetchResultPageData: fetchResultWarningPageData,
  getInitialResultPageData: getInitialResultWarningPageData,
} = createResultPageFetcher('warning');
