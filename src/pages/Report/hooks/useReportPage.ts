import { useEffect, useState } from 'react';

import { fetchReportPageData, getInitialReportPageData } from '../api/fetchReportPageData';

import type { ReportPageData } from '../types/reportPage.types';

type UseReportPageReturn = {
  reportPageData: ReportPageData;
};

export function useReportPage(): UseReportPageReturn {
  const [reportPageData, setReportPageData] = useState<ReportPageData>(getInitialReportPageData);

  useEffect(() => {
    let isMounted = true;

    const loadReportPageData = async () => {
      const response = await fetchReportPageData();

      if (isMounted) {
        setReportPageData(response);
      }
    };

    void loadReportPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    reportPageData,
  };
}
