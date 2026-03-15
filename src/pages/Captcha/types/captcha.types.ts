export type CaptchaVerificationResponse = {
  challengeTs?: string;
  errorCodes?: string[];
  hostname?: string;
  message: string;
  success: boolean;
};

export type SubmitCaptchaVerificationParams = {
  endpoint: string;
  timeoutMs?: number;
  token: string;
};
