import { qrBlackIcon } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import { useCaptchaPage } from './hooks/useCaptchaPage';
import * as styles from './styles/captchaPage.css';
import CaptchaWidget from './ui/CaptchaWidget';

export default function CaptchaPage() {
  const {
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
  } = useCaptchaPage();

  const isDebugCaptchaEnabled = import.meta.env.VITE_ENABLE_DEBUG_CAPTCHA === 'true';

  const providerLabel =
    effectiveProvider === 'googleRecaptchaEnterprise'
      ? 'Google reCAPTCHA Enterprise (체크박스)'
      : 'Mock Captcha (테스트 모드)';

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrBlackIcon} />

      <section className={styles.shell}>
        <header className={styles.intro}>
          <h1 className={styles.title}>너무 많은 요청이 감지되었습니다.</h1>
          <p className={styles.description}>계속하려면 아래 캡차 검증을 완료해 주세요.</p>
        </header>

        <section className={styles.card}>
          {isDebugCaptchaEnabled ? (
            <div className={styles.modeSwitch}>
              <button
                className={`${styles.modeButton} ${selectedProvider === 'mock' ? styles.modeButtonActive : ''}`}
                onClick={() => {
                  handleProviderChange('mock');
                }}
                type="button"
              >
                Mock
              </button>
              <button
                className={`${styles.modeButton} ${
                  selectedProvider === 'googleRecaptchaEnterprise' ? styles.modeButtonActive : ''
                }`}
                onClick={() => {
                  handleProviderChange('googleRecaptchaEnterprise');
                }}
                type="button"
              >
                Google Enterprise
              </button>
            </div>
          ) : null}

          <p className={styles.providerLabel}>{providerLabel}</p>

          <div className={styles.widgetFrame}>
            <CaptchaWidget
              onMockToggle={handleMockToggle}
              onTokenChange={handleCaptchaTokenChange}
              provider={effectiveProvider}
              recaptchaSiteKey={recaptchaSiteKey}
              token={token}
            />
          </div>

          {isDebugCaptchaEnabled && isUsingMockFallback ? (
            <p className={styles.fallbackMessage}>
              Google Enterprise를 선택했지만 `VITE_RECAPTCHA_SITE_KEY`가 없어 Mock로 자동
              전환되었습니다.
            </p>
          ) : null}

          {effectiveProvider === 'googleRecaptchaEnterprise' ? (
            <p className={styles.captchaHint}>
              체크 후 바로 통과될 수도 있고, 필요 시 이미지 문제 풀이가 추가로 표시됩니다.
            </p>
          ) : null}
        </section>

        <div className={styles.footer}>
          <button
            className={styles.verifyButton}
            disabled={isVerifying}
            onClick={() => {
              void handleSubmit();
            }}
            type="button"
          >
            {isVerifying ? '검증 중...' : '검증하고 계속'}
          </button>

          {feedbackMessage ? <p className={styles.feedback}>{feedbackMessage}</p> : null}

          {isDebugCaptchaEnabled ? (
            <>
              <p className={styles.envHint}>현재 기본 설정값: {configuredProvider}</p>
              <p className={styles.envHint}>
                `.env.local`에 `VITE_ENABLE_DEBUG_CAPTCHA=true`를 설정하면 Mock/Provider 토글이
                노출됩니다.
              </p>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
