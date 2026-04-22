import { axiosBe3 } from '@/shared/api/axios';
import { apiEndpoints } from '@/shared/api/endpoints';
import { asArray, asRecord } from '@/shared/api/responseAccess/payloadAccess';
import type { BackendHistoryItemResponse } from '@/shared/api/types';
import { useGuestStore } from '@/shared/store/guestStore';

function toHistoryItems(value: unknown): BackendHistoryItemResponse[] {
  return asArray(value)
    .map((item) => asRecord(item))
    .filter((item): item is BackendHistoryItemResponse => item !== null);
}

function resolveHistoryPayload(data: unknown): BackendHistoryItemResponse[] {
  const directItems = toHistoryItems(data);

  if (directItems.length > 0) {
    return directItems;
  }

  const dataRecord = asRecord(data);

  if (!dataRecord) {
    return [];
  }

  const nestedCandidates = [
    toHistoryItems(dataRecord.items),
    toHistoryItems(dataRecord.history),
    toHistoryItems(dataRecord.results),
    toHistoryItems(dataRecord.data),
  ];

  return nestedCandidates.find((items) => items.length > 0) ?? [];
}

export async function fetchScanHistory(): Promise<BackendHistoryItemResponse[]> {
  const guestUuid =
    useGuestStore.getState().guestUuid ?? useGuestStore.getState().ensureGuestUuid();
  const response = await axiosBe3.get(apiEndpoints.scanHistory, {
    headers: {
      guest_uuid: guestUuid,
    },
  });

  return resolveHistoryPayload(response.data);
}
