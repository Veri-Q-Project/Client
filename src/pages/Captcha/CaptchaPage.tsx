import { qrBlackIcon } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import { useCaptchaPage } from './hooks/useCaptchaPage';
import * as styles from './styles/captchaPage.css';
import CaptchaWidget from './ui/CaptchaWidget';

export default function CaptchaPage() {
  const {
    canSubmit,
    feedbackMessage,
    handleCaptchaTokenChange,
    handleSubmit,
    isVerifying,
    recaptchaSiteKey,
  } = useCaptchaPage();

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrBlackIcon} />

      <section className={styles.shell}>
        <header className={styles.intro}>
          <h1 className={styles.title}>너무 많은 요청이 감지되었습니다.</h1>
          <p className={styles.description}>계속하려면 아래 캡차 검증을 완료해 주세요.</p>
        </header>

        <section className={styles.card}>
          <p className={styles.providerLabel}>Google reCAPTCHA Enterprise</p>

          <div className={styles.widgetFrame}>
            <CaptchaWidget
              onTokenChange={handleCaptchaTokenChange}
              recaptchaSiteKey={recaptchaSiteKey}
            />
          </div>

          <p className={styles.captchaHint}>
            체크 후 바로 통과될 수도 있고, 필요 시 이미지 문제 풀이가 추가로 표시됩니다.
          </p>
        </section>

        <div className={styles.footer}>
          <button
            className={styles.verifyButton}
            disabled={!canSubmit || isVerifying}
            onClick={() => {
              void handleSubmit();
            }}
            type="button"
          >
            {isVerifying ? '검증 중...' : '검증하고 계속'}
          </button>

          {feedbackMessage ? <p className={styles.feedback}>{feedbackMessage}</p> : null}
        </div>
      </section>
    </main>
  );
}
