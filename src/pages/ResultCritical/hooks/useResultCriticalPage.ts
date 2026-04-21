import { App } from 'antd';
import { useCallback } from 'react';

import type { ResultSafeData } from '@/shared/api/result-safe';
import { useResultPageBase } from '@/shared/ui/resultPage';

import {
  fetchResultCriticalPageData,
  getInitialResultCriticalPageData,
} from '../api/fetchResultCriticalPageData';

type UseResultCriticalPageReturn = {
  handleBlockAccess: () => void;
  handleReport: () => void;
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleViewReport: () => void;
  resultCriticalData: ResultSafeData | null;
};

export function useResultCriticalPage(): UseResultCriticalPageReturn {
  const { message, modal } = App.useApp();
  const { handleRescan, handleShareResult, handleViewReport, resultData } = useResultPageBase({
    fetchPageData: fetchResultCriticalPageData,
    getInitialPageData: getInitialResultCriticalPageData,
    loadErrorMessage: '위험 결과를 불러오지 못했습니다.',
  });

  const handleBlockAccess = useCallback(() => {
    modal.error({
      centered: true,
      content: '이 URL은 악성 위험이 높아 접속이 차단되었습니다.',
      okText: '확인',
      title: '접속 차단',
    });
  }, [modal]);

  const handleReport = useCallback(() => {
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
  }, [message, modal]);

  return {
    handleBlockAccess,
    handleReport,
    handleRescan,
    handleShareResult,
    handleViewReport,
    resultCriticalData: resultData,
  };
}
