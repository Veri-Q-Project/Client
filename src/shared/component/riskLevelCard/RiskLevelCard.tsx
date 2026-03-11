import { shieldIconByTone } from '@/shared/icon/resultIcons';
import type { ResultTone } from '@/shared/types/resultTone';

import * as styles from './riskLevelCard.css';

type RiskLevelCardProps = {
  description?: string;
  levelText?: string;
  tone?: ResultTone;
};

export default function RiskLevelCard({
  description = '피싱 패턴이 감지되지 않음',
  levelText = '매우 낮음',
  tone = 'safe',
}: RiskLevelCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>위험 수준</span>
        <span aria-hidden className={styles.iconWrap}>
          <img alt="" className={styles.iconImage} src={shieldIconByTone[tone]} />
        </span>
      </div>

      <p className={`${styles.level} ${styles.levelTone[tone]}`}>{levelText}</p>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
