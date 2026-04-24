import { useEffect, useRef, useState } from 'react';

import { renderRecaptchaEnterprise, resetRecaptchaEnterprise } from '../lib/recaptchaEnterprise';
import * as styles from '../styles/captchaPage.css';

type CaptchaWidgetProps = {
  onTokenChange: (token: string | null) => void;
  recaptchaSiteKey: string;
};

export default function CaptchaWidget({ onTokenChange, recaptchaSiteKey }: CaptchaWidgetProps) {
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const container = widgetContainerRef.current;
    let disposed = false;
    let widgetId: number | null = null;
    const renderAbortController = new AbortController();

    if (!container || !recaptchaSiteKey) {
      return;
    }

    container.innerHTML = '';
    setLoadErrorMessage(null);

    renderRecaptchaEnterprise(container, {
      onError: () => {
        if (!disposed) {
          onTokenChange(null);
        }
      },
      onExpired: () => {
        if (!disposed) {
          onTokenChange(null);
        }
      },
      onToken: (token) => {
        if (!disposed) {
          onTokenChange(token);
        }
      },
      signal: renderAbortController.signal,
      siteKey: recaptchaSiteKey,
    })
      .then((nextWidgetId) => {
        widgetId = nextWidgetId;
      })
      .catch((error) => {
        if (disposed) {
          return;
        }

        console.error('Failed to render reCAPTCHA Enterprise widget.', error);
        onTokenChange(null);
        setLoadErrorMessage(
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : 'reCAPTCHA widget failed to load.',
        );
      });

    return () => {
      disposed = true;
      renderAbortController.abort();

      if (widgetId !== null) {
        resetRecaptchaEnterprise(widgetId);
      }

      container.innerHTML = '';
    };
  }, [onTokenChange, recaptchaSiteKey]);

  return (
    <div className={styles.enterpriseBox}>
      <div ref={widgetContainerRef} />
      {loadErrorMessage ? <p className={styles.captchaError}>{loadErrorMessage}</p> : null}
    </div>
  );
}
