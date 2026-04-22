import { Link } from '@tanstack/react-router';

import { qrIconByTone } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import { useScanListPage } from './hooks/useScanListPage';
import * as styles from './styles/scanListPage.css';

import type { ScanListStatus } from './types/scanListPage.types';

const resultRouteByStatus: Record<
  ScanListStatus,
  '/result/safe' | '/result/warning' | '/result/critical'
> = {
  safe: '/result/safe',
  warning: '/result/warning',
  critical: '/result/critical',
};

const statusLabelByTone: Record<ScanListStatus, string> = {
  safe: '안전',
  warning: '주의',
  critical: '위험',
};

function CalendarIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path
        d="M5 1.75V3m6-1.25V3M2.75 5.25h10.5M4 7.75h4.5m-5.75 6.5h10.5A1.25 1.25 0 0 0 14.5 13V4.5A1.25 1.25 0 0 0 13.25 3.25H2.75A1.25 1.25 0 0 0 1.5 4.5V13A1.25 1.25 0 0 0 2.75 14.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function StatusBadgeIcon({ tone }: { tone: ScanListStatus }) {
  if (tone === 'safe') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
        <path
          d="M8 1.75 13 3.7v3.15c0 3.1-2.1 5.95-5 7.4-2.9-1.45-5-4.3-5-7.4V3.7l5-1.95Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="m5.9 8.15 1.35 1.35L10.4 6.35"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (tone === 'warning') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
        <path
          d="M8.78 2.77 13.58 11A1 1 0 0 1 12.72 12.5H3.28A1 1 0 0 1 2.42 11l4.8-8.23a1 1 0 0 1 1.56 0Z"
          fill="currentColor"
          opacity="0.24"
        />
        <path
          d="M8 5.2v3.25M8 10.85h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" fill="currentColor" opacity="0.2" r="6.25" />
      <path
        d="m5.7 5.7 4.6 4.6m0-4.6-4.6 4.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function ScanListPage() {
  const { handleSelectScanResult, scanListPageData, scanListUuid } = useScanListPage();

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrIconByTone.safe} />

      <div className={styles.shell}>
        <header className={styles.intro}>
          <h1 className={styles.title}>스캔 이력</h1>
          <p className={styles.description}>최근 QR 스캔 내역을 확인하세요</p>
          <p className={styles.helper}>조회 UUID: {scanListUuid}</p>
        </header>

        <section className={styles.listSection}>
          {scanListPageData.items.length === 0 ? (
            <div className={styles.emptyState}>연결된 UUID에 대한 스캔 이력이 없습니다.</div>
          ) : (
            <ul className={styles.list}>
              {scanListPageData.items.map((item) => (
                <li key={item.id}>
                  <Link
                    className={`${styles.card} ${styles.cardTone[item.status]}`}
                    onClick={() => {
                      handleSelectScanResult(item);
                    }}
                    search={{
                      url: item.url,
                    }}
                    to={resultRouteByStatus[item.status]}
                  >
                    <span className={`${styles.badge} ${styles.badgeTone[item.status]}`}>
                      <span aria-hidden="true" className={styles.badgeIcon}>
                        <StatusBadgeIcon tone={item.status} />
                      </span>
                      {statusLabelByTone[item.status]}
                    </span>

                    <div
                      className={`${styles.cardIconWrap} ${styles.cardIconWrapTone[item.status]}`}
                    >
                      <img
                        alt=""
                        aria-hidden="true"
                        className={styles.cardIcon}
                        src={qrIconByTone[item.status]}
                      />
                    </div>

                    <article className={styles.cardContent}>
                      <p className={styles.cardUrl}>{item.url}</p>
                      <p className={styles.cardMeta}>
                        <span aria-hidden="true" className={styles.metaIcon}>
                          <CalendarIcon />
                        </span>
                        {item.scannedAt}
                      </p>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
