import { createFileRoute } from '@tanstack/react-router';

import { CaptchaScreen } from '@/screens/captcha';

export const Route = createFileRoute('/captcha')({
  component: CaptchaScreen,
});
