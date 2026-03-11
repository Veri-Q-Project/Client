import { useEffect, useMemo, useState } from 'react';

const MAX_PROGRESS = 100;
const PROGRESS_INTERVAL_MS = 90;

export type LoadingState = 'active' | 'done' | 'pending';

type LoadingProgressResult = {
  getAnalysisDetailState: (index: number) => LoadingState;
  getMainStepState: (index: number) => LoadingState;
  progress: number;
  statusDescription: string;
};

const mainStepThresholds = [18, 78, 88, 96, 100];
const analysisDetailThresholds = [34, 48, 62, 76];

export function useLoadingProgress(): LoadingProgressResult {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= MAX_PROGRESS) {
          return MAX_PROGRESS;
        }

        return prev + 1;
      });
    }, PROGRESS_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const activeMainStepIndex = useMemo(() => {
    const foundIndex = mainStepThresholds.findIndex((threshold) => progress < threshold);
    return foundIndex === -1 ? null : foundIndex;
  }, [progress]);

  const getMainStepState = (index: number): LoadingState => {
    if (activeMainStepIndex === null) {
      return 'done';
    }

    if (index < activeMainStepIndex) {
      return 'done';
    }

    if (index === activeMainStepIndex) {
      return 'active';
    }

    return 'pending';
  };

  const getAnalysisDetailState = (index: number): LoadingState => {
    const analysisStepState = getMainStepState(1);

    if (analysisStepState === 'pending') {
      return 'pending';
    }

    if (analysisStepState === 'done') {
      return 'done';
    }

    const activeSubStepIndex = analysisDetailThresholds.findIndex(
      (threshold) => progress < threshold,
    );
    const resolvedActiveSubStepIndex = activeSubStepIndex === -1 ? null : activeSubStepIndex;

    if (resolvedActiveSubStepIndex === null) {
      return 'done';
    }

    if (index < resolvedActiveSubStepIndex) {
      return 'done';
    }

    if (index === resolvedActiveSubStepIndex) {
      return 'active';
    }

    return 'pending';
  };

  const statusDescription =
    progress < 100
      ? '시스템을 안전하게 점검하고 있습니다.'
      : '분석이 완료되었습니다. 결과 페이지로 이동합니다.';

  return {
    getAnalysisDetailState,
    getMainStepState,
    progress,
    statusDescription,
  };
}
