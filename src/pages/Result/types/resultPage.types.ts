import type { ResultTone } from '@/shared/types/resultTone';

export type ResultPageData = {
  detailUnavailable?: boolean;
  previewUrl: string;
  riskLevel: ResultTone;
  siteMeta: string;
  siteName: string;
  siteUrl: string;
  trustScore: number;
  visitUrl: string;
};
