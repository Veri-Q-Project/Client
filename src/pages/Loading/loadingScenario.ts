import { stepTextMap, stepTextOverridesByCase } from './constants/stepText';

import type { LoadingCaseNumber, LoadingStep, LoadingStepId } from './types/loadingPage.types';

const loadingCaseStepOrder: Record<LoadingCaseNumber, LoadingStepId[]> = {
  1: ['decode', 'shortUrlCheck', 'urlNormalize', 'internalDb', 'report', 'completed'],
  2: [
    'decode',
    'shortUrlCheck',
    'redirect',
    'urlNormalize',
    'internalDb',
    'externalApi',
    'ruleAnalysis',
    'aiAnalysis',
    'riskScore',
    'report',
    'completed',
  ],
  3: [
    'decode',
    'shortUrlCheck',
    'redirect',
    'urlNormalize',
    'internalDb',
    'externalApi',
    'ruleAnalysis',
    'aiAnalysis',
    'riskScore',
    'report',
    'completed',
  ],
  4: ['decode', 'shortUrlCheck', 'urlNormalize', 'internalDb', 'report', 'completed'],
  5: [
    'decode',
    'shortUrlCheck',
    'urlNormalize',
    'internalDb',
    'externalApi',
    'ruleAnalysis',
    'aiAnalysis',
    'redirect',
    'riskScore',
    'report',
    'completed',
  ],
  6: [
    'decode',
    'shortUrlCheck',
    'urlNormalize',
    'internalDb',
    'externalApi',
    'ruleAnalysis',
    'aiAnalysis',
    'redirect',
    'riskScore',
    'report',
    'completed',
  ],
  7: [
    'decode',
    'shortUrlCheck',
    'urlNormalize',
    'internalDb',
    'externalApi',
    'report',
    'completed',
  ],
  8: ['decode', 'completed'],
};

export function getLoadingSteps(caseNumber: LoadingCaseNumber): LoadingStep[] {
  const stepOverrides = stepTextOverridesByCase[caseNumber];

  return loadingCaseStepOrder[caseNumber].map((stepId) => {
    const step = stepTextMap[stepId];
    const override = stepOverrides?.[stepId];
    const resolvedDetails = override?.details ?? step.details;

    return {
      ...step,
      ...override,
      details: resolvedDetails ? [...resolvedDetails] : undefined,
    };
  });
}

export function isLoadingCaseNumber(value: number): value is LoadingCaseNumber {
  return Number.isInteger(value) && value >= 1 && value <= 8;
}
