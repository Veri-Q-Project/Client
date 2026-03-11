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

function resolveCaptchaProvider(
  rawProvider: string | undefined,
  isDebugCaptchaEnabled: boolean,
): CaptchaProvider {
  if (rawProvider === 'googleRecaptchaV2' || rawProvider === 'googleRecaptchaEnterprise') {
    return 'googleRecaptchaEnterprise';
  }

  if (rawProvider === 'mock' && isDebugCaptchaEnabled) {
    return 'mock';
  }

  return 'googleRecaptchaEnterprise';
}

export function useCaptchaPage(): UseCaptchaPageReturn {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const isDebugCaptchaEnabled = import.meta.env.VITE_ENABLE_DEBUG_CAPTCHA === 'true';

  const configuredProvider = useMemo(
    () => resolveCaptchaProvider(import.meta.env.VITE_CAPTCHA_PROVIDER, isDebugCaptchaEnabled),
    [isDebugCaptchaEnabled],
  );
  const [selectedProvider, setSelectedProvider] = useState<CaptchaProvider>(configuredProvider);

  const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '').trim();

  const shouldFallbackToMock =
    isDebugCaptchaEnabled &&
    selectedProvider === 'googleRecaptchaEnterprise' &&
    recaptchaSiteKey.length === 0;

  const effectiveProvider: CaptchaProvider = shouldFallbackToMock ? 'mock' : selectedProvider;

  const isUsingMockFallback = shouldFallbackToMock;

  const handleProviderChange = useCallback(
    (provider: CaptchaProvider) => {
      if (!isDebugCaptchaEnabled) {
        return;
      }

      setSelectedProvider(provider);
      setToken(null);
      setFeedbackMessage(null);
    },
    [isDebugCaptchaEnabled],
  );

  const handleMockToggle = useCallback(
    (checked: boolean) => {
      if (!isDebugCaptchaEnabled) {
        return;
      }

      if (checked) {
        setToken(`mock-token-${Date.now()}`);
      } else {
        setToken(null);
      }

      setFeedbackMessage(null);
    },
    [isDebugCaptchaEnabled],
  );

  const handleCaptchaTokenChange = useCallback((nextToken: string | null) => {
    setToken(nextToken);
    setFeedbackMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    setFeedbackMessage(null);

    if (effectiveProvider === 'googleRecaptchaEnterprise' && recaptchaSiteKey.length === 0) {
      setFeedbackMessage('reCAPTCHA 사이트 키가 비어 있습니다. `.env.local`을 확인해 주세요.');
      return;
    }

    if (!token) {
      setFeedbackMessage('캡차를 먼저 완료해 주세요.');
      return;
    }

    if (effectiveProvider === 'mock') {
      setFeedbackMessage('Mock 캡차 검증이 완료되었습니다. 로딩 화면으로 이동합니다.');
      void navigate({ to: '/loading' });
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
  }, [effectiveProvider, navigate, recaptchaSiteKey, token]);

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
