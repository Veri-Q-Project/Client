export type ScanHistoryStatus = 'safe' | 'warning' | 'critical';

export type ScanHistoryItem = {
  id: string;
  scannedAt: string;
  title: string;
  url: string;
  status: ScanHistoryStatus;
};

export type ScanHistoryPageData = {
  items: ScanHistoryItem[];
};
