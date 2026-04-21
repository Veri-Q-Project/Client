import { useCallback, useEffect, useState } from 'react';

import { useGuestStore } from '@/shared/store/guestStore';
import { useScanSessionStore } from '@/shared/store/scanSessionStore';

import { fetchScanListPageData, getInitialScanListPageData } from '../api/fetchScanListPageData';

import type { ScanListItem, ScanListPageData } from '../types/scanListPage.types';

type UseScanListPageReturn = {
  handleSelectScanResult: (item: ScanListItem) => void;
  scanListPageData: ScanListPageData;
  scanListUuid: string;
};

export function useScanListPage(): UseScanListPageReturn {
  const guestUuid =
    useGuestStore((state) => state.guestUuid) ?? useGuestStore.getState().ensureGuestUuid();
  const setHistorySelection = useScanSessionStore((state) => state.setHistorySelection);
  const [scanListPageData, setScanListPageData] = useState<ScanListPageData>(() =>
    getInitialScanListPageData(guestUuid),
  );

  useEffect(() => {
    let isMounted = true;

    const loadScanListPageData = async () => {
      try {
        const response = await fetchScanListPageData();

        if (isMounted) {
          setScanListPageData(response);
        }
      } catch (error) {
        console.error('Failed to load scan list page data.', error);

        if (isMounted) {
          setScanListPageData(getInitialScanListPageData(guestUuid));
        }
      }
    };

    void loadScanListPageData();

    return () => {
      isMounted = false;
    };
  }, [guestUuid]);

  const handleSelectScanResult = useCallback(
    (item: ScanListItem) => {
      setHistorySelection({
        riskLevel: item.status,
        scannedAt: item.scannedAt,
        url: item.url,
      });
    },
    [setHistorySelection],
  );

  return {
    handleSelectScanResult,
    scanListPageData,
    scanListUuid: guestUuid,
  };
}
