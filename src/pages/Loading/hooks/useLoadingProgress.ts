import { useEffect, useMemo, useState } from 'react';

import { useScanProgressStore } from '@/shared/store/scanProgressStore';

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
  getDetailStepState: (stepIndex: number, detailIndex: number) => LoadingState;
  getStepState: (index: number) => LoadingState;
  progress: number;
  progressLabel: string;
  progressMetaText: string;
  statusDescription: string;
  visibleStepIds: string[];
};

type UseLoadingProgressOptions = {
  progressIntervalMs?: number;
  revealStepsSequentially?: boolean;
  useMockProgressDemo?: boolean;
};

function formatBackendStepLabel(rawStep: string): string {
  return rawStep.trim().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toUpperCase();
}

export function useLoadingProgress(
  steps: LoadingStep[],
  options?: UseLoadingProgressOptions,
): LoadingProgressResult {
  const backendMessage = useScanProgressStore((state) => state.backendMessage);
  const backendStatus = useScanProgressStore((state) => state.backendStatus);
  const backendStep = useScanProgressStore((state) => state.backendStep);
  const completedStepIds = useScanProgressStore((state) => state.completedStepIds);
  const currentStepId = useScanProgressStore((state) => state.currentStepId);
  const errorMessage = useScanProgressStore((state) => state.errorMessage);
  const progressFromStore = useScanProgressStore((state) => state.percent);
  const progressStatus = useScanProgressStore((state) => state.status);
  const [mockProgress, setMockProgress] = useState(0);
  const progressIntervalMs = options?.progressIntervalMs ?? DEFAULT_PROGRESS_INTERVAL_MS;
  const revealStepsSequentially = options?.revealStepsSequentially ?? true;
  const useMockProgressDemo = options?.useMockProgressDemo ?? false;

  useEffect(() => {
    if (!useMockProgressDemo) {
      return;
    }

    setMockProgress(0);
  }, [steps, useMockProgressDemo]);

  useEffect(() => {
    if (!useMockProgressDemo) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setMockProgress((prev) => {
        if (prev >= MAX_PROGRESS) {
          return MAX_PROGRESS;
        }

        return prev + 1;
      });
    }, progressIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [progressIntervalMs, steps, useMockProgressDemo]);

  const stepThresholds = useMemo(() => getThresholds(steps), [steps]);
  const stepRanges = useMemo(() => getProgressRanges(stepThresholds), [stepThresholds]);
  const progress = useMockProgressDemo ? mockProgress : progressFromStore;

  const totalStepCount = useMemo(() => {
    return steps.filter((step) => step.id !== 'completed').length || steps.length;
  }, [steps]);

  const completedStepCount = useMemo(() => {
    return completedStepIds.filter((stepId) => stepId !== 'completed').length;
  }, [completedStepIds]);

  const activeStepIndex = useMemo(() => {
    return currentStepId ? steps.findIndex((step) => step.id === currentStepId) : -1;
  }, [currentStepId, steps]);

  const mockVisibleStepIds = useMemo(() => {
    const activeMockStepIndex = stepThresholds.findIndex((threshold) => progress < threshold);
    const visibleStepCount = !revealStepsSequentially
      ? steps.length
      : activeMockStepIndex === -1
        ? steps.length
        : Math.min(activeMockStepIndex + 1, steps.length);

    return steps.slice(0, visibleStepCount).map((step) => step.id);
  }, [progress, revealStepsSequentially, stepThresholds, steps]);

  const visibleStepIds = useMemo(() => {
    if (useMockProgressDemo) {
      return mockVisibleStepIds;
    }

    const currentStepIndex = currentStepId
      ? steps.findIndex((step) => step.id === currentStepId)
      : -1;
    const lastCompletedStepIndex = completedStepIds.reduce((lastIndex, stepId) => {
      const stepIndex = steps.findIndex((step) => step.id === stepId);

      return Math.max(lastIndex, stepIndex);
    }, -1);
    const lastReachedStepIndex = Math.max(currentStepIndex, lastCompletedStepIndex, 0);
    const lastVisibleStepIndex =
      progressStatus === 'completed'
        ? steps.length - 1
        : Math.min(lastReachedStepIndex + 1, steps.length - 1);

    return steps.slice(0, lastVisibleStepIndex + 1).map((step) => step.id);
  }, [
    completedStepIds,
    currentStepId,
    mockVisibleStepIds,
    progressStatus,
    steps,
    useMockProgressDemo,
  ]);

  const getStepState = (index: number): LoadingState => {
    if (useMockProgressDemo) {
      return getProgressState(progress, stepThresholds, index);
    }

    const step = steps[index];

    if (!step) {
      return 'pending';
    }

    if (completedStepIds.includes(step.id)) {
      return 'done';
    }

    if (currentStepId === step.id) {
      return 'active';
    }

    if (progressStatus === 'connecting' && index === 0) {
      return 'active';
    }

    return 'pending';
  };

  const getDetailStepState = (stepIndex: number, detailIndex: number): LoadingState => {
    const step = steps[stepIndex];
    const detailSteps = step?.details;

    if (!detailSteps || detailSteps.length === 0) {
      return 'pending';
    }

    if (useMockProgressDemo) {
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
    }

    const stepState = getStepState(stepIndex);

    if (stepState === 'done') {
      return 'done';
    }

    if (stepState === 'active') {
      return detailIndex === 0 ? 'active' : 'pending';
    }

    return 'pending';
  };

  const progressLabel = useMemo(() => {
    if (useMockProgressDemo) {
      const activeMockStepIndex = stepThresholds.findIndex((threshold) => progress < threshold);

      if (activeMockStepIndex === -1 || progress >= MAX_PROGRESS) {
        return '완료';
      }

      return `${Math.min(activeMockStepIndex + 1, totalStepCount)} / ${totalStepCount}`;
    }

    if (progressStatus === 'completed') {
      return '완료';
    }

    const derivedStepNumber =
      activeStepIndex >= 0
        ? Math.min(activeStepIndex + 1, totalStepCount)
        : Math.min(Math.max(completedStepCount + 1, 1), totalStepCount);

    return `${derivedStepNumber} / ${totalStepCount}`;
  }, [
    activeStepIndex,
    completedStepCount,
    progress,
    progressStatus,
    stepThresholds,
    totalStepCount,
    useMockProgressDemo,
  ]);

  const progressMetaText = useMemo(() => {
    if (useMockProgressDemo) {
      return '단계';
    }

    if (progressStatus === 'completed') {
      return '분석 종료';
    }

    const activeStep = steps.find((step) => step.id === currentStepId);

    if (activeStep) {
      return activeStep.title;
    }

    if (backendStep) {
      return formatBackendStepLabel(backendStep);
    }

    return '분석 단계';
  }, [backendStep, currentStepId, progressStatus, steps, useMockProgressDemo]);

  const statusDescription = useMemo(() => {
    if (useMockProgressDemo) {
      const activeMockStepIndex = stepThresholds.findIndex((threshold) => progress < threshold);

      if (activeMockStepIndex === -1) {
        return steps[steps.length - 1]?.doneDescription ?? '분석이 완료되었습니다.';
      }

      return steps[activeMockStepIndex]?.activeDescription ?? '분석을 진행하고 있습니다.';
    }

    if (progressStatus === 'error') {
      return errorMessage ?? '실시간 분석 중 문제가 발생했습니다.';
    }

    if (progressStatus === 'completed') {
      return (
        backendMessage ??
        steps.find((step) => step.id === 'completed')?.doneDescription ??
        '분석이 완료되었습니다.'
      );
    }

    if (backendMessage) {
      return backendMessage;
    }

    const activeStep = steps.find((step) => step.id === currentStepId);

    if (activeStep) {
      if (completedStepIds.includes(activeStep.id)) {
        const activeStepIndex = steps.findIndex((step) => step.id === activeStep.id);
        const nextStep = steps[activeStepIndex + 1];

        if (nextStep && nextStep.id !== 'completed') {
          return `${activeStep.doneDescription} 다음 단계: ${nextStep.title}`;
        }

        return activeStep.doneDescription;
      }

      return activeStep.activeDescription;
    }

    if (progressStatus === 'connecting') {
      return '실시간 분석 연결을 준비하고 있습니다...';
    }

    if (backendStep && backendStatus === 'completed') {
      return `${formatBackendStepLabel(backendStep)} 단계를 완료했습니다.`;
    }

    if (backendStep) {
      return `${formatBackendStepLabel(backendStep)} 단계를 처리하고 있습니다.`;
    }

    return steps[0]?.pendingDescription ?? '분석을 준비하고 있습니다.';
  }, [
    backendMessage,
    backendStatus,
    backendStep,
    completedStepIds,
    currentStepId,
    errorMessage,
    progress,
    progressStatus,
    stepThresholds,
    steps,
    useMockProgressDemo,
  ]);

  return {
    getDetailStepState,
    getStepState,
    progress,
    progressLabel,
    progressMetaText,
    statusDescription,
    visibleStepIds,
  };
}
