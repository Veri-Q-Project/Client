export type BackendScanResponse = Record<string, unknown> & {
  decodedUrl?: string | null;
  isUrl?: boolean | null;
  riskLevel?: string | null;
  schemeType?: string | null;
};
