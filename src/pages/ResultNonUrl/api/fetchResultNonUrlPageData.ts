import { getScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { toResultNonUrlPageData } from '../lib/toResultNonUrlPageData';

import type { ResultNonUrlPageData } from '../types/resultNonUrlPage.types';

function hasNonUrlResultSession(): boolean {
  const session = getScanSessionSnapshot();
  return Boolean(session.finalResult || session.scanResponse || session.historySelection);
}

export async function fetchResultNonUrlPageData(): Promise<ResultNonUrlPageData> {
  if (hasNonUrlResultSession()) {
    return toResultNonUrlPageData(getScanSessionSnapshot());
  }

  throw new Error('SCAN_SESSION_REQUIRED');
}

export function getInitialResultNonUrlPageData(): ResultNonUrlPageData | null {
  if (!hasNonUrlResultSession()) {
    return null;
  }

  return toResultNonUrlPageData(getScanSessionSnapshot());
}
