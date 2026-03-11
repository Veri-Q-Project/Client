export type CaptchaProvider = 'mock' | 'googleRecaptchaEnterprise';

export type CaptchaVerifyResponse = {
  message?: string;
  success: boolean;
};

export type SubmitCaptchaVerificationPayload = {
  token: string;
};
