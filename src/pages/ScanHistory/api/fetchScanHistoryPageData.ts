import { fetchScanHistory } from '@/shared/api/fetchScanHistory';
import {
  buildHistoryItemId,
  pickHistoryRiskLevel,
  pickHistoryScannedAt,
  pickHistoryTargetValue,
  pickHistoryTitle,
} from '@/shared/api/mappers/historyItemAccess';

import type { ScanHistoryPageData } from '../types/scanHistoryPage.types';

const emptyScanHistoryPageData: ScanHistoryPageData = {
  items: [],
};

function resolveHostname(targetValue: string): string | null {
  const candidates = [targetValue, `https://${targetValue}`];

  for (const candidate of candidates) {
    try {
      return new URL(candidate).hostname;
    } catch {
      continue;
    }
  }

  return null;
}

function resolveHistoryTitle(item: unknown, targetValue: string, index: number): string {
  const explicitTitle = pickHistoryTitle(item);

  if (explicitTitle) {
    return explicitTitle;
  }

  return resolveHostname(targetValue) ?? `스캔 결과 ${index + 1}`;
}

export async function fetchScanHistoryPageData(): Promise<ScanHistoryPageData> {
  const items = await fetchScanHistory();

  return {
    items: items.map((item, index) => {
      const url = pickHistoryTargetValue(item) ?? 'URL 정보 없음';

      return {
        id: buildHistoryItemId(item, index),
        scannedAt: pickHistoryScannedAt(item) ?? '날짜 정보 없음',
        status: pickHistoryRiskLevel(item) ?? 'warning',
        title: resolveHistoryTitle(item, url, index),
        url,
      };
    }),
  };
}

export function getInitialScanHistoryPageData(): ScanHistoryPageData {
  return emptyScanHistoryPageData;
}
