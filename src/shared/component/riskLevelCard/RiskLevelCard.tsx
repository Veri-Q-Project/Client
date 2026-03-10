import shieldIcon from '@/shared/icon/shield.svg';

import * as styles from './riskLevelCard.css';

type RiskLevelCardProps = {
  description?: string;
  levelText?: string;
};

export default function RiskLevelCard({
  description = '피싱 패턴이 감지되지 않음',
  levelText = '매우 낮음',
}: RiskLevelCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>위험 수준</span>
        <span aria-hidden className={styles.iconWrap}>
          <img alt="" className={styles.iconImage} src={shieldIcon} />
        </span>
      </div>

      <p className={styles.level}>{levelText}</p>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
