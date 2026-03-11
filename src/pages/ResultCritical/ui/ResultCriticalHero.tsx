import { statusMarkIconByTone } from '@/shared/icon/resultIcons';

import * as styles from '../styles/resultCriticalPage.css';

export default function ResultCriticalHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.statusHalo}>
        <img
          alt=""
          aria-hidden
          className={styles.statusBadge}
          src={statusMarkIconByTone.critical}
        />
      </div>

      <h1 className={styles.heroTitle}>
        위험! 악성 코드가 감지되어 접속을 권장하지 않는 사이트입니다.
      </h1>

      <p className={styles.heroDescription}>
        Veri-Q 분석 결과, 해당 QR 코드는 악성 위험 사이트로 분류되었습니다.
      </p>
    </header>
  );
}
