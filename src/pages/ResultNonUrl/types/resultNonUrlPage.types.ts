export type NonUrlActionType = 'appLaunch' | 'appStore' | 'bitcoin' | 'telSms' | 'unknown' | 'wifi';

export type ResultNonUrlPageData = {
  detectedActionType: NonUrlActionType;
  sectionDescription: string;
  sectionNumber: string;
  sectionTitle: string;
  targetValue?: string;
};
