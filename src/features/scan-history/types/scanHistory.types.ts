export type ScanHistoryStatus = 'safe' | 'warning' | 'critical';

export type ScanHistoryItem = {
  id: string;
  scannedAt: string;
  status: ScanHistoryStatus;
  url: string;
};

export type ScanHistoryData = {
  items: ScanHistoryItem[];
  uuid: string;
};
