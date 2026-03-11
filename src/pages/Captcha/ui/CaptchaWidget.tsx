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

function isEnterpriseApiReady() {
  return typeof window.grecaptcha?.enterprise?.render === 'function';
}

function loadEnterpriseScript(): Promise<void> {
  if (isEnterpriseApiReady()) {
    return Promise.resolve();
  }

  if (enterpriseScriptPromise) {
    return enterpriseScriptPromise;
  }

  const scriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-recaptcha-enterprise="true"]',
    );

    const onLoad = () => {
      if (isEnterpriseApiReady()) {
        resolve();
        return;
      }

      reject(new Error('Enterprise API is not ready after script load'));
    };

    const onError = () => {
      reject(new Error('Failed to load reCAPTCHA Enterprise script'));
    };

    if (existingScript) {
      const loadStatus = existingScript.dataset.loadStatus;

      if (loadStatus === 'loaded' || isEnterpriseApiReady()) {
        onLoad();
        return;
      }

      if (loadStatus === 'error') {
        onError();
        return;
      }

      existingScript.addEventListener('load', onLoad, { once: true });
      existingScript.addEventListener('error', onError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.dataset.loadStatus = 'loading';
    script.dataset.recaptchaEnterprise = 'true';
    script.src = 'https://www.google.com/recaptcha/enterprise.js?render=explicit';

    script.onload = () => {
      script.dataset.loadStatus = 'loaded';
      onLoad();
    };

    script.onerror = () => {
      script.dataset.loadStatus = 'error';
      onError();
    };

    document.head.appendChild(script);
  }).catch((error) => {
    enterpriseScriptPromise = null;
    throw error;
  });

  enterpriseScriptPromise = scriptPromise;
  return scriptPromise;
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
