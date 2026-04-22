export interface BackendAnalysisDetailResponse extends Record<string, unknown> {
  isUrl?: boolean | null;
  is_url?: boolean | null;
  riskLevel?: string | null;
  risk_level?: string | null;
  scanId?: string | null;
  scan_id?: string | null;
  schemeType?: string | null;
  scheme_type?: string | null;
  score?: number | string | null;
  status?: string | null;
  trustScore?: number | string | null;
  trust_score?: number | string | null;
}

export interface BackendHistoryItemResponse extends Record<string, unknown> {
  id?: string | null;
  isUrl?: boolean | null;
  is_url?: boolean | null;
  riskLevel?: string | null;
  risk_level?: string | null;
  scanId?: string | null;
  scan_id?: string | null;
  scannedAt?: string | null;
  scanned_at?: string | null;
  schemeType?: string | null;
  scheme_type?: string | null;
  score?: number | string | null;
  status?: string | null;
  typeInfo?: string | null;
  type_info?: string | null;
  url?: string | null;
}
