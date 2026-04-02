import { useEffect, useState } from 'react';

import {
  defaultScanListUuid,
  fetchScanListPageData,
  getInitialScanListPageData,
} from '../api/fetchScanListPageData';

import type { ScanListPageData } from '../types/scanListPage.types';

type UseScanListPageReturn = {
  scanListPageData: ScanListPageData;
  scanListUuid: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function resolveInitialScanListUuid() {
  if (typeof window === 'undefined') {
    return defaultScanListUuid;
  }

  const uuidParam = new URLSearchParams(window.location.search).get('uuid')?.trim();

  if (uuidParam && isUuid(uuidParam)) {
    return uuidParam;
  }

  return defaultScanListUuid;
}

function updateUuidSearchParam(uuid: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('uuid', uuid);

  const nextSearch = searchParams.toString();
  const nextUrl = nextSearch
    ? `${window.location.pathname}?${nextSearch}`
    : window.location.pathname;

  window.history.replaceState(null, '', nextUrl);
}

export function useScanListPage(): UseScanListPageReturn {
  const [scanListUuid] = useState(resolveInitialScanListUuid);
  const [scanListPageData, setScanListPageData] = useState<ScanListPageData>(() =>
    getInitialScanListPageData(resolveInitialScanListUuid()),
  );

  useEffect(() => {
    updateUuidSearchParam(scanListUuid);

    let isMounted = true;

    const loadScanListPageData = async () => {
      const response = await fetchScanListPageData(scanListUuid);

      if (isMounted) {
        setScanListPageData(response);
      }
    };

    void loadScanListPageData();

    return () => {
      isMounted = false;
    };
  }, [scanListUuid]);

  return {
    scanListPageData,
    scanListUuid,
  };
}
