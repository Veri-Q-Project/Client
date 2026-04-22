import { stepTextMap } from './constants/stepText';

import type { LoadingStep, LoadingStepId } from './types/loadingPage.types';

const loadingStepOrder: LoadingStepId[] = [
  'decode',
  'shortUrlCheck',
  'urlNormalize',
  'redirect',
  'internalDb',
  'externalApi',
  'ruleAnalysis',
  'aiAnalysis',
  'riskScore',
  'report',
  'completed',
];

export function getLoadingSteps(): LoadingStep[] {
  return loadingStepOrder.map((stepId) => {
    const step = stepTextMap[stepId];
    const resolvedDetails = step.details;

    return {
      ...step,
      details: resolvedDetails ? [...resolvedDetails] : undefined,
    };
  });
}
