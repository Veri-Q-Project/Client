import { useCallback, useEffect, useState } from 'react';

import { useScanSessionStore } from '@/shared/store/scanSessionStore';

import {
  fetchScanHistoryPageData,
  getInitialScanHistoryPageData,
} from '../api/fetchScanHistoryPageData';

import type { ScanHistoryItem, ScanHistoryPageData } from '../types/scanHistoryPage.types';

type UseScanHistoryPageReturn = {
  handleSelectScanHistoryItem: (item: ScanHistoryItem) => void;
  scanHistoryPageData: ScanHistoryPageData;
};

export function useScanHistoryPage(): UseScanHistoryPageReturn {
  const setHistorySelection = useScanSessionStore((state) => state.setHistorySelection);
  const [scanHistoryPageData, setScanHistoryPageData] = useState<ScanHistoryPageData>(
    getInitialScanHistoryPageData,
  );

  useEffect(() => {
    let isMounted = true;

    const loadScanHistoryPageData = async () => {
      try {
        const response = await fetchScanHistoryPageData();

        if (isMounted) {
          setScanHistoryPageData(response);
        }
      } catch (error) {
        console.error('Failed to load scan history page data.', error);

        if (isMounted) {
          setScanHistoryPageData(getInitialScanHistoryPageData());
        }
      }
    };

    void loadScanHistoryPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectScanHistoryItem = useCallback(
    (item: ScanHistoryItem) => {
      setHistorySelection({
        riskLevel: item.status,
        scannedAt: item.scannedAt,
        url: item.url,
      });
    },
    [setHistorySelection],
  );

  return {
    handleSelectScanHistoryItem,
    scanHistoryPageData,
  };
}
