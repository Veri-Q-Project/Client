export type BackendScanResponse = Record<string, unknown> & {
  analysisTime?: string | null;
  decodedUrl?: string | null;
  isUrl?: boolean | null;
  riskLevel?: string | null;
  schemeType?: string | null;
};
