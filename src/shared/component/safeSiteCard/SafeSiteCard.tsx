import siteVisitIcon from '@/shared/icon/사이트방문하기 .svg';
import internetPreviewIcon from '@/shared/icon/인터넷 미리보기.svg';

import * as styles from './safeSiteCard.css';

type ResultTone = 'safe' | 'warning' | 'critical';

type SafeSiteCardProps = {
  badgeLabel?: string;
  onVisitClick?: () => void;
  siteMeta?: string;
  siteName: string;
  siteUrl: string;
  statusLabel?: string;
  tone?: ResultTone;
  visitLabel?: string;
};

export default function SafeSiteCard({
  badgeLabel = 'OK',
  onVisitClick,
  siteMeta = 'SSL 인증서 유효함 · 도메인 생성일 2018.05.12',
  siteName,
  siteUrl,
  statusLabel = 'OFFICIAL',
  tone = 'safe',
  visitLabel = '사이트 방문하기',
}: SafeSiteCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.info}>
        <div className={styles.iconFrame}>
          <img alt="" aria-hidden className={styles.iconImage} src={internetPreviewIcon} />
          <span aria-hidden className={`${styles.checkBadge} ${styles.checkBadgeTone[tone]}`}>
            {badgeLabel}
          </span>
        </div>

        <div>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{siteName}</h2>
            <span className={`${styles.official} ${styles.officialTone[tone]}`}>{statusLabel}</span>
          </div>
          <p className={styles.siteUrl}>{siteUrl}</p>
          <p className={styles.siteMeta}>{siteMeta}</p>
        </div>
      </div>

      <button
        className={`${styles.visitButton} ${styles.visitButtonTone[tone]}`}
        onClick={onVisitClick}
        type="button"
      >
        <span aria-hidden className={styles.visitButtonIcon}>
          <img alt="" className={styles.visitButtonIconImage} src={siteVisitIcon} />
        </span>
        {visitLabel}
      </button>
    </article>
  );
}
