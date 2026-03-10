import siteVisitIcon from '@/shared/icon/사이트방문하기 .svg';
import internetPreviewIcon from '@/shared/icon/인터넷 미리보기.svg';

import * as styles from './safeSiteCard.css';

type SafeSiteCardProps = {
  onVisitClick?: () => void;
  siteName: string;
  siteUrl: string;
  siteMeta?: string;
};

export default function SafeSiteCard({
  onVisitClick,
  siteMeta = 'SSL 인증서 유효함 · 도메인 생성일 2018.05.12',
  siteName,
  siteUrl,
}: SafeSiteCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.info}>
        <div className={styles.iconFrame}>
          <img alt="" aria-hidden className={styles.iconImage} src={internetPreviewIcon} />
          <span aria-hidden className={styles.checkBadge}>
            OK
          </span>
        </div>

        <div>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{siteName}</h2>
            <span className={styles.official}>OFFICIAL</span>
          </div>
          <p className={styles.siteUrl}>{siteUrl}</p>
          <p className={styles.siteMeta}>{siteMeta}</p>
        </div>
      </div>

      <button className={styles.visitButton} onClick={onVisitClick} type="button">
        <span aria-hidden className={styles.visitButtonIcon}>
          <img alt="" className={styles.visitButtonIconImage} src={siteVisitIcon} />
        </span>
        사이트 방문하기
      </button>
    </article>
  );
}
