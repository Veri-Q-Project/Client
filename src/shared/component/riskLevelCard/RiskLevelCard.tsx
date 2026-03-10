import shieldIcon from '@/shared/icon/shield.svg';
import shieldRedIcon from '@/shared/icon/shieldRed.svg';
import shieldYellowIcon from '@/shared/icon/shieldyellow.svg';

import * as styles from './riskLevelCard.css';

type ResultTone = 'safe' | 'warning' | 'critical';

type RiskLevelCardProps = {
  description?: string;
  levelText?: string;
  tone?: ResultTone;
};

const shieldIconByTone: Record<ResultTone, string> = {
  safe: shieldIcon,
  warning: shieldYellowIcon,
  critical: shieldRedIcon,
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
