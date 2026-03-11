import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { shareCurrentPage } from '@/shared/lib/browser/shareCurrentPage';

import {
  fetchResultCriticalPageData,
  mockResultCriticalPageData,
} from '../api/fetchResultCriticalPageData';

import type { ResultCriticalPageData } from '../types/resultCriticalPage.types';

type UseResultCriticalPageReturn = {
  handleBlockAccess: () => void;
  handleReport: () => void;
  handleRescan: () => void;
  handleShareResult: () => Promise<void>;
  handleToggleReport: () => void;
  isReportOpen: boolean;
  resultCriticalData: ResultCriticalPageData;
};

export function useResultCriticalPage(): UseResultCriticalPageReturn {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const [resultCriticalData, setResultCriticalData] = useState<ResultCriticalPageData>(
    mockResultCriticalPageData,
  );
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadResultCriticalData = async () => {
      const response = await fetchResultCriticalPageData();

      if (isMounted) {
        setResultCriticalData(response);
      }
    };

    void loadResultCriticalData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleShareResult = useCallback(async () => {
    await shareCurrentPage({
      text: 'Veri-Q 분석 결과를 확인해 보세요.',
      title: 'Veri-Q 분석 결과',
    });
  }, []);

  const handleRescan = useCallback(() => {
    void navigate({ to: '/' });
  }, [navigate]);

  const handleToggleReport = useCallback(() => {
    setIsReportOpen((prev) => !prev);
  }, []);

  return {
    handleBlockAccess,
    handleReport,
    handleRescan,
    handleShareResult,
    handleToggleReport,
    isReportOpen,
    resultCriticalData,
  };
}
