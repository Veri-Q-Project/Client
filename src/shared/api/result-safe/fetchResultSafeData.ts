export type ResultSafeData = {
  previewUrl: string;
  siteName: string;
  siteUrl: string;
  trustScore: number;
  visitUrl: string;
};

export const mockResultSafeData: ResultSafeData = {
  previewUrl: 'https://www.example-safe-site.com/preview',
  siteName: 'Example Safe Site',
  siteUrl: 'https://www.example-safe-site.com',
  trustScore: 90,
  visitUrl: 'https://www.example-safe-site.com',
};

export async function fetchResultSafeData(): Promise<ResultSafeData> {
  // TODO: Replace this mock return with real API integration.
  return Promise.resolve(mockResultSafeData);
}
