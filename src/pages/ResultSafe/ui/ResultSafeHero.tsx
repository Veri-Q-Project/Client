import safeMarkIcon from '@/shared/icon/안전표시.svg';

import * as styles from '../styles/resultSafePage.css';

export default function ResultSafeHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.statusHalo}>
        <img alt="" aria-hidden className={styles.statusBadge} src={safeMarkIcon} />
      </div>

      <h1 className={styles.heroTitle}>
        안심하세요!
        <br />
        안전한 사이트입니다
      </h1>

      <p className={styles.heroDescription}>
        Veri-Q 분석 결과, 해당 QR 코드는 검증된 안전한 웹사이트로 연결됩니다.
      </p>
    </header>
  );
}
