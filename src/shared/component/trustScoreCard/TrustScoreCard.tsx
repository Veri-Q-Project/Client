import shieldIcon from '@/shared/icon/shield.svg';
import shieldRedIcon from '@/shared/icon/shieldRed.svg';
import shieldYellowIcon from '@/shared/icon/shieldyellow.svg';

import * as styles from './trustScoreCard.css';

type ResultTone = 'safe' | 'warning' | 'critical';

type TrustScoreCardProps = {
  score: number;
  tone?: ResultTone;
};

const shieldIconByTone: Record<ResultTone, string> = {
  safe: shieldIcon,
  warning: shieldYellowIcon,
  critical: shieldRedIcon,
};

export default function TrustScoreCard({ score, tone = 'safe' }: TrustScoreCardProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>신뢰 점수</span>
        <span aria-hidden className={styles.iconWrap}>
          <img alt="" className={styles.iconImage} src={shieldIconByTone[tone]} />
        </span>
      </div>

      <p className={styles.value}>
        {normalizedScore} <span className={styles.total}>/ 100</span>
      </p>

      <div className={styles.track}>
        <div
          aria-hidden
          className={`${styles.bar} ${styles.barTone[tone]}`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </article>
  );
}
