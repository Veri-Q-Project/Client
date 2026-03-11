import * as styles from '../styles/resultCriticalPage.css';

export default function ResultCriticalReportPanel() {
  return (
    <section className={styles.reportPanel}>
      <p className={styles.reportPanelTitle}>상세 분석 항목</p>
      <ul className={styles.reportList}>
        <li>URL 평판 분석: 위험</li>
        <li>SSL 인증서 상태: 불안정 또는 만료 가능</li>
        <li>피싱 의심 키워드 패턴: 다수 감지</li>
      </ul>
    </section>
  );
}
