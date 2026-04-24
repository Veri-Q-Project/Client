import { useEffect, useRef } from 'react';

import { loadRecaptchaEnterprise } from '../lib/recaptchaEnterprise';

type CaptchaWidgetProps = {
  recaptchaSiteKey: string;
};

export default function CaptchaWidget({ recaptchaSiteKey }: CaptchaWidgetProps) {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!recaptchaSiteKey) {
      return;
    }

    isMountedRef.current = true;

    loadRecaptchaEnterprise(recaptchaSiteKey).catch((error) => {
      if (isMountedRef.current) {
        console.error('Failed to load reCAPTCHA Enterprise script.', error);
      }
    });

    return () => {
      isMountedRef.current = false;
    };
  }, [recaptchaSiteKey]);

  return null;
}
