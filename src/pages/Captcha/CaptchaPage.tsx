import { qrBlackIcon } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import { useCaptchaPage } from './hooks/useCaptchaPage';
import * as styles from './styles/captchaPage.css';
import CaptchaWidget from './ui/CaptchaWidget';

export default function CaptchaPage() {
  const {
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
  } = useCaptchaPage();

  const isSuccessFeedback =
    feedbackMessage.length > 0 && feedbackMessage === '캡차 검증에 성공했습니다.';

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrBlackIcon} />

      <section className={styles.shell}>
        <div className={styles.content}>
          <header className={styles.hero}>
            <h1 className={styles.heroTitle}>너무 많은 요청이 감지되었습니다.</h1>
            <p className={styles.heroDescription}>계속하려면 아래 캡차 검증을 완료해 주세요.</p>
          </header>

          {!isCaptchaConfigured || !isSupportedProvider ? (
            <div className={styles.missingConfigNotice}>{providerStatusMessage}</div>
          ) : null}

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Google reCAPTCHA v2 (체크박스)</h2>

            <div className={styles.widgetWrap}>
              {isCaptchaConfigured && isSupportedProvider ? (
                <CaptchaWidget
                  onLoadError={handleLoadError}
                  onTokenChange={handleTokenChange}
                  resetSignal={resetSignal}
                  siteKey={siteKey}
                />
              ) : null}
            </div>

            <p className={styles.helperText}>
              체크 후 바로 통과될 수도 있고, 필요 시 이미지 문제가 추가로 표시됩니다.
            </p>
          </section>

          <button
            className={styles.submitButton}
            disabled={!canSubmit}
            onClick={() => {
              void handleSubmit();
            }}
            type="button"
          >
            {isVerifying ? '검증 중...' : '검증하고 계속'}
          </button>

          <p
            aria-live="polite"
            className={`${styles.feedback} ${
              isSuccessFeedback ? styles.feedbackSuccess : styles.feedbackError
            }`}
            role="status"
          >
            {feedbackMessage}
          </p>

          <section className={styles.guideCard}>
            <h2 className={styles.guideTitle}>운영 배포 체크</h2>
            <ul className={styles.guideList}>
              <li>Vercel 환경변수에 VITE_RECAPTCHA_SITE_KEY를 등록합니다.</li>
              <li>Vercel 환경변수에 CAPTCHA_SECRET_KEY를 등록합니다.</li>
              <li>VITE_CAPTCHA_VERIFY_ENDPOINT가 비어 있으면 /api/captcha/verify를 사용합니다.</li>
            </ul>
          </section>

          <p className={styles.footerHint}>
            배포 환경에서는 Vercel Function이 Google reCAPTCHA 검증 요청을 처리합니다.
          </p>
        </div>
      </section>
    </main>
  );
}
