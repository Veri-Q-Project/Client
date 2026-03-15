import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

import { submitCaptchaVerification } from '../api/submitCaptchaVerification';

const DEFAULT_VERIFY_ENDPOINT = '/api/captcha/verify';
const SUPPORTED_CAPTCHA_PROVIDER = 'googleRecaptchaV2';

export function useCaptchaPage() {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() ?? '';
  const captchaProvider =
    import.meta.env.VITE_CAPTCHA_PROVIDER?.trim() ?? SUPPORTED_CAPTCHA_PROVIDER;
  const verifyEndpoint =
    import.meta.env.VITE_CAPTCHA_VERIFY_ENDPOINT?.trim() || DEFAULT_VERIFY_ENDPOINT;

  const isCaptchaConfigured = siteKey.length > 0;
  const isSupportedProvider = captchaProvider === SUPPORTED_CAPTCHA_PROVIDER;

  const canSubmit = isCaptchaConfigured && isSupportedProvider && !!captchaToken && !isVerifying;

  const providerStatusMessage = useMemo(() => {
    if (!isCaptchaConfigured) {
      return 'reCAPTCHA 사이트 키가 설정되지 않았습니다.';
    }

    if (!isSupportedProvider) {
      return `지원되지 않는 캡차 제공자입니다: ${captchaProvider}`;
    }

    return '';
  }, [captchaProvider, isCaptchaConfigured, isSupportedProvider]);

  const handleLoadError = useCallback((message: string) => {
    setFeedbackMessage(message);
  }, []);

  const handleTokenChange = useCallback((token: string | null) => {
    setCaptchaToken(token);
    setFeedbackMessage('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!captchaToken || !isCaptchaConfigured || !isSupportedProvider) {
      setFeedbackMessage(providerStatusMessage || '캡차 검증을 완료한 뒤 다시 시도해 주세요.');

      return;
    }

    setIsVerifying(true);
    setFeedbackMessage('');

    const verificationResponse = await submitCaptchaVerification({
      endpoint: verifyEndpoint,
      token: captchaToken,
    });

    if (!verificationResponse.success) {
      setFeedbackMessage(verificationResponse.message);
      setCaptchaToken(null);
      setResetSignal((currentValue) => currentValue + 1);
      setIsVerifying(false);

      return;
    }

    setFeedbackMessage(verificationResponse.message);
    setIsVerifying(false);
    navigate({ to: '/loading' });
  }, [
    captchaToken,
    isCaptchaConfigured,
    isSupportedProvider,
    navigate,
    providerStatusMessage,
    verifyEndpoint,
  ]);

  return {
    canSubmit,
    feedbackMessage,
    handleLoadError,
    handleSubmit,
    handleTokenChange,
    isCaptchaConfigured,
    isSupportedProvider,
    isVerifying,
    providerStatusMessage,
    resetSignal,
    siteKey,
  };
}
