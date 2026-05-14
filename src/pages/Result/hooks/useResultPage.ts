import { App } from 'antd';
import { useCallback } from 'react';

import { openExternalLink } from '@/shared/lib/browser/openExternalLink';
import type { ResultTone } from '@/shared/types/resultTone';

import { useResultPageBase } from './useResultPageBase';
import { createResultPageFetcher } from '../api/createResultPageFetcher';

import type { ResultPageData } from '../types/resultPage.types';

const resultPageFetcherByTone = {
  critical: createResultPageFetcher('critical'),
  safe: createResultPageFetcher('safe'),
  warning: createResultPageFetcher('warning'),
} as const;

const loadErrorMessageByTone: Record<ResultTone, string> = {
  critical: '위험 결과를 불러오지 못했습니다.',
  safe: '안전 결과를 불러오지 못했습니다.',
  warning: '주의 결과를 불러오지 못했습니다.',
};

type UseResultPageReturn = {
  handleReport: () => void;
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleViewReport: () => void;
  handleVisit: () => void;
  resultData: ResultPageData | null;
};

export function useResultPage(tone: ResultTone): UseResultPageReturn {
  const { message, modal } = App.useApp();
  const resultPageFetcher = resultPageFetcherByTone[tone];
  const { handleRescan, handleShareResult, handleViewReport, resultData } = useResultPageBase({
    fetchPageData: resultPageFetcher.fetchResultPageData,
    getInitialPageData: resultPageFetcher.getInitialResultPageData,
    loadErrorMessage: loadErrorMessageByTone[tone],
  });

  const handleVisit = useCallback(() => {
    if (!resultData) {
      return;
    }

    const resolvedTone = resultData.riskLevel;

    if (resolvedTone === 'critical') {
      modal.error({
        centered: true,
        content: '이 URL은 악성 위협이 높아 접속을 차단했습니다.',
        okText: '확인',
        title: '접속 차단',
      });
      return;
    }

    if (resolvedTone === 'warning') {
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
      return;
    }

    openExternalLink(resultData.visitUrl);
  }, [modal, resultData]);

  const handleReport = useCallback(() => {
    if (resultData?.riskLevel !== 'critical') {
      return;
    }

    modal.confirm({
      cancelText: '취소',
      centered: true,
      content: '해당 URL을 위험 사이트로 신고하시겠습니까?',
      okText: '신고하기',
      okType: 'danger',
      title: '위험 URL 신고',
      onOk: () => {
        message.success('신고가 접수되었습니다. 빠르게 확인하겠습니다.');
      },
    });
  }, [message, modal, resultData?.riskLevel]);

  return {
    handleReport,
    handleRescan,
    handleShareResult,
    handleViewReport,
    handleVisit,
    resultData,
  };
}
