import {
  ReportToggleButton,
  ResultActionButtons,
  RiskLevelCard,
  SafeSiteCard,
  TrustScoreCard,
} from '@/shared/component';
import qrRedIcon from '@/shared/icon/QRred.svg';
import AppHeader from '@/shared/ui/app-header';

import { useResultCriticalPage } from './hooks/useResultCriticalPage';
import * as styles from './styles/resultCriticalPage.css';
import ResultCriticalHero from './ui/ResultCriticalHero';
import ResultCriticalReportPanel from './ui/ResultCriticalReportPanel';

export default function ResultCriticalPage() {
  const {
    handleBlockAccess,
    handleReport,
    handleRescan,
    handleShareResult,
    handleToggleReport,
    isReportOpen,
    resultCriticalData,
  } = useResultCriticalPage();

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrRedIcon} />

      <div className={styles.shell}>
        <section className={styles.content}>
          <ResultCriticalHero />

          <section className={styles.metricsGrid}>
            <TrustScoreCard score={resultCriticalData.trustScore} tone="critical" />
            <RiskLevelCard
              description="피싱 의심 패턴이 강하게 감지됨"
              levelText="위험"
              tone="critical"
            />
          </section>

          <SafeSiteCard
            badgeLabel="!"
            onVisitClick={handleBlockAccess}
            siteName={resultCriticalData.siteName}
            siteUrl={resultCriticalData.siteUrl}
            statusLabel="위험"
            tone="critical"
            visitLabel="접속 차단"
          />

          <ResultActionButtons
            onReportClick={handleReport}
            onRescanClick={handleRescan}
            onShareClick={handleShareResult}
            reportLabel="신고하기"
          />

          <ReportToggleButton isOpen={isReportOpen} onToggle={handleToggleReport} />

          {isReportOpen ? <ResultCriticalReportPanel /> : null}

          <p className={styles.footer}>
            Veri-Q Security Engine v2.4.1 (c) 2024. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}
