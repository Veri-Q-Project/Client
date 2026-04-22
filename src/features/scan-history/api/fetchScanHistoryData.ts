import { useGuestStore } from '@/shared/store/guestStore';

import { fetchScanHistory } from './fetchScanHistory';
import {
  buildHistoryItemId,
  pickHistoryRiskLevel,
  pickHistoryScannedAt,
  pickHistoryTargetValue,
  resolveHistoryTimestamp,
} from '../lib/historyItemAccess';

import type { ScanHistoryData } from '../types/scanHistory.types';

const maxRecentScanHistoryItemCount = 5;

type FetchScanHistoryDataOptions = {
  limit?: number;
};

function resolveScanHistoryUuid(): string {
  return useGuestStore.getState().guestUuid ?? useGuestStore.getState().ensureGuestUuid();
}

function getSortedHistoryItems(items: unknown[]): unknown[] {
  return [...items].sort((previousItem, nextItem) => {
    return (
      resolveHistoryTimestamp(pickHistoryScannedAt(nextItem)) -
      resolveHistoryTimestamp(pickHistoryScannedAt(previousItem))
    );
  });
}

function applyItemLimit(items: unknown[], limit?: number): unknown[] {
  if (limit === undefined) {
    return items;
  }

  return items.slice(0, Math.max(0, limit));
}

function formatScannedAt(rawScannedAt: string | null): string {
  if (!rawScannedAt) {
    return '날짜 정보 없음';
  }

  const parsedDate = new Date(rawScannedAt.replace(' ', 'T'));

  if (Number.isNaN(parsedDate.getTime())) {
    return rawScannedAt;
  }

  const year = parsedDate.getFullYear();
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, '0');
  const day = `${parsedDate.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
}

export async function fetchScanHistoryData(
  options: FetchScanHistoryDataOptions = {},
): Promise<ScanHistoryData> {
  const uuid = resolveScanHistoryUuid();
  const items = await fetchScanHistory();
  const visibleItems = applyItemLimit(getSortedHistoryItems(items), options.limit);

  return {
    items: visibleItems.map((item, index) => ({
      id: buildHistoryItemId(item, index),
      scannedAt: formatScannedAt(pickHistoryScannedAt(item)),
      status: pickHistoryRiskLevel(item) ?? 'warning',
      url: pickHistoryTargetValue(item) ?? 'URL 정보 없음',
    })),
    uuid,
  };
}

export async function fetchRecentScanHistoryData(): Promise<ScanHistoryData> {
  return fetchScanHistoryData({
    limit: maxRecentScanHistoryItemCount,
  });
}

export function getInitialScanHistoryData(uuid = resolveScanHistoryUuid()): ScanHistoryData {
  return {
    items: [],
    uuid,
  };
}
