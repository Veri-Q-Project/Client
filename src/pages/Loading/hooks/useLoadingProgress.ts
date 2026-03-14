import { useEffect, useMemo, useState } from 'react';

import {
  getProgressRanges,
  getProgressState,
  getThresholds,
  resolveLocalProgress,
} from '../loadingProgressUtils';

import type { LoadingDetailStep, LoadingState, LoadingStep } from '../types/loadingPage.types';

const MAX_PROGRESS = 100;
const DEFAULT_PROGRESS_INTERVAL_MS = 90;

type LoadingProgressResult = {
  visibleStepCount: number;
  getDetailStepState: (stepIndex: number, detailIndex: number) => LoadingState;
  getStepState: (index: number) => LoadingState;
  progress: number;
  statusDescription: string;
};

type UseLoadingProgressOptions = {
  progressIntervalMs?: number;
  revealStepsSequentially?: boolean;
};

export function useLoadingProgress(
  steps: LoadingStep[],
  options?: UseLoadingProgressOptions,
): LoadingProgressResult {
  const [progress, setProgress] = useState(0);
  const progressIntervalMs = options?.progressIntervalMs ?? DEFAULT_PROGRESS_INTERVAL_MS;
  const revealStepsSequentially = options?.revealStepsSequentially ?? true;

  useEffect(() => {
    setProgress(0);
  }, [steps]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= MAX_PROGRESS) {
          return MAX_PROGRESS;
        }

        return prev + 1;
      });
    }, progressIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [progressIntervalMs, steps]);

  const stepThresholds = useMemo(() => getThresholds(steps), [steps]);
  const stepRanges = useMemo(() => getProgressRanges(stepThresholds), [stepThresholds]);
  const activeStepIndex = useMemo(() => {
    const foundIndex = stepThresholds.findIndex((threshold) => progress < threshold);
    return foundIndex === -1 ? null : foundIndex;
  }, [progress, stepThresholds]);
  const visibleStepCount = useMemo(() => {
    if (!revealStepsSequentially) {
      return steps.length;
    }

    if (activeStepIndex === null) {
      return steps.length;
    }

    return Math.min(activeStepIndex + 1, steps.length);
  }, [activeStepIndex, revealStepsSequentially, steps.length]);

  const getStepState = (index: number): LoadingState => {
    return getProgressState(progress, stepThresholds, index);
  };

  const getDetailStepState = (stepIndex: number, detailIndex: number): LoadingState => {
    const step = steps[stepIndex];
    const detailSteps = step?.details;

    if (!detailSteps || detailSteps.length === 0) {
      return 'pending';
    }

    const stepState = getStepState(stepIndex);

    if (stepState === 'pending') {
      return 'pending';
    }

    if (stepState === 'done') {
      return 'done';
    }

    const stepRange = stepRanges[stepIndex];

    if (!stepRange) {
      return 'pending';
    }

    const localProgress = resolveLocalProgress(progress, stepRange);
    const detailThresholds = getThresholds<LoadingDetailStep>(detailSteps);

    return getProgressState(localProgress, detailThresholds, detailIndex);
  };

  const statusDescription = useMemo(() => {
    if (activeStepIndex === null) {
      return steps[steps.length - 1]?.doneDescription ?? '분석이 완료되었습니다.';
    }

    return steps[activeStepIndex]?.activeDescription ?? '분석을 진행하고 있습니다.';
  }, [activeStepIndex, steps]);

  return {
    visibleStepCount,
    getDetailStepState,
    getStepState,
    progress,
    statusDescription,
  };
}
