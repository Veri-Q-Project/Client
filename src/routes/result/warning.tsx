import { createFileRoute } from '@tanstack/react-router';

import { ResultWarningScreen } from '@/screens/result-warning';

export const Route = createFileRoute('/result/warning')({
  component: ResultWarningScreen,
});
