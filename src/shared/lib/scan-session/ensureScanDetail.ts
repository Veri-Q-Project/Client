import { fetchScanDetail } from '@/shared/api/fetchScanDetail';
import { getScanSessionSnapshot, useScanSessionStore } from '@/shared/store/scanSessionStore';

export function resolveRequestedUrlFromSearch(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const requestedUrl = new URLSearchParams(window.location.search).get('url')?.trim();
  return requestedUrl && requestedUrl.length > 0 ? requestedUrl : null;
}

export async function ensureScanDetail(): Promise<ReturnType<typeof getScanSessionSnapshot>> {
  const session = getScanSessionSnapshot();

  if (session.analysisDetail) {
    return session;
  }

  const requestedUrl =
    session.decodedUrl ?? session.historySelection?.url ?? resolveRequestedUrlFromSearch();

  if (!requestedUrl) {
    throw new Error('SCAN_SESSION_REQUIRED');
  }

  const detail = await fetchScanDetail(requestedUrl);
  useScanSessionStore.getState().setAnalysisDetail(detail);
  return getScanSessionSnapshot();
}
