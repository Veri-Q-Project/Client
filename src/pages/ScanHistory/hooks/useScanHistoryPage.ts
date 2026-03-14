import { useEffect, useState } from 'react';

import {
  fetchScanHistoryPageData,
  getInitialScanHistoryPageData,
} from '../api/fetchScanHistoryPageData';

import type { ScanHistoryPageData } from '../types/scanHistoryPage.types';

type UseScanHistoryPageReturn = {
  scanHistoryPageData: ScanHistoryPageData;
};

export function useScanHistoryPage(): UseScanHistoryPageReturn {
  const [scanHistoryPageData, setScanHistoryPageData] = useState<ScanHistoryPageData>(
    getInitialScanHistoryPageData,
  );

  useEffect(() => {
    let isMounted = true;

    const loadScanHistoryPageData = async () => {
      const response = await fetchScanHistoryPageData();

      if (isMounted) {
        setScanHistoryPageData(response);
      }
    };

    void loadScanHistoryPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    scanHistoryPageData,
  };
}
