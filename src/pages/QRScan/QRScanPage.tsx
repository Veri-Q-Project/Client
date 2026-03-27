import { Link } from '@tanstack/react-router';

import { qrIconByTone } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import * as styles from './styles/qrScanPage.css';

const recentScanRecord = {
  scannedAt: '2023.10.27 14:32',
  statusLabel: 'SAFE',
  summary: '위험 요소가 발견되지 않았습니다.',
  url: 'https://www.naver.com/',
};

function ScanGlyphIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M8.5 4H6.75A2.75 2.75 0 0 0 4 6.75V8.5m11.5-4h1.75A2.75 2.75 0 0 1 20 6.75V8.5M8.5 20H6.75A2.75 2.75 0 0 1 4 17.25V15.5m11.5 4h1.75A2.75 2.75 0 0 0 20 17.25V15.5M9 9h2v2H9zm4 0h2v2h-2zM9 13h2v2H9zm4 0h2v2h-2z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function UploadGlyphIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 15V6m0 0l-3 3m3-3l3 3M5 14.5v2.25A2.25 2.25 0 0 0 7.25 19h9.5A2.25 2.25 0 0 0 19 16.75V14.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ViewGlyphIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M2.75 12s3.4-5.5 9.25-5.5 9.25 5.5 9.25 5.5-3.4 5.5-9.25 5.5S2.75 12 2.75 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.75" fill="currentColor" />
    </svg>
  );
}

export default function QRScanPage() {
  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrIconByTone.safe} />

      <div className={styles.shell}>
        <section className={styles.heroSection}>
          <div aria-hidden className={styles.scanStage}>
            <div className={styles.scanBackdrop} />

            <div className={styles.handSilhouette}>
              <div className={styles.handPalm} />
              <div className={styles.handThumb} />
            </div>

            <div className={styles.device}>
              <div className={styles.deviceSpeaker} />

              <div className={styles.deviceScreen}>
                <div className={styles.deviceQrGhost} />
                <div className={styles.deviceTextLine} />
                <div className={styles.deviceTextLineShort} />
              </div>

              <div className={styles.deviceFooter}>
                <span className={styles.deviceFooterDot} />
                <span className={styles.deviceFooterDot} />
                <span className={styles.deviceFooterDot} />
              </div>
            </div>

            <div className={styles.scanLine} />

            <div className={styles.centerBadge}>
              <span className={styles.buttonIcon}>
                <ScanGlyphIcon />
              </span>
            </div>

            <span className={`${styles.scanCorner} ${styles.scanCornerTopLeft}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerTopRight}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerBottomLeft}`} />
            <span className={`${styles.scanCorner} ${styles.scanCornerBottomRight}`} />
          </div>

          <header className={styles.intro}>
            <h1 className={styles.title}>QR 스캔하기</h1>
            <p className={styles.description}>안전한 스캔을 위해 QR을 프레임 안에 맞춰 주세요</p>
          </header>
        </section>

        <section aria-label="QR 스캔 시작" className={styles.actionSection}>
          <button className={styles.primaryButton} type="button">
            <span aria-hidden className={styles.buttonIcon}>
              <ScanGlyphIcon />
            </span>
            QR 스캔하기
          </button>

          <button className={styles.secondaryButton} type="button">
            <span aria-hidden className={styles.buttonIcon}>
              <UploadGlyphIcon />
            </span>
            갤러리에서 업로드
          </button>
        </section>

        <section aria-labelledby="recent-scan-title" className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} id="recent-scan-title">
              최근 스캔 기록
            </h2>
            <Link className={styles.viewAllLink} to="/scan-history">
              전체보기
            </Link>
          </div>

          <article className={styles.historyCard}>
            <span className={styles.historyBadge}>
              <span aria-hidden className={styles.historyBadgeIcon}>
                <ViewGlyphIcon />
              </span>
              {recentScanRecord.statusLabel}
            </span>

            <p className={styles.historyDate}>{recentScanRecord.scannedAt}</p>
            <p className={styles.historyUrl}>{recentScanRecord.url}</p>
            <p className={styles.historyStatus}>{recentScanRecord.summary}</p>
          </article>
        </section>
      </div>
    </main>
  );
}
