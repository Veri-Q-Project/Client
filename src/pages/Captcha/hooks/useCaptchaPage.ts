import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

import { submitCaptchaVerification } from '../api/submitCaptchaVerification';

type UseCaptchaPageReturn = {
  feedbackMessage: string | null;
  handleCaptchaTokenChange: (nextToken: string | null) => void;
  handleSubmit: () => Promise<void>;
  isVerifying: boolean;
  recaptchaSiteKey: string;
  token: string | null;
};

export function useCaptchaPage(): UseCaptchaPageReturn {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '').trim();

  const handleCaptchaTokenChange = useCallback((nextToken: string | null) => {
    setToken(nextToken);
    setFeedbackMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    setFeedbackMessage(null);

    if (recaptchaSiteKey.length === 0) {
      setFeedbackMessage('reCAPTCHA 사이트 키가 비어 있습니다. `.env.local`을 확인해 주세요.');
      return;
    }

    if (!token) {
      setFeedbackMessage('캡차를 먼저 완료해 주세요.');
      return;
    }

    setIsVerifying(true);

    try {
      const result = await submitCaptchaVerification({ token });

      if (!result.success) {
        setFeedbackMessage(result.message ?? '캡차 검증에 실패했습니다.');
        return;
      }

      setFeedbackMessage('캡차 검증이 완료되었습니다. 스캔 화면으로 이동합니다.');
      void navigate({ to: '/qr-scan' });
    } finally {
      setIsVerifying(false);
    }
  }, [navigate, recaptchaSiteKey, token]);

  return {
    feedbackMessage,
    handleCaptchaTokenChange,
    handleSubmit,
    isVerifying,
    recaptchaSiteKey,
    token,
  };
}
