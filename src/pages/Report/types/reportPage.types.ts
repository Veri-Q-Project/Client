export type ReportSection = {
  id: string;
  items: string[];
  summary: string;
  title: string;
};

export type ReportPageData = {
  reportTitle: string;
  riskLevel: 'safe' | 'warning' | 'critical';
  scannedAt: string;
  scannedUrl: string;
  sections: ReportSection[];
};
