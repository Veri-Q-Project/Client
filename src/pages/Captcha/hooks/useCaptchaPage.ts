import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

import { submitCaptchaVerification } from '../api/submitCaptchaVerification';

const DEFAULT_VERIFY_ENDPOINT = '/api/captcha/verify';
const SUPPORTED_CAPTCHA_PROVIDER = 'googleRecaptchaV2';

export function useCaptchaPage() {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  // siteKey/captchaProvider use ?? so missing env falls back, while verifyEndpoint uses
  // || so an empty endpoint string still falls back to DEFAULT_VERIFY_ENDPOINT.
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
    setIsSuccess(false);
    setFeedbackMessage(message);
  }, []);

  const handleTokenChange = useCallback((token: string | null) => {
    setCaptchaToken(token);
    setIsSuccess(false);
    setFeedbackMessage('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!captchaToken || !isCaptchaConfigured || !isSupportedProvider) {
      setIsSuccess(false);
      setFeedbackMessage(providerStatusMessage || '캡차 검증을 완료한 뒤 다시 시도해 주세요.');

      return;
    }

    setIsVerifying(true);
    setIsSuccess(false);
    setFeedbackMessage('');

    try {
      const verificationResponse = await submitCaptchaVerification({
        endpoint: verifyEndpoint,
        token: captchaToken,
      });

      if (!verificationResponse.success) {
        setFeedbackMessage(verificationResponse.message);
        setCaptchaToken(null);
        setResetSignal((currentValue) => currentValue + 1);

        return;
      }

      setIsSuccess(true);
      setFeedbackMessage(verificationResponse.message);
      navigate({ to: '/loading' });
    } catch {
      setCaptchaToken(null);
      setResetSignal((currentValue) => currentValue + 1);
      setFeedbackMessage('검증 요청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsVerifying(false);
    }
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
    isSuccess,
    isSupportedProvider,
    isVerifying,
    providerStatusMessage,
    resetSignal,
    siteKey,
  };
}
