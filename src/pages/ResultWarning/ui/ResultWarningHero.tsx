import { statusMarkIconByTone } from '@/shared/icon/resultIcons';

import * as styles from '../styles/resultWarningPage.css';

export default function ResultWarningHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.statusHalo}>
        <img alt="" aria-hidden className={styles.statusBadge} src={statusMarkIconByTone.warning} />
      </div>

      <h1 className={styles.heroTitle}>
        주의하세요!
        <br />
        주의가 필요한 사이트입니다
      </h1>

      <p className={styles.heroDescription}>
        Veri-Q 분석 결과, 해당 QR 코드는 주의가 필요한 웹사이트로 분류되었습니다.
      </p>
    </header>
  );
}
