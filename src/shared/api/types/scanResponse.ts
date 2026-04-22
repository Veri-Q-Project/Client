export type BackendScanResponse = Record<string, unknown> & {
  analysisTime?: string | null;
  decodedUrl?: string | null;
  isUrl?: boolean | null;
  is_url?: boolean | null;
  riskLevel?: string | null;
  risk_level?: string | null;
  schemeType?: string | null;
  scheme_type?: string | null;
};
