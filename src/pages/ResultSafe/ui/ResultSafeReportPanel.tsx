import * as styles from '../styles/resultSafePage.css';

export default function ResultSafeReportPanel() {
  return (
    <section className={styles.reportPanel}>
      <p className={styles.reportPanelTitle}>상세 분석 항목</p>
      <ul className={styles.reportList}>
        <li>URL 평판 분석: 안전</li>
        <li>SSL 인증서 상태: 유효</li>
        <li>피싱 키워드 패턴: 미검출</li>
      </ul>
    </section>
  );
}
