import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

import { submitCaptchaVerification } from '../api/submitCaptchaVerification';

import type { CaptchaProvider } from '../types/captcha.types';

type UseCaptchaPageReturn = {
  configuredProvider: CaptchaProvider;
  effectiveProvider: CaptchaProvider;
  feedbackMessage: string | null;
  handleCaptchaTokenChange: (nextToken: string | null) => void;
  handleMockToggle: (checked: boolean) => void;
  handleProviderChange: (provider: CaptchaProvider) => void;
  handleSubmit: () => Promise<void>;
  isUsingMockFallback: boolean;
  isVerifying: boolean;
  recaptchaSiteKey: string;
  selectedProvider: CaptchaProvider;
  token: string | null;
};

function resolveCaptchaProvider(rawProvider: string | undefined): CaptchaProvider {
  if (rawProvider === 'googleRecaptchaV2') {
    return 'googleRecaptchaEnterprise';
  }

  return rawProvider === 'googleRecaptchaEnterprise' ? 'googleRecaptchaEnterprise' : 'mock';
}

export function useCaptchaPage(): UseCaptchaPageReturn {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const configuredProvider = useMemo(
    () => resolveCaptchaProvider(import.meta.env.VITE_CAPTCHA_PROVIDER),
    [],
  );
  const [selectedProvider, setSelectedProvider] = useState<CaptchaProvider>(configuredProvider);

  const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '').trim();

  const effectiveProvider: CaptchaProvider =
    selectedProvider === 'googleRecaptchaEnterprise' && recaptchaSiteKey.length > 0
      ? 'googleRecaptchaEnterprise'
      : 'mock';

  const isUsingMockFallback =
    selectedProvider === 'googleRecaptchaEnterprise' && effectiveProvider === 'mock';

  const handleProviderChange = useCallback((provider: CaptchaProvider) => {
    setSelectedProvider(provider);
    setToken(null);
    setFeedbackMessage(null);
  }, []);

  const handleMockToggle = useCallback((checked: boolean) => {
    if (checked) {
      setToken(`mock-token-${Date.now()}`);
    } else {
      setToken(null);
    }

    setFeedbackMessage(null);
  }, []);

  const handleCaptchaTokenChange = useCallback((nextToken: string | null) => {
    setToken(nextToken);
    setFeedbackMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    setFeedbackMessage(null);

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

      setFeedbackMessage('캡차 검증이 완료되었습니다. 로딩 화면으로 이동합니다.');
      void navigate({ to: '/loading' });
    } finally {
      setIsVerifying(false);
    }
  }, [navigate, token]);

  return {
    configuredProvider,
    effectiveProvider,
    feedbackMessage,
    handleCaptchaTokenChange,
    handleMockToggle,
    handleProviderChange,
    handleSubmit,
    isUsingMockFallback,
    isVerifying,
    recaptchaSiteKey,
    selectedProvider,
    token,
  };
}
