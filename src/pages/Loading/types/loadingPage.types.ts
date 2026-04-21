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

export type LoadingPageData = {
  steps: LoadingStep[];
};

export type LoadingState = 'active' | 'done' | 'pending';
