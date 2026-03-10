import {
  ReportToggleButton,
  ResultActionButtons,
  RiskLevelCard,
  SafeSiteCard,
  TrustScoreCard,
} from '@/shared/component';
import qrYellowIcon from '@/shared/icon/QRyellow.svg';
import AppHeader from '@/shared/ui/app-header';

import { useResultWarningPage } from './hooks/useResultWarningPage';
import * as styles from './styles/resultWarningPage.css';
import ResultWarningHero from './ui/ResultWarningHero';
import ResultWarningReportPanel from './ui/ResultWarningReportPanel';

export default function ResultWarningPage() {
  const {
    handleOpenVisitSite,
    handleRescan,
    handleShareResult,
    handleToggleReport,
    isReportOpen,
    resultWarningData,
  } = useResultWarningPage();

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrYellowIcon} />

      <div className={styles.shell}>
        <section className={styles.content}>
          <ResultWarningHero />

          <section className={styles.metricsGrid}>
            <TrustScoreCard score={resultWarningData.trustScore} tone="warning" />
            <RiskLevelCard description="의심 패턴이 일부 감지됨" levelText="주의" tone="warning" />
          </section>

          <SafeSiteCard
            badgeLabel="!"
            onVisitClick={handleOpenVisitSite}
            siteName={resultWarningData.siteName}
            siteUrl={resultWarningData.siteUrl}
            tone="warning"
          />

          <ResultActionButtons onRescanClick={handleRescan} onShareClick={handleShareResult} />

          <ReportToggleButton isOpen={isReportOpen} onToggle={handleToggleReport} />

          {isReportOpen ? <ResultWarningReportPanel /> : null}

          <p className={styles.footer}>
            Veri-Q Security Engine v2.4.1 (c) 2024. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}
