import { ResultStatusPage } from '@/shared/ui/resultPage';

import { useResultSafePage } from './hooks/useResultSafePage';
import ResultSafeHero from './ui/ResultSafeHero';

export default function ResultSafePage() {
  const { handleOpenVisitSite, handleRescan, handleShareResult, handleViewReport, resultSafeData } =
    useResultSafePage();

  if (!resultSafeData) {
    return null;
  }

  return (
    <ResultStatusPage
      hero={<ResultSafeHero />}
      onRescanClick={handleRescan}
      onShareClick={handleShareResult}
      onViewReportClick={handleViewReport}
      onVisitClick={handleOpenVisitSite}
      resultData={resultSafeData}
      tone="safe"
    />
  );
}
