import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchScanDetail } from '@/shared/api/fetchScanDetail';

import { fetchScanHistory } from './fetchScanHistory';
import { fetchRecentScanHistoryData, fetchScanHistoryData } from './fetchScanHistoryData';

vi.mock('./fetchScanHistory', () => ({
  fetchScanHistory: vi.fn(),
}));

vi.mock('@/shared/api/fetchScanDetail', () => ({
  fetchScanDetail: vi.fn(),
}));

vi.mock('@/shared/store/guestStore', () => ({
  useGuestStore: {
    getState: () => ({
      ensureGuestUuid: () => 'guest-1',
      guestUuid: 'guest-1',
    }),
  },
}));

const mockedFetchScanHistory = vi.mocked(fetchScanHistory);
const mockedFetchScanDetail = vi.mocked(fetchScanDetail);

function waitForBackgroundTasks(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe('fetchScanHistoryData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns recent history immediately and enriches risk labels in the background', async () => {
    mockedFetchScanHistory.mockResolvedValue([
      {
        isUrl: true,
        riskLevel: 'SUSPICIOUS',
        scannedAt: '2026-06-03T09:00:00',
        schemeType: 'URL',
        typeInfo: 'https://testsafebrowsing.appspot.com/s/phishing.html',
      },
    ]);
    mockedFetchScanDetail.mockResolvedValue({
      riskLevel: 'danger',
      score: 88,
    });
    const onItemsEnriched = vi.fn();

    const data = await fetchRecentScanHistoryData({
      onItemsEnriched,
    });

    expect(data.items[0]?.status).toBe('warning');

    await waitForBackgroundTasks();

    expect(onItemsEnriched).toHaveBeenCalledWith([
      expect.objectContaining({
        status: 'critical',
      }),
    ]);
  });

  it('keeps the history risk label when detail enrichment fails', async () => {
    mockedFetchScanHistory.mockResolvedValue([
      {
        isUrl: true,
        riskLevel: 'SUSPICIOUS',
        scannedAt: '2026-06-03T09:00:00',
        schemeType: 'URL',
        typeInfo: 'https://example.com',
      },
    ]);
    mockedFetchScanDetail.mockRejectedValue(new Error('detail unavailable'));
    const onItemsEnriched = vi.fn();

    const data = await fetchRecentScanHistoryData({
      onItemsEnriched,
    });

    expect(data.items[0]?.status).toBe('warning');

    await waitForBackgroundTasks();

    expect(onItemsEnriched).not.toHaveBeenCalled();
  });

  it('does not call detail enrichment for the full history list by default', async () => {
    mockedFetchScanHistory.mockResolvedValue([
      {
        isUrl: true,
        riskLevel: 'SUSPICIOUS',
        scannedAt: '2026-06-03T09:00:00',
        schemeType: 'URL',
        typeInfo: 'https://example.com',
      },
    ]);

    const data = await fetchScanHistoryData();

    expect(data.items[0]?.status).toBe('warning');
    expect(mockedFetchScanDetail).not.toHaveBeenCalled();
  });
});
