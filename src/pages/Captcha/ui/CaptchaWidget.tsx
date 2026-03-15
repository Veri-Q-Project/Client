import { useEffect, useRef } from 'react';

const RECAPTCHA_SCRIPT_ID = 'google-recaptcha-v2-script';
const RECAPTCHA_SCRIPT_SOURCE = 'https://www.google.com/recaptcha/api.js?render=explicit';

let recaptchaScriptPromise: Promise<Grecaptcha> | null = null;

function loadRecaptchaScript(): Promise<Grecaptcha> {
  if (window.grecaptcha) {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise<Grecaptcha>((resolve, reject) => {
    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID) as HTMLScriptElement | null;

    const resolveGrecaptcha = () => {
      if (window.grecaptcha) {
        resolve(window.grecaptcha);

        return;
      }

      recaptchaScriptPromise = null;
      reject(new Error('reCAPTCHA script loaded without grecaptcha.'));
    };

    const rejectScriptLoad = () => {
      recaptchaScriptPromise = null;
      reject(new Error('Failed to load reCAPTCHA script.'));
    };

    if (existingScript) {
      if (window.grecaptcha) {
        resolve(window.grecaptcha);

        return;
      }

      existingScript.addEventListener('load', resolveGrecaptcha, { once: true });
      existingScript.addEventListener('error', rejectScriptLoad, { once: true });

      return;
    }

    const script = document.createElement('script');
    script.id = RECAPTCHA_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = RECAPTCHA_SCRIPT_SOURCE;
    script.addEventListener('load', resolveGrecaptcha, { once: true });
    script.addEventListener('error', rejectScriptLoad, { once: true });
    document.head.append(script);
  }).catch((error) => {
    recaptchaScriptPromise = null;
    throw error;
  });

  return recaptchaScriptPromise;
}

type CaptchaWidgetProps = {
  onLoadError: (message: string) => void;
  onTokenChange: (token: string | null) => void;
  resetSignal: number;
  siteKey: string;
};

export default function CaptchaWidget({
  onLoadError,
  onTokenChange,
  resetSignal,
  siteKey,
}: CaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const loadErrorCallbackRef = useRef(onLoadError);
  const tokenCallbackRef = useRef(onTokenChange);

  useEffect(() => {
    loadErrorCallbackRef.current = onLoadError;
  }, [onLoadError]);

  useEffect(() => {
    tokenCallbackRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    let isMounted = true;

    async function renderCaptcha() {
      if (!containerRef.current) {
        return;
      }

      try {
        const grecaptcha = await loadRecaptchaScript();

        if (!isMounted || !containerRef.current) {
          return;
        }

        grecaptcha.ready(() => {
          if (!isMounted || !containerRef.current || widgetIdRef.current !== null) {
            return;
          }

          widgetIdRef.current = grecaptcha.render(containerRef.current, {
            callback: (token: string) => tokenCallbackRef.current(token),
            'error-callback': () => {
              tokenCallbackRef.current(null);
              loadErrorCallbackRef.current(
                '캡차 위젯에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
              );
            },
            'expired-callback': () => tokenCallbackRef.current(null),
            sitekey: siteKey,
            theme: 'light',
          });
        });
      } catch {
        loadErrorCallbackRef.current('Google reCAPTCHA 스크립트를 불러오지 못했습니다.');
      }
    }

    void renderCaptcha();

    return () => {
      isMounted = false;
    };
  }, [siteKey]);

  useEffect(() => {
    if (widgetIdRef.current === null || !window.grecaptcha) {
      return;
    }

    window.grecaptcha.reset(widgetIdRef.current);
  }, [resetSignal]);

  return <div ref={containerRef} />;
}
