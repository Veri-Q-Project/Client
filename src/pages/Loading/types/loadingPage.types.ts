export type LoadingCaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type LoadingStepId =
  | 'decode'
  | 'shortUrlCheck'
  | 'urlNormalize'
  | 'redirect'
  | 'internalDb'
  | 'externalApi'
  | 'ruleAnalysis'
  | 'aiAnalysis'
  | 'riskScore'
  | 'report'
  | 'completed';

export type LoadingDetailStep = {
  title: string;
  weight: number;
};

export type LoadingStep = {
  activeDescription: string;
  details?: LoadingDetailStep[];
  doneDescription: string;
  id: LoadingStepId;
  pendingDescription: string;
  title: string;
  weight: number;
};

export type LoadingRevealMode = 'full' | 'sequential';

export type LoadingPageData = {
  caseNumber: LoadingCaseNumber;
  progressIntervalMs: number;
  revealMode: LoadingRevealMode;
  steps: LoadingStep[];
};

export type LoadingState = 'active' | 'done' | 'pending';
