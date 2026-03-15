import { resolveNonUrlActionContent } from '../constants/nonUrlActionCatalog';
import * as styles from '../styles/resultNonUrlPage.css';

import type { NonUrlActionType } from '../types/resultNonUrlPage.types';

type DetectedNonUrlActionSectionProps = {
  actionType: NonUrlActionType;
  sectionDescription: string;
  sectionNumber: string;
  sectionTitle: string;
  targetValue?: string;
};

export default function DetectedNonUrlActionSection({
  actionType,
  sectionDescription,
  sectionNumber,
  sectionTitle,
  targetValue,
}: DetectedNonUrlActionSectionProps) {
  const resolvedContent = resolveNonUrlActionContent(actionType, targetValue);

  return (
    <section className={styles.analysisSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>{sectionNumber}</span>

        <div className={styles.sectionHeaderTextBlock}>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
          <p className={styles.sectionDescription}>{sectionDescription}</p>
        </div>
      </div>

      <article className={styles.actionCard}>
        <div className={styles.actionCardHeader}>
          <div className={styles.actionAccent} />

          <div className={styles.actionHeaderTextBlock}>
            <h3 className={styles.actionTitle}>{resolvedContent.title}</h3>
            <p className={styles.actionEnglishLabel}>{resolvedContent.englishLabel}</p>
          </div>
        </div>

        <div className={styles.actionBody}>
          <div className={styles.detailLabelRow}>
            <span aria-hidden className={styles.detailLabelDot} />
            <p className={styles.detailLabel}>상세 설명</p>
          </div>

          <p className={styles.actionDescription}>{resolvedContent.description}</p>

          <div className={styles.actionDivider} />

          <p className={styles.actionCaution}>
            <span className={styles.actionCautionLabel}>주의:</span> {resolvedContent.caution}
          </p>
        </div>
      </article>
    </section>
  );
}
