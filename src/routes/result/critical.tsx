import { createFileRoute } from '@tanstack/react-router';

import { ResultCriticalScreen } from '@/screens/result-critical';

export const Route = createFileRoute('/result/critical')({
  component: ResultCriticalScreen,
});
