import { createFileRoute } from '@tanstack/react-router';

import { ScanHistoryScreen } from '@/screens/scan-history';

export const Route = createFileRoute('/scan-history')({
  component: ScanHistoryScreen,
});
