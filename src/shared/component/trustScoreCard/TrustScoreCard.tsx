import shieldIcon from '@/shared/icon/shield.svg';

import * as styles from './trustScoreCard.css';

type TrustScoreCardProps = {
  score: number;
};

export default function TrustScoreCard({ score }: TrustScoreCardProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>신뢰 점수</span>
        <span aria-hidden className={styles.iconWrap}>
          <img alt="" className={styles.iconImage} src={shieldIcon} />
        </span>
      </div>

      <p className={styles.value}>
        {normalizedScore} <span className={styles.total}>/ 100</span>
      </p>

      <div className={styles.track}>
        <div aria-hidden className={styles.bar} style={{ width: `${normalizedScore}%` }} />
      </div>
    </article>
  );
}
