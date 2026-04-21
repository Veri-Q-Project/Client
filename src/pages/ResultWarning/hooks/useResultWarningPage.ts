import { App } from 'antd';
import { useCallback } from 'react';

import type { ResultSafeData } from '@/shared/api/result-safe';
import { openExternalLink } from '@/shared/lib/browser/openExternalLink';
import { useResultPageBase } from '@/shared/ui/resultPage';

import {
  fetchResultWarningPageData,
  getInitialResultWarningPageData,
} from '../api/fetchResultWarningPageData';

type UseResultWarningPageReturn = {
  handleOpenVisitSite: () => void;
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleViewReport: () => void;
  resultWarningData: ResultSafeData | null;
};

export function useResultWarningPage(): UseResultWarningPageReturn {
  const { modal } = App.useApp();
  const { handleRescan, handleShareResult, handleViewReport, resultData } = useResultPageBase({
    fetchPageData: fetchResultWarningPageData,
    getInitialPageData: getInitialResultWarningPageData,
    loadErrorMessage: '주의 결과를 불러오지 못했습니다.',
  });

  const handleOpenVisitSite = useCallback(() => {
    if (!resultData) {
      return;
    }

    modal.confirm({
      cancelText: '취소',
      centered: true,
      content: '주의가 필요한 사이트입니다. 그래도 방문하시겠습니까?',
      okText: '방문하기',
      title: '주의 사이트 방문',
      onOk: () => {
        openExternalLink(resultData.visitUrl);
      },
    });
  }, [modal, resultData]);

  return {
    handleOpenVisitSite,
    handleRescan,
    handleShareResult,
    handleViewReport,
    resultWarningData: resultData,
  };
}
