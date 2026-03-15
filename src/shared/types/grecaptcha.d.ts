declare global {
  type RecaptchaWidgetId = number;

  type GrecaptchaRenderParameters = {
    callback?: (token: string) => void;
    'error-callback'?: () => void;
    'expired-callback'?: () => void;
    sitekey: string;
    theme?: 'dark' | 'light';
  };

  type Grecaptcha = {
    getResponse: (widgetId?: RecaptchaWidgetId) => string;
    ready: (callback: () => void) => void;
    render: (
      container: HTMLElement | string,
      parameters: GrecaptchaRenderParameters,
    ) => RecaptchaWidgetId;
    reset: (widgetId?: RecaptchaWidgetId) => void;
  };

  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

export {};
