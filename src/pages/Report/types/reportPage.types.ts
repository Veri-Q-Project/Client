import type { ResultTone } from '@/shared/types/resultTone';

export type ReportStatusTone = 'error' | 'success' | 'warning';

export type ReportReputationSummary = {
  domainAgeText: string;
  reportCount: number;
};

export type ReportServerInfo = {
  certificateIssuer: string;
  certificateStatusTone: ReportStatusTone;
  certificateStatusText: string;
  certificateValidityPeriod: string;
  serverLocation: string;
  serverType: string;
};

export type ReportUrlAnalysis = {
  destinationUrl: string;
  originalUrl: string;
};

export type ReportDomainComparison = {
  officialUrl: string;
  riskBadgeText: string;
  summary: string;
  suspiciousUrl: string;
};

export type ReportReputation = {
  detailDescription: string;
  providerName: string;
  providerStatusText: string;
  summary: ReportReputationSummary;
};

export type ReportPageData = {
  detectedRiskTypes: string[];
  domainComparison: ReportDomainComparison;
  reputation: ReportReputation;
  reportTitle: string;
  riskDescription: string;
  riskLevel: ResultTone;
  riskLevelText: string;
  scannedAt: string;
  scannedUrl: string;
  serverInfo: ReportServerInfo;
  trustScore: number;
  urlAnalysis: ReportUrlAnalysis;
};
