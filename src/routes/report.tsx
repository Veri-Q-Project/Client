import { createFileRoute } from '@tanstack/react-router';

import { ReportScreen } from '@/screens/report';

export const Route = createFileRoute('/report')({
  component: ReportScreen,
});
