import { createFileRoute } from '@tanstack/react-router';

import { ResultSafeScreen } from '@/screens/result-safe';

export const Route = createFileRoute('/result/safe')({
  component: ResultSafeScreen,
});
