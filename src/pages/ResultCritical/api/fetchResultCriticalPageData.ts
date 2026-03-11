import type { ResultCriticalPageData } from '../types/resultCriticalPage.types';

export const mockResultCriticalPageData: ResultCriticalPageData = {
  previewUrl: 'https://www.example-critical-site.com/preview',
  siteName: 'Example Critical Site',
  siteUrl: 'https://www.example-critical-site.com',
  trustScore: 24,
  visitUrl: 'https://www.example-critical-site.com',
};

export async function fetchResultCriticalPageData(): Promise<ResultCriticalPageData> {
  // TODO: Replace this mock return with real API integration.
  return Promise.resolve(mockResultCriticalPageData);
}
