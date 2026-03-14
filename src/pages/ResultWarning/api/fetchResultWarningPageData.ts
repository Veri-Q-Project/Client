import type { ResultWarningPageData } from '../types/resultWarningPage.types';

export const mockResultWarningPageData: ResultWarningPageData = {
  previewUrl: 'https://www.example-warning-site.com/preview',
  siteName: 'Example Warning Site',
  siteUrl: 'https://www.example-warning-site.com',
  trustScore: 68,
  visitUrl: 'https://www.example-warning-site.com',
};

export async function fetchResultWarningPageData(): Promise<ResultWarningPageData> {
  // TODO: Replace this mock return with real API integration.
  return Promise.resolve(mockResultWarningPageData);
}

export function getInitialResultWarningPageData(): ResultWarningPageData {
  return mockResultWarningPageData;
}
