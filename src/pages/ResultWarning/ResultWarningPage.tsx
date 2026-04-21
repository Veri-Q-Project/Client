import { ResultStatusPage } from '@/shared/ui/resultPage';

import { useResultWarningPage } from './hooks/useResultWarningPage';
import ResultWarningHero from './ui/ResultWarningHero';

export default function ResultWarningPage() {
  const {
    handleOpenVisitSite,
    handleRescan,
    handleShareResult,
    handleViewReport,
    resultWarningData,
  } = useResultWarningPage();

  if (!resultWarningData) {
    return null;
  }

  return (
    <ResultStatusPage
      hero={<ResultWarningHero />}
      onRescanClick={handleRescan}
      onShareClick={handleShareResult}
      onViewReportClick={handleViewReport}
      onVisitClick={handleOpenVisitSite}
      resultData={resultWarningData}
      riskLevelCard={{
        description: '의심 패턴이 일부 감지됨',
        levelText: '주의',
      }}
      siteCard={{
        badgeLabel: '!',
        visitLabel: '주의하여 사이트 방문하기',
      }}
      tone="warning"
    />
  );
}
