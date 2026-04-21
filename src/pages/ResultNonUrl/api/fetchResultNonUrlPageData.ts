import { toResultNonUrlData } from '@/shared/api/mappers/toResultNonUrlData';
import { getScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import type { ResultNonUrlPageData } from '../types/resultNonUrlPage.types';

function hasNonUrlResultSession(): boolean {
  const session = getScanSessionSnapshot();
  return Boolean(session.finalResult || session.scanResponse);
}

export async function fetchResultNonUrlPageData(): Promise<ResultNonUrlPageData> {
  if (hasNonUrlResultSession()) {
    return toResultNonUrlData(getScanSessionSnapshot());
  }

  throw new Error('SCAN_SESSION_REQUIRED');
}

export function getInitialResultNonUrlPageData(): ResultNonUrlPageData | null {
  if (!hasNonUrlResultSession()) {
    return null;
  }

  return toResultNonUrlData(getScanSessionSnapshot());
}
