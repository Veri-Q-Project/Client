import { ResultStatusPage } from '@/shared/ui/resultPage';

import { useResultCriticalPage } from './hooks/useResultCriticalPage';
import ResultCriticalHero from './ui/ResultCriticalHero';

export default function ResultCriticalPage() {
  const {
    handleBlockAccess,
    handleReport,
    handleRescan,
    handleShareResult,
    handleViewReport,
    resultCriticalData,
  } = useResultCriticalPage();

  if (!resultCriticalData) {
    return null;
  }

  return (
    <ResultStatusPage
      actionButtons={{
        onReportClick: handleReport,
        reportLabel: '신고하기',
      }}
      hero={<ResultCriticalHero />}
      onRescanClick={handleRescan}
      onShareClick={handleShareResult}
      onViewReportClick={handleViewReport}
      onVisitClick={handleBlockAccess}
      resultData={resultCriticalData}
      riskLevelCard={{
        description: '피싱 의심 패턴이 강하게 감지됨',
        levelText: '위험',
      }}
      siteCard={{
        badgeLabel: '!',
        statusLabel: '위험',
        visitLabel: '접속 차단',
      }}
      tone="critical"
    />
  );
}
