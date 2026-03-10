import * as styles from '../styles/resultWarningPage.css';

export default function ResultWarningReportPanel() {
  return (
    <section className={styles.reportPanel}>
      <p className={styles.reportPanelTitle}>상세 분석 항목</p>
      <ul className={styles.reportList}>
        <li>URL 평판 분석: 주의</li>
        <li>SSL 인증서 상태: 유효</li>
        <li>피싱 의심 키워드 패턴: 일부 감지</li>
      </ul>
    </section>
  );
}
