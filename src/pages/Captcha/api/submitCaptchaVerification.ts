import { axiosBe1 } from '@/shared/api/axios';
import { apiEndpoints } from '@/shared/api/endpoints';
import { toApiError } from '@/shared/api/errors/apiError';
import { useGuestStore } from '@/shared/store/guestStore';

import { toCaptchaVerifyResponse } from './captchaVerifyResponse';

import type {
  CaptchaVerifyResponse,
  SubmitCaptchaVerificationPayload,
} from '../types/captcha.types';

export async function submitCaptchaVerification({
  token,
}: SubmitCaptchaVerificationPayload): Promise<CaptchaVerifyResponse> {
  if (!token) {
    return {
      message: 'Captcha token is empty.',
      success: false,
    };
  }

  try {
    const guestUuid = useGuestStore.getState().ensureGuestUuid();
    const response = await axiosBe1.post(apiEndpoints.captchaVerify, {
      captchaToken: token,
      guestUuid,
    });

    return toCaptchaVerifyResponse(response.data);
  } catch (error) {
    return {
      message: toApiError(error).message,
      success: false,
    };
  }
}
