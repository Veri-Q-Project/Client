export type ScanHistoryStatus = 'safe' | 'warning' | 'critical';

export type ScanHistoryItem = {
  id: string;
  isUrl: boolean | null;
  scannedAt: string;
  schemeType: string | null;
  status: ScanHistoryStatus;
  url: string;
};

export type ScanHistoryData = {
  items: ScanHistoryItem[];
  uuid: string;
};
