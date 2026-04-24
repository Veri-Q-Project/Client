import type { ComponentProps, ReactNode } from 'react';

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
import * as styles from '@/shared/ui/resultPage/resultPage.css';

type RiskLevelCardOptions = ComponentProps<typeof RiskLevelCard>;
type SafeSiteCardOptions = Pick<
  ComponentProps<typeof SafeSiteCard>,
  'badgeLabel' | 'siteMeta' | 'statusLabel' | 'tone' | 'visitLabel'
>;
type ResultActionOptions = Pick<
  ComponentProps<typeof ResultActionButtons>,
  'onReportClick' | 'reportLabel'
>;

type ResultStatusPageData = {
  siteMeta: string;
  siteName: string;
  siteUrl: string;
  trustScore: number;
};

type ResultStatusPageProps = {
  actionButtons?: ResultActionOptions;
  hero: ReactNode;
  onRescanClick: () => void;
  onShareClick: ComponentProps<typeof ResultActionButtons>['onShareClick'];
  onViewReportClick: () => void;
  onVisitClick: () => void;
  resultData: ResultStatusPageData;
  riskLevelCard?: RiskLevelCardOptions;
  siteCard?: SafeSiteCardOptions;
  showMetrics?: boolean;
  showReportToggle?: boolean;
  tone: ResultTone;
};

const SECURITY_ENGINE_VERSION = 'v2.4.1';

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
  showMetrics = true,
  showReportToggle = true,
  tone,
}: ResultStatusPageProps) {
  const currentYear = new Date().getFullYear();

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrIconByTone[tone]} />

      <div className={styles.shell}>
        <section className={styles.content}>
          {hero}

          {showMetrics ? (
            <section className={styles.metricsGrid}>
              <TrustScoreCard score={resultData.trustScore} tone={tone} />
              <RiskLevelCard {...riskLevelCard} tone={riskLevelCard?.tone ?? tone} />
            </section>
          ) : null}

          <SafeSiteCard
            {...siteCard}
            onVisitClick={onVisitClick}
            siteMeta={siteCard?.siteMeta ?? resultData.siteMeta}
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

          {showReportToggle ? (
            <ReportToggleButton isOpen={false} onToggle={onViewReportClick} />
          ) : null}

          <p className={styles.footer}>
            {`Veri-Q Security Engine ${SECURITY_ENGINE_VERSION} (c) ${currentYear}. All rights reserved.`}
          </p>
        </section>
      </div>
    </main>
  );
}
