import { createFileRoute } from '@tanstack/react-router';

import { LoadingScreen } from '@/screens/loading';

export const Route = createFileRoute('/loading')({
  component: LoadingScreen,
});
