export type CaptchaVerifyResponse = {
  message?: string;
  success: boolean;
};

export type SubmitCaptchaVerificationPayload = {
  token: string;
};
