import { fetchScanHistory } from '@/shared/api/fetchScanHistory';
import {
  buildHistoryItemId,
  pickHistoryRiskLevel,
  pickHistoryScannedAt,
  pickHistoryTargetValue,
  resolveHistoryTimestamp,
} from '@/shared/api/mappers/historyItemAccess';
import { useGuestStore } from '@/shared/store/guestStore';

import type { ScanListPageData } from '../types/scanListPage.types';

const maxRecentScanListItemCount = 5;

function getRecentHistoryItems(items: unknown[]): unknown[] {
  return [...items]
    .sort((previousItem, nextItem) => {
      return (
        resolveHistoryTimestamp(pickHistoryScannedAt(nextItem)) -
        resolveHistoryTimestamp(pickHistoryScannedAt(previousItem))
      );
    })
    .slice(0, maxRecentScanListItemCount);
}

function resolveScanListUuid(): string {
  return useGuestStore.getState().guestUuid ?? useGuestStore.getState().ensureGuestUuid();
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

export async function fetchScanListPageData(): Promise<ScanListPageData> {
  const uuid = resolveScanListUuid();
  const items = await fetchScanHistory();

  return {
    items: getRecentHistoryItems(items).map((item, index) => ({
      id: buildHistoryItemId(item, index),
      scannedAt: formatScannedAt(pickHistoryScannedAt(item)),
      status: pickHistoryRiskLevel(item) ?? 'warning',
      url: pickHistoryTargetValue(item) ?? 'URL 정보 없음',
    })),
    uuid,
  };
}

export function getInitialScanListPageData(uuid = resolveScanListUuid()): ScanListPageData {
  return {
    items: [],
    uuid,
  };
}
