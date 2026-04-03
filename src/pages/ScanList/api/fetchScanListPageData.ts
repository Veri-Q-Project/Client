import type { ScanListPageData } from '../types/scanListPage.types';

export const defaultScanListUuid = '550e8400-e29b-41d4-a716-446655440000';
const maxRecentScanListItemCount = 5;

function resolveScannedAtTimestamp(scannedAt: string) {
  const normalizedScannedAt = scannedAt.replace(/\./g, '-');
  const parsedTimestamp = Date.parse(normalizedScannedAt);

  if (Number.isNaN(parsedTimestamp)) {
    return 0;
  }

  return parsedTimestamp;
}

function buildRecentScanListPageData(pageData: ScanListPageData): ScanListPageData {
  const recentItems = [...pageData.items]
    .sort((previousItem, nextItem) => {
      return (
        resolveScannedAtTimestamp(nextItem.scannedAt) -
        resolveScannedAtTimestamp(previousItem.scannedAt)
      );
    })
    .slice(0, maxRecentScanListItemCount);

  return {
    ...pageData,
    items: recentItems,
  };
}

const mockScanListPageDataByUuid: Record<string, ScanListPageData> = {
  [defaultScanListUuid]: {
    uuid: defaultScanListUuid,
    items: [
      {
        id: '0d6db9a1-4a87-4a62-bc54-8f8af98eb6c1',
        scannedAt: '2026.01.13',
        status: 'safe',
        url: 'https://www.naver.com',
      },
      {
        id: '5d695db5-bd3f-4d57-a88c-ef8c7b8038f0',
        scannedAt: '2025.12.15',
        status: 'safe',
        url: 'https://www.google.com',
      },
      {
        id: 'c97a4156-48f6-47a4-b7c2-2dcd7256190e',
        scannedAt: '2025.11.23',
        status: 'critical',
        url: 'https://www.youtube.com',
      },
      {
        id: '3c6baf44-1f4b-4fb1-835a-7365fe5f16b8',
        scannedAt: '2025.10.23',
        status: 'warning',
        url: 'https://www.daum.net',
      },
      {
        id: '8ea1aa3d-af6d-4f28-bad4-aa1b1f58094d',
        scannedAt: '2025.10.12',
        status: 'warning',
        url: 'https://www.apple.com',
      },
      {
        id: '20d9c8f4-b94d-4878-8bc8-6d0a7df65b4c',
        scannedAt: '2025.09.18',
        status: 'safe',
        url: 'https://www.microsoft.com',
      },
    ],
  },
  '17b8a3a8-4ae1-4b2c-8a61-9f5f3fce3d77': {
    uuid: '17b8a3a8-4ae1-4b2c-8a61-9f5f3fce3d77',
    items: [
      {
        id: '0328f6ae-f146-4862-886a-1e5f4c5c908d',
        scannedAt: '2026.02.21',
        status: 'safe',
        url: 'https://openai.com',
      },
      {
        id: '947d0d5f-d87c-4816-a835-12eb3245c135',
        scannedAt: '2026.02.17',
        status: 'warning',
        url: 'https://example-warning-site.com',
      },
      {
        id: '82c0cb52-c9a6-47a5-8bd6-bf5c66843115',
        scannedAt: '2026.02.02',
        status: 'critical',
        url: 'https://example-critical-site.com',
      },
    ],
  },
};

export async function fetchScanListPageData(uuid: string): Promise<ScanListPageData> {
  const pageData = mockScanListPageDataByUuid[uuid];

  if (pageData) {
    return Promise.resolve(buildRecentScanListPageData(pageData));
  }

  return Promise.resolve({
    items: [],
    uuid,
  });
}

export function getInitialScanListPageData(uuid: string): ScanListPageData {
  return buildRecentScanListPageData(
    mockScanListPageDataByUuid[uuid] ?? {
      items: [],
      uuid,
    },
  );
}
