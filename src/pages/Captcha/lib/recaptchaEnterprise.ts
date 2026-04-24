const DEFAULT_RECAPTCHA_ACTION = 'USER_ACTION';

type GrecaptchaEnterprise = {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  ready: (callback: () => void) => void;
};

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: GrecaptchaEnterprise;
    };
  }
}

let enterpriseScriptPromise: Promise<void> | null = null;

function getEnterpriseApi(): GrecaptchaEnterprise | null {
  return window.grecaptcha?.enterprise ?? null;
}

function isEnterpriseApiReady(): boolean {
  return typeof window.grecaptcha?.enterprise?.execute === 'function';
}

export function loadRecaptchaEnterprise(siteKey: string): Promise<void> {
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

      reject(new Error('Enterprise API is not ready after script load.'));
    };

    const onError = () => {
      reject(new Error('Failed to load reCAPTCHA Enterprise script.'));
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
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(siteKey)}`;

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

export async function executeRecaptchaEnterprise(
  siteKey: string,
  action = DEFAULT_RECAPTCHA_ACTION,
): Promise<string> {
  await loadRecaptchaEnterprise(siteKey);

  const enterprise = getEnterpriseApi();

  if (!enterprise) {
    throw new Error('reCAPTCHA Enterprise API is unavailable.');
  }

  return new Promise((resolve, reject) => {
    enterprise.ready(() => {
      enterprise.execute(siteKey, { action }).then(resolve).catch(reject);
    });
  });
}
