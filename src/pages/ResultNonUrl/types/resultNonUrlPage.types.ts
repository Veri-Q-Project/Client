export type NonUrlActionType =
  | 'WEB'
  | 'SHORT_URL'
  | 'OTP'
  | 'CRYPTO'
  | 'SMS'
  | 'WIFI'
  | 'CONTACT'
  | 'DEEP_LINK'
  | 'TEL'
  | 'EMAIL'
  | 'APP_STORE'
  | 'OTHER';

export type ResultNonUrlPageData = {
  detectedActionType: NonUrlActionType;
  sectionDescription: string;
  sectionNumber: string;
  sectionTitle: string;
  targetValue?: string;
};
