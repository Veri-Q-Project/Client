import { ensureScanDetail } from '@/shared/lib/scan-session/ensureScanDetail';
import { getScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { toReportPageData } from '../lib/toReportPageData';

import type { ReportPageData } from '../types/reportPage.types';

function hasReportSourceSession(): boolean {
  const session = getScanSessionSnapshot();

  return Boolean(
    session.analysisDetail ||
    session.finalResult ||
    session.scanResponse ||
    session.historySelection,
  );
}

export async function fetchReportPageData(): Promise<ReportPageData> {
  const session = await ensureScanDetail();
  return toReportPageData(session);
}

export function getInitialReportPageData(): ReportPageData | null {
  if (!hasReportSourceSession()) {
    return null;
  }

  return toReportPageData(getScanSessionSnapshot());
}
