type RenderCaptchaOptions = {
  onError: () => void;
  onExpired: () => void;
  onToken: (token: string) => void;
  signal?: AbortSignal;
  siteKey: string;
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
  reset?: (widgetId: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: {
      enterprise?: GrecaptchaEnterprise;
    };
  }
}

let enterpriseScriptPromise: Promise<void> | null = null;
const enterpriseScriptSources = [
  'https://www.google.com/recaptcha/enterprise.js?render=explicit',
  'https://www.recaptcha.net/recaptcha/enterprise.js?render=explicit',
] as const;
const enterpriseApiReadyTimeoutMs = 5_000;
const enterpriseApiReadyCheckIntervalMs = 50;

function getEnterpriseApi(): GrecaptchaEnterprise | null {
  return window.grecaptcha?.enterprise ?? null;
}

function isEnterpriseApiReady(): boolean {
  return typeof window.grecaptcha?.enterprise?.render === 'function';
}

function waitForEnterpriseApiReady(timeoutMs = enterpriseApiReadyTimeoutMs): Promise<void> {
  if (isEnterpriseApiReady()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const checkReady = () => {
      if (isEnterpriseApiReady()) {
        resolve();
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Enterprise API is not ready after script load.'));
        return;
      }

      window.setTimeout(checkReady, enterpriseApiReadyCheckIntervalMs);
    };

    checkReady();
  });
}

function buildScriptSelector(sourceUrl: string): string {
  return `script[data-recaptcha-enterprise-src="${sourceUrl}"]`;
}

function waitForScriptReady(script: HTMLScriptElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const onLoad = () => {
      void waitForEnterpriseApiReady().then(resolve).catch(reject);
    };

    const onError = () => {
      reject(new Error('Failed to load reCAPTCHA Enterprise script.'));
    };

    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
  });
}

async function loadEnterpriseScriptBySource(sourceUrl: string): Promise<void> {
  const existingScript = document.querySelector<HTMLScriptElement>(buildScriptSelector(sourceUrl));

  if (existingScript) {
    if (existingScript.dataset.loadStatus === 'loaded' || isEnterpriseApiReady()) {
      await waitForEnterpriseApiReady();
      return;
    }

    if (existingScript.dataset.loadStatus === 'error') {
      throw new Error('Failed to load reCAPTCHA Enterprise script.');
    }

    await waitForScriptReady(existingScript);
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.dataset.loadStatus = 'loading';
  script.dataset.recaptchaEnterprise = 'true';
  script.dataset.recaptchaEnterpriseSrc = sourceUrl;
  script.src = sourceUrl;

  const readyPromise = waitForScriptReady(script);

  script.onload = () => {
    script.dataset.loadStatus = 'loaded';
  };

  script.onerror = () => {
    script.dataset.loadStatus = 'error';
  };

  document.head.appendChild(script);
  await readyPromise;
}

export function loadRecaptchaEnterprise(): Promise<void> {
  if (isEnterpriseApiReady()) {
    return Promise.resolve();
  }

  if (enterpriseScriptPromise) {
    return enterpriseScriptPromise;
  }

  const scriptPromise = (async () => {
    let lastError: unknown = null;

    for (const sourceUrl of enterpriseScriptSources) {
      try {
        await loadEnterpriseScriptBySource(sourceUrl);

        if (isEnterpriseApiReady()) {
          return;
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError instanceof Error) {
      throw lastError;
    }

    throw new Error('Failed to load reCAPTCHA Enterprise script.');
  })().catch((error) => {
    enterpriseScriptPromise = null;
    throw error;
  });

  enterpriseScriptPromise = scriptPromise;
  return scriptPromise;
}

export async function renderRecaptchaEnterprise(
  container: HTMLElement,
  { onError, onExpired, onToken, signal, siteKey }: RenderCaptchaOptions,
): Promise<number> {
  if (signal?.aborted) {
    throw new Error('RECAPTCHA_RENDER_ABORTED');
  }

  await loadRecaptchaEnterprise();

  const enterprise = getEnterpriseApi();

  if (!enterprise) {
    throw new Error('reCAPTCHA Enterprise API is unavailable.');
  }

  return new Promise((resolve, reject) => {
    const abortError = new Error('RECAPTCHA_RENDER_ABORTED');
    const onAbort = () => {
      reject(abortError);
    };

    if (signal?.aborted) {
      reject(abortError);
      return;
    }

    signal?.addEventListener('abort', onAbort, { once: true });

    const detachAbortListener = () => {
      signal?.removeEventListener('abort', onAbort);
    };

    enterprise.ready(() => {
      if (signal?.aborted) {
        detachAbortListener();
        reject(abortError);
        return;
      }

      try {
        const widgetId = enterprise.render(container, {
          callback: onToken,
          'error-callback': onError,
          'expired-callback': onExpired,
          sitekey: siteKey,
          theme: 'light',
        });

        detachAbortListener();
        resolve(widgetId);
      } catch (error) {
        detachAbortListener();
        reject(error);
      }
    });
  });
}

export function resetRecaptchaEnterprise(widgetId: number): void {
  window.grecaptcha?.enterprise?.reset?.(widgetId);
}
