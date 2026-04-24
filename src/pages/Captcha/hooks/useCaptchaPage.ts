import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

import { submitCaptchaVerification } from '../api/submitCaptchaVerification';
import { executeRecaptchaEnterprise } from '../lib/recaptchaEnterprise';

type UseCaptchaPageReturn = {
  canSubmit: boolean;
  feedbackMessage: string | null;
  handleSubmit: () => Promise<void>;
  isVerifying: boolean;
  recaptchaSiteKey: string;
};

function resolveRecaptchaTokenErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return `reCAPTCHA 토큰 발급 실패: ${error.message}`;
  }

  return 'reCAPTCHA 토큰을 발급하지 못했습니다.';
}

export function useCaptchaPage(): UseCaptchaPageReturn {
  const navigate = useNavigate();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '').trim();
  const canSubmit = recaptchaSiteKey.length > 0 && !isVerifying;

  const handleSubmit = useCallback(async () => {
    setFeedbackMessage(null);

    if (recaptchaSiteKey.length === 0) {
      setFeedbackMessage('reCAPTCHA 사이트 키가 비어 있습니다.');
      return;
    }

    setIsVerifying(true);

    try {
      const captchaToken = await executeRecaptchaEnterprise(recaptchaSiteKey);
      const result = await submitCaptchaVerification({ token: captchaToken });

      if (!result.success) {
        setFeedbackMessage(result.message ?? '캡차 검증에 실패했습니다.');
        return;
      }

      setFeedbackMessage('캡차 검증이 완료되었습니다.');
      void navigate({ to: '/qr-scan' });
    } catch (error) {
      console.error('Failed to execute reCAPTCHA Enterprise.', error);
      setFeedbackMessage(resolveRecaptchaTokenErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  }, [navigate, recaptchaSiteKey]);

  return {
    canSubmit,
    feedbackMessage,
    handleSubmit,
    isVerifying,
    recaptchaSiteKey,
  };
}
