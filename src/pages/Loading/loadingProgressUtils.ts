import type { LoadingState } from './types/loadingPage.types';

type WeightedStep = {
  weight: number;
};

type ProgressRange = {
  end: number;
  start: number;
};

const MAX_PROGRESS = 100;

export function getThresholds<T extends WeightedStep>(items: T[]) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let accumulatedWeight = 0;

  return items.map((item, index) => {
    accumulatedWeight += item.weight;

    if (index === items.length - 1) {
      return MAX_PROGRESS;
    }

    return Math.round((accumulatedWeight / totalWeight) * MAX_PROGRESS);
  });
}

export function getProgressRanges(thresholds: number[]): ProgressRange[] {
  let previousThreshold = 0;

  return thresholds.map((threshold) => {
    const range = {
      end: threshold,
      start: previousThreshold,
    };

    previousThreshold = threshold;

    return range;
  });
}

export function getProgressState(
  progress: number,
  thresholds: number[],
  index: number,
): LoadingState {
  const activeIndex = thresholds.findIndex((threshold) => progress < threshold);

  if (activeIndex === -1) {
    return 'done';
  }

  if (index < activeIndex) {
    return 'done';
  }

  if (index === activeIndex) {
    return 'active';
  }

  return 'pending';
}

export function resolveLocalProgress(progress: number, range: ProgressRange) {
  const rangeSize = Math.max(range.end - range.start, 1);
  const clampedProgress = Math.min(Math.max(progress, range.start), range.end);

  return ((clampedProgress - range.start) / rangeSize) * MAX_PROGRESS;
}
