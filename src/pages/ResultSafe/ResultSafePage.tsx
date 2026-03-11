import {
  ReportToggleButton,
  ResultActionButtons,
  RiskLevelCard,
  SafeSiteCard,
  TrustScoreCard,
} from '@/shared/component';
import { qrIconByTone } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import { useResultSafePage } from './hooks/useResultSafePage';
import * as styles from './styles/resultSafePage.css';
import ResultSafeHero from './ui/ResultSafeHero';
import ResultSafeReportPanel from './ui/ResultSafeReportPanel';

export default function ResultSafePage() {
  const {
    handleOpenVisitSite,
    handleRescan,
    handleShareResult,
    handleToggleReport,
    isReportOpen,
    resultSafeData,
  } = useResultSafePage();

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrIconByTone.safe} />

      <div className={styles.shell}>
        <section className={styles.content}>
          <ResultSafeHero />

          <section className={styles.metricsGrid}>
            <TrustScoreCard score={resultSafeData.trustScore} />
            <RiskLevelCard />
          </section>

          <SafeSiteCard
            onVisitClick={handleOpenVisitSite}
            siteName={resultSafeData.siteName}
            siteUrl={resultSafeData.siteUrl}
          />

          <ResultActionButtons onRescanClick={handleRescan} onShareClick={handleShareResult} />

          <ReportToggleButton isOpen={isReportOpen} onToggle={handleToggleReport} />

          {isReportOpen ? <ResultSafeReportPanel /> : null}

          <p className={styles.footer}>
            Veri-Q Security Engine v2.4.1 (c) 2024. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}
