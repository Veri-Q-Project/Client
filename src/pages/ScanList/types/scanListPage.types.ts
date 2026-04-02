export type ScanListStatus = 'safe' | 'warning' | 'critical';

export type ScanListItem = {
  id: string;
  scannedAt: string;
  status: ScanListStatus;
  url: string;
};

export type ScanListPageData = {
  items: ScanListItem[];
  uuid: string;
};
