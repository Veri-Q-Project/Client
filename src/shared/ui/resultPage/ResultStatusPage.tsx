import type { ComponentProps, ReactNode } from 'react';

import type { ResultSafeData } from '@/shared/api/result-safe';
import {
  ReportToggleButton,
  ResultActionButtons,
  RiskLevelCard,
  SafeSiteCard,
  TrustScoreCard,
} from '@/shared/component';
import { qrIconByTone } from '@/shared/icon/resultIcons';
import type { ResultTone } from '@/shared/types/resultTone';
import AppHeader from '@/shared/ui/app-header';

import * as styles from './resultPage.css';

type RiskLevelCardOptions = ComponentProps<typeof RiskLevelCard>;
type SafeSiteCardOptions = Pick<
  ComponentProps<typeof SafeSiteCard>,
  'badgeLabel' | 'siteMeta' | 'statusLabel' | 'tone' | 'visitLabel'
>;
type ResultActionOptions = Pick<
  ComponentProps<typeof ResultActionButtons>,
  'onReportClick' | 'reportLabel'
>;

type ResultStatusPageProps = {
  actionButtons?: ResultActionOptions;
  hero: ReactNode;
  onRescanClick: () => void;
  onShareClick: ComponentProps<typeof ResultActionButtons>['onShareClick'];
  onViewReportClick: () => void;
  onVisitClick: () => void;
  resultData: ResultSafeData;
  riskLevelCard?: RiskLevelCardOptions;
  siteCard?: SafeSiteCardOptions;
  tone: ResultTone;
};

export default function ResultStatusPage({
  actionButtons,
  hero,
  onRescanClick,
  onShareClick,
  onViewReportClick,
  onVisitClick,
  resultData,
  riskLevelCard,
  siteCard,
  tone,
}: ResultStatusPageProps) {
  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrIconByTone[tone]} />

      <div className={styles.shell}>
        <section className={styles.content}>
          {hero}

          <section className={styles.metricsGrid}>
            <TrustScoreCard score={resultData.trustScore} tone={tone} />
            <RiskLevelCard {...riskLevelCard} tone={riskLevelCard?.tone ?? tone} />
          </section>

          <SafeSiteCard
            {...siteCard}
            onVisitClick={onVisitClick}
            siteName={resultData.siteName}
            siteUrl={resultData.siteUrl}
            tone={siteCard?.tone ?? tone}
          />

          <ResultActionButtons
            onReportClick={actionButtons?.onReportClick}
            onRescanClick={onRescanClick}
            onShareClick={onShareClick}
            reportLabel={actionButtons?.reportLabel}
          />

          <ReportToggleButton isOpen={false} onToggle={onViewReportClick} />

          <p className={styles.footer}>
            Veri-Q Security Engine v2.4.1 (c) 2024. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}
