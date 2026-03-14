import type { ScanHistoryPageData } from '../types/scanHistoryPage.types';

export const mockScanHistoryPageData: ScanHistoryPageData = {
  items: [
    {
      id: 'scan-1',
      scannedAt: '2026-03-14 13:40',
      status: 'safe',
      title: '공식 이벤트 안내 페이지',
      url: 'https://www.example-safe-site.com',
    },
    {
      id: 'scan-2',
      scannedAt: '2026-03-14 12:10',
      status: 'warning',
      title: '주의가 필요한 리다이렉트 페이지',
      url: 'https://www.example-warning-site.com',
    },
    {
      id: 'scan-3',
      scannedAt: '2026-03-14 09:55',
      status: 'critical',
      title: '악성 코드 의심 페이지',
      url: 'https://www.example-critical-site.com',
    },
  ],
};

export async function fetchScanHistoryPageData(): Promise<ScanHistoryPageData> {
  return Promise.resolve(mockScanHistoryPageData);
}

export function getInitialScanHistoryPageData(): ScanHistoryPageData {
  return mockScanHistoryPageData;
}
