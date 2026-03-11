import { useEffect, useRef } from 'react';

import * as styles from '../styles/captchaPage.css';

import type { CaptchaProvider } from '../types/captcha.types';

type CaptchaWidgetProps = {
  onMockToggle: (checked: boolean) => void;
  onTokenChange: (token: string | null) => void;
  provider: CaptchaProvider;
  recaptchaSiteKey: string;
  token: string | null;
};

type GrecaptchaEnterprise = {
  ready: (callback: () => void) => void;
  render: (
    container: HTMLElement,
    parameters: {
      callback: (token: string) => void;
      'error-callback': () => void;
      'expired-callback': () => void;
      sitekey: string;
      theme?: 'light' | 'dark';
    },
  ) => number;
};

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: GrecaptchaEnterprise;
    };
  }
}

let enterpriseScriptPromise: Promise<void> | null = null;

function loadEnterpriseScript(): Promise<void> {
  if (enterpriseScriptPromise) {
    return enterpriseScriptPromise;
  }

  enterpriseScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-recaptcha-enterprise="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load script')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaEnterprise = 'true';
    script.src = 'https://www.google.com/recaptcha/enterprise.js?render=explicit';

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load script'));

    document.head.appendChild(script);
  });

  return enterpriseScriptPromise;
}

export default function CaptchaWidget({
  onMockToggle,
  onTokenChange,
  provider,
  recaptchaSiteKey,
  token,
}: CaptchaWidgetProps) {
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (provider !== 'googleRecaptchaEnterprise') {
      return;
    }

    const container = widgetContainerRef.current;

    if (!container || !recaptchaSiteKey) {
      return;
    }

    container.innerHTML = '';

    loadEnterpriseScript()
      .then(() => {
        const enterprise = window.grecaptcha?.enterprise;

        if (!enterprise) {
          onTokenChange(null);
          return;
        }

        enterprise.ready(() => {
          enterprise.render(container, {
            callback: (nextToken) => {
              onTokenChange(nextToken);
            },
            'error-callback': () => {
              onTokenChange(null);
            },
            'expired-callback': () => {
              onTokenChange(null);
            },
            sitekey: recaptchaSiteKey,
            theme: 'light',
          });
        });
      })
      .catch(() => {
        onTokenChange(null);
      });
  }, [onTokenChange, provider, recaptchaSiteKey]);

  if (provider === 'googleRecaptchaEnterprise') {
    return (
      <div className={styles.enterpriseBox}>
        <div ref={widgetContainerRef} />
      </div>
    );
  }

  return (
    <label className={styles.mockCheckbox}>
      <input
        checked={token !== null}
        className={styles.mockCheckboxInput}
        onChange={(event) => {
          onMockToggle(event.currentTarget.checked);
        }}
        type="checkbox"
      />
      <span className={styles.mockCheckboxIndicator} />
      <span className={styles.mockCheckboxText}>I&apos;m not a robot (Mock)</span>
    </label>
  );
}
