import { fetchScanDetail } from '@/shared/api/fetchScanDetail';
import { resolveResultToneFromSource } from '@/shared/api/risk/resolveResultTone';
import { isWebScanTarget } from '@/shared/lib/scan-session/scanClassification';
import { useGuestStore } from '@/shared/store/guestStore';

import { fetchScanHistory } from './fetchScanHistory';
import {
  buildHistoryItemId,
  normalizeHistoryTimestampValue,
  pickHistoryIsUrl,
  pickHistoryRiskLevel,
  pickHistoryScannedAt,
  pickHistorySchemeType,
  pickHistoryTargetValue,
  resolveHistoryTimestamp,
} from '../lib/historyItemAccess';

import type { ScanHistoryData, ScanHistoryItem } from '../types/scanHistory.types';

const maxRecentScanHistoryItemCount = 5;

type FetchScanHistoryDataOptions = {
  enrichRiskFromDetail?: boolean;
  limit?: number;
  onItemsEnriched?: (items: ScanHistoryItem[]) => void;
};

type HistoryItemWithTargetValue = {
  item: unknown;
  targetValue: string;
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

function getItemsWithTargetValue(items: unknown[]): HistoryItemWithTargetValue[] {
  return items.flatMap((item) => {
    const targetValue = pickHistoryTargetValue(item);

    return targetValue ? [{ item, targetValue }] : [];
  });
}

function applyItemLimit<T>(items: T[], limit?: number): T[] {
  if (limit === undefined) {
    return items;
  }

  return items.slice(0, Math.max(0, limit));
}

function formatScannedAt(rawScannedAt: string | null): string {
  if (!rawScannedAt) {
    return '날짜 정보 없음';
  }

  const parsedDate = new Date(normalizeHistoryTimestampValue(rawScannedAt));

  if (Number.isNaN(parsedDate.getTime())) {
    return rawScannedAt;
  }

  const year = parsedDate.getFullYear();
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, '0');
  const day = `${parsedDate.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
}

async function resolveDetailRiskLevel(item: ScanHistoryItem): Promise<ScanHistoryItem['status']> {
  if (!isWebScanTarget(item)) {
    return item.status;
  }

  try {
    const detail = await fetchScanDetail(item.url);
    return resolveResultToneFromSource(detail) ?? item.status;
  } catch {
    return item.status;
  }
}

async function enrichHistoryItemRiskLevel(item: ScanHistoryItem): Promise<ScanHistoryItem> {
  const status = await resolveDetailRiskLevel(item);

  if (status === item.status) {
    return item;
  }

  return {
    ...item,
    status,
  };
}

function startHistoryItemRiskEnrichment(
  historyItems: ScanHistoryItem[],
  onItemsEnriched: (items: ScanHistoryItem[]) => void,
): void {
  setTimeout(() => {
    void Promise.allSettled(historyItems.map((item) => enrichHistoryItemRiskLevel(item))).then(
      (results) => {
        const enrichedItemsById = new Map<string, ScanHistoryItem>();

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            enrichedItemsById.set(historyItems[index].id, result.value);
          }
        });

        const enrichedHistoryItems = historyItems.map(
          (item) => enrichedItemsById.get(item.id) ?? item,
        );
        const hasStatusUpdate = enrichedHistoryItems.some(
          (item, index) => item !== historyItems[index],
        );

        if (hasStatusUpdate) {
          onItemsEnriched(enrichedHistoryItems);
        }
      },
    );
  }, 0);
}

export async function fetchScanHistoryData(
  options: FetchScanHistoryDataOptions = {},
): Promise<ScanHistoryData> {
  const uuid = resolveScanHistoryUuid();
  const items = await fetchScanHistory();
  const visibleItems = applyItemLimit(
    getItemsWithTargetValue(getSortedHistoryItems(items)),
    options.limit,
  );

  const historyItems: ScanHistoryItem[] = visibleItems.map(({ item, targetValue }, index) => {
    return {
      id: buildHistoryItemId(item, index),
      isUrl: pickHistoryIsUrl(item),
      scannedAt: formatScannedAt(pickHistoryScannedAt(item)),
      schemeType: pickHistorySchemeType(item),
      status: pickHistoryRiskLevel(item) ?? 'warning',
      url: targetValue,
    };
  });
  if (options.enrichRiskFromDetail && options.onItemsEnriched) {
    startHistoryItemRiskEnrichment(historyItems, options.onItemsEnriched);
  }

  return {
    items: historyItems,
    uuid,
  };
}

export async function fetchRecentScanHistoryData(
  options: Pick<FetchScanHistoryDataOptions, 'onItemsEnriched'> = {},
): Promise<ScanHistoryData> {
  return fetchScanHistoryData({
    enrichRiskFromDetail: true,
    limit: maxRecentScanHistoryItemCount,
    onItemsEnriched: options.onItemsEnriched,
  });
}

export function getInitialScanHistoryData(uuid = resolveScanHistoryUuid()): ScanHistoryData {
  return {
    items: [],
    uuid,
  };
}
