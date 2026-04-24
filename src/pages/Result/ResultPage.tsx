import type { ResultTone } from '@/shared/types/resultTone';
import ResultHero from '@/shared/ui/resultHero';

import { DETAIL_UNAVAILABLE_MESSAGE } from './api/createResultPageFetcher';
import { useResultPage } from './hooks/useResultPage';
import ResultStatusPage from './ui/ResultStatusPage';

type ResultPageProps = {
  tone: ResultTone;
};

const resultViewConfig = {
  critical: {
    actionButtons: {
      reportLabel: '신고하기',
    },
    hero: (
      <ResultHero
        description="Veri-Q 분석 결과, 해당 QR 코드는 악성 위험 사이트로 분류되었습니다."
        title="위험! 악성 코드가 감지되어 접속을 권장하지 않는 사이트입니다."
        tone="critical"
      />
    ),
    riskLevelCard: {
      description: '실시간 위협 신호가 강하게 감지됨',
      levelText: '위험',
    },
    siteCard: {
      badgeLabel: '!',
      statusLabel: '위험',
      visitLabel: '접속 차단',
    },
  },
  safe: {
    actionButtons: undefined,
    hero: (
      <ResultHero
        description="Veri-Q 분석 결과, 해당 QR 코드는 검증된 안전한 웹사이트로 연결됩니다."
        title={
          <>
            안심하세요
            <br />
            안전한 사이트입니다
          </>
        }
        tone="safe"
      />
    ),
    riskLevelCard: undefined,
    siteCard: undefined,
  },
  warning: {
    actionButtons: undefined,
    hero: (
      <ResultHero
        description="Veri-Q 분석 결과, 해당 QR 코드는 주의가 필요한 웹사이트로 분류되었습니다."
        title={
          <>
            주의하세요
            <br />
            주의가 필요한 사이트입니다
          </>
        }
        tone="warning"
      />
    ),
    riskLevelCard: {
      description: '의심 신호 일부 감지됨',
      levelText: '주의',
    },
    siteCard: {
      badgeLabel: '!',
      visitLabel: '주의하며 사이트 방문하기',
    },
  },
} as const;

const detailUnavailableViewConfig = {
  hero: (
    <ResultHero
      description={DETAIL_UNAVAILABLE_MESSAGE}
      title={
        <>
          아직 분석 결과를
          <br />
          가져오지 못했습니다
        </>
      }
      tone="warning"
    />
  ),
  riskLevelCard: {
    description: '스캔 결과 상세 데이터가 준비되지 않았습니다.',
    levelText: '분석 대기',
    tone: 'warning' as const,
  },
  siteCard: {
    badgeLabel: '?',
    statusLabel: '분석 대기',
    tone: 'warning' as const,
    visitLabel: '다시 검사하기',
  },
} as const;

export default function ResultPage({ tone }: ResultPageProps) {
  const {
    handleReport,
    handleRescan,
    handleShareResult,
    handleViewReport,
    handleVisit,
    resultData,
  } = useResultPage(tone);
  const config = resultViewConfig[tone];
  const isDetailUnavailable = resultData?.detailUnavailable === true;
  const resolvedTone: ResultTone = isDetailUnavailable ? 'warning' : tone;

  if (!resultData) {
    return null;
  }

  return (
    <ResultStatusPage
      actionButtons={
        !isDetailUnavailable && config.actionButtons
          ? {
              onReportClick: handleReport,
              reportLabel: config.actionButtons.reportLabel,
            }
          : undefined
      }
      hero={isDetailUnavailable ? detailUnavailableViewConfig.hero : config.hero}
      onRescanClick={handleRescan}
      onShareClick={handleShareResult}
      onViewReportClick={handleViewReport}
      onVisitClick={isDetailUnavailable ? handleRescan : handleVisit}
      resultData={resultData}
      riskLevelCard={
        isDetailUnavailable ? detailUnavailableViewConfig.riskLevelCard : config.riskLevelCard
      }
      showMetrics={!isDetailUnavailable}
      showReportToggle={!isDetailUnavailable}
      siteCard={isDetailUnavailable ? detailUnavailableViewConfig.siteCard : config.siteCard}
      tone={resolvedTone}
    />
  );
}
