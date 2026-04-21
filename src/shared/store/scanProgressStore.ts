import { create } from 'zustand';

import { pickNumber, pickString, pickUnknown } from '@/shared/api/mappers/payloadAccess';
import {
  mapSseStepId,
  mapSseStepIds,
  mappedLoadingStepOrder,
  type MappedLoadingStepId,
} from '@/shared/api/mappers/sseStepMapper';

type ScanProgressStatus = 'active' | 'completed' | 'connecting' | 'error' | 'idle';

type ScanProgressState = {
  backendMessage: string | null;
  backendStatus: string | null;
  backendStep: string | null;
  completedStepIds: MappedLoadingStepId[];
  currentStepId: MappedLoadingStepId | null;
  errorMessage: string | null;
  percent: number;
  reset: () => void;
  setCompleted: () => void;
  setConnecting: () => void;
  setError: (errorMessage: string) => void;
  status: ScanProgressStatus;
  updateFromProgressEvent: (payload: unknown) => void;
};

const initialState = {
  backendMessage: null as string | null,
  backendStatus: null as string | null,
  backendStep: null as string | null,
  completedStepIds: [] as MappedLoadingStepId[],
  currentStepId: null as MappedLoadingStepId | null,
  errorMessage: null as string | null,
  percent: 0,
  status: 'idle' as ScanProgressStatus,
};

function clampPercent(value: number | null): number {
  if (value === null) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeStatus(rawStatus: string | null): string {
  return rawStatus?.trim().toLowerCase() ?? '';
}

function isCompletedStatus(status: string): boolean {
  return (
    status === 'complete' ||
    status === 'completed' ||
    status === 'done' ||
    status === 'finish' ||
    status === 'finished' ||
    status === 'success' ||
    status === 'succeeded'
  );
}

function isErrorStatus(status: string): boolean {
  return status === 'error' || status === 'failed' || status === 'failure' || status === 'fail';
}

function sortStepIds(stepIds: Iterable<MappedLoadingStepId>): MappedLoadingStepId[] {
  return Array.from(new Set(stepIds)).sort((left, right) => {
    return mappedLoadingStepOrder.indexOf(left) - mappedLoadingStepOrder.indexOf(right);
  });
}

function deriveCompletedStepIds({
  currentStepId,
  explicitCompletedStepIds,
  previousCompletedStepIds,
  previousCurrentStepId,
  status,
}: {
  currentStepId: MappedLoadingStepId | null;
  explicitCompletedStepIds: MappedLoadingStepId[];
  previousCompletedStepIds: MappedLoadingStepId[];
  previousCurrentStepId: MappedLoadingStepId | null;
  status: string;
}): MappedLoadingStepId[] {
  const completedStepIds = new Set<MappedLoadingStepId>(previousCompletedStepIds);

  for (const completedStepId of explicitCompletedStepIds) {
    completedStepIds.add(completedStepId);
  }

  if (
    previousCurrentStepId &&
    previousCurrentStepId !== currentStepId &&
    currentStepId &&
    !isErrorStatus(status)
  ) {
    completedStepIds.add(previousCurrentStepId);
  }

  if (currentStepId && isCompletedStatus(status)) {
    completedStepIds.add(currentStepId);
  }

  if (currentStepId === 'completed' || (!currentStepId && isCompletedStatus(status))) {
    for (const stepId of mappedLoadingStepOrder) {
      completedStepIds.add(stepId);
    }
  }

  return sortStepIds(completedStepIds);
}

function derivePercent({
  completedStepIds,
  currentStepId,
  explicitPercent,
  previousPercent,
}: {
  completedStepIds: MappedLoadingStepId[];
  currentStepId: MappedLoadingStepId | null;
  explicitPercent: number;
  previousPercent: number;
}): number {
  if (explicitPercent > 0) {
    return Math.max(previousPercent, explicitPercent);
  }

  if (completedStepIds.includes('completed') || currentStepId === 'completed') {
    return 100;
  }

  const progressStepOrder = mappedLoadingStepOrder.filter((stepId) => stepId !== 'completed');
  const stepCount = progressStepOrder.length;

  if (stepCount <= 0) {
    return previousPercent;
  }

  const completedCount = completedStepIds.filter((stepId) => stepId !== 'completed').length;
  const currentStepIndex = currentStepId ? progressStepOrder.indexOf(currentStepId) : -1;
  const currentStepIsCompleted = currentStepId !== null && completedStepIds.includes(currentStepId);
  const countBasedUnits = completedCount + (currentStepId && !currentStepIsCompleted ? 0.5 : 0);
  const countBasedPercent = clampPercent((countBasedUnits / stepCount) * 100);
  const indexBasedPercent =
    currentStepIndex >= 0
      ? clampPercent(((currentStepIndex + (currentStepIsCompleted ? 1 : 0.5)) / stepCount) * 100)
      : 0;
  const nextPercent = Math.max(countBasedPercent, indexBasedPercent);

  return Math.max(previousPercent, Math.min(nextPercent, 99));
}

export const useScanProgressStore = create<ScanProgressState>((set) => ({
  ...initialState,
  reset: () => {
    set(initialState);
  },
  setCompleted: () => {
    set({
      backendMessage: '분석이 완료되었습니다.',
      backendStatus: 'completed',
      backendStep: 'completed',
      completedStepIds: [...mappedLoadingStepOrder],
      currentStepId: 'completed',
      percent: 100,
      status: 'completed',
    });
  },
  setConnecting: () => {
    set({
      backendMessage: null,
      backendStatus: null,
      backendStep: null,
      errorMessage: null,
      status: 'connecting',
    });
  },
  setError: (errorMessage) => {
    set({
      backendMessage: errorMessage,
      errorMessage,
      status: 'error',
    });
  },
  status: 'idle',
  updateFromProgressEvent: (payload) => {
    const backendStep = pickString(payload, [
      'currentStepId',
      'current_step_id',
      'step',
      'stepId',
      'step_id',
    ]);
    const currentStepId = mapSseStepId(backendStep);
    const explicitCompletedStepIds = mapSseStepIds(
      pickUnknown(payload, ['completedStepIds', 'completed_step_ids', 'completedSteps']),
    );
    const percent = clampPercent(
      pickNumber(payload, ['percent', 'progress', 'progressPercent', 'progress_percent']),
    );
    const status = normalizeStatus(pickString(payload, ['status', 'state']));
    const backendMessage = pickString(payload, ['message', 'description', 'detail']);

    set((state) => {
      const nextCurrentStepId = currentStepId ?? state.currentStepId;
      const completedStepIds = deriveCompletedStepIds({
        currentStepId: nextCurrentStepId,
        explicitCompletedStepIds,
        previousCompletedStepIds: state.completedStepIds,
        previousCurrentStepId: state.currentStepId,
        status,
      });
      const nextPercent = derivePercent({
        completedStepIds,
        currentStepId: nextCurrentStepId,
        explicitPercent: percent,
        previousPercent: state.percent,
      });
      const isCompleted =
        completedStepIds.includes('completed') || nextCurrentStepId === 'completed';

      if (isErrorStatus(status)) {
        return {
          backendMessage,
          backendStatus: status || state.backendStatus,
          backendStep: backendStep ?? state.backendStep,
          completedStepIds,
          currentStepId: nextCurrentStepId,
          errorMessage: backendMessage ?? '분석 중 오류가 발생했습니다.',
          percent: nextPercent,
          status: 'error',
        };
      }

      return {
        backendMessage: backendMessage ?? state.backendMessage,
        backendStatus: status || state.backendStatus,
        backendStep: backendStep ?? state.backendStep,
        completedStepIds,
        currentStepId: isCompleted ? 'completed' : nextCurrentStepId,
        errorMessage: null,
        percent: isCompleted ? 100 : nextPercent,
        status: isCompleted ? 'completed' : 'active',
      };
    });
  },
}));
