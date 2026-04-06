import { Link, useNavigate } from '@tanstack/react-router';

import { qrIconByTone } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import type { ScanListStatus } from '@/pages/ScanList/types/scanListPage.types';

import { useQRScanPage } from './hooks/useQRScanPage';
import * as styles from './styles/qrScanPage.css';

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

function HistoryPrevIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <path
        d="m11.75 4.5-5 5 5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function HistoryNextIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <path
        d="m8.25 4.5 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

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

const statusSummaryByTone: Record<ScanListStatus, string> = {
  safe: '안전으로 판정된 스캔 이력입니다.',
  warning: '주의가 필요한 스캔 이력입니다.',
  critical: '위험으로 분류된 스캔 이력입니다.',
};

export default function QRScanPage() {
  const navigate = useNavigate();
  const {
    cameraStatus,
    cameraStatusText,
    canNavigateHistory,
    fileInputRef,
    handleCapturePhoto,
    handleGalleryFileChange,
    handleOpenGallery,
    handleShowNextHistoryItem,
    handleShowPreviousHistoryItem,
    isCapturing,
    isFlashVisible,
    recentScanItem,
    videoRef,
  } = useQRScanPage();

  const handleOpenRecentScanResult = () => {
    if (!recentScanItem) {
      return;
    }

    void navigate({ to: resultRouteByStatus[recentScanItem.status] });
  };

  return (
    <main className={styles.page}>
      <AppHeader iconSrc={qrIconByTone.safe} />

      <div className={styles.shell}>
        <section className={styles.heroSection}>
          <div className={styles.scanStage}>
            <video
              aria-label="후면 카메라 미리보기"
              autoPlay
              className={styles.cameraPreview}
              muted
              playsInline
              ref={videoRef}
            />
            <div className={styles.scanBackdrop} />

            <div
              className={`${styles.cameraLiveBadge} ${styles.cameraLiveBadgeTone[cameraStatus]}`}
            >
              <span className={styles.cameraLiveDot} />
              {cameraStatus === 'ready'
                ? 'REAR CAMERA'
                : cameraStatus === 'loading'
                  ? 'CONNECTING'
                  : 'CAMERA ERROR'}
            </div>

            {cameraStatus !== 'ready' ? (
              <div
                className={`${styles.cameraFallback} ${styles.cameraFallbackTone[cameraStatus]}`}
              >
                <p className={styles.cameraFallbackTitle}>
                  {cameraStatus === 'loading' ? '후면 카메라 연결 중' : '카메라 연결 필요'}
                </p>
                <p className={styles.cameraFallbackDescription}>{cameraStatusText}</p>
              </div>
            ) : null}

            <div
              className={
                cameraStatus === 'ready'
                  ? styles.scanLine
                  : `${styles.scanLine} ${styles.scanLineHidden}`
              }
            />

            <div
              className={
                isFlashVisible
                  ? `${styles.captureFlash} ${styles.captureFlashVisible}`
                  : styles.captureFlash
              }
            />

            <div className={styles.centerBadge}>
              <span aria-hidden className={styles.buttonIcon}>
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
            <p className={styles.description}>
              안전한 스캔을 위해 QR 코드를 프레임 안에 맞춰 주세요.
            </p>
            <p className={`${styles.cameraStatusText} ${styles.cameraStatusTone[cameraStatus]}`}>
              {cameraStatusText}
            </p>
          </header>
        </section>

        <section aria-label="QR 스캔 시작" className={styles.actionSection}>
          <button
            aria-label={
              cameraStatus === 'ready' ? '현재 카메라 화면 촬영하기' : '후면 카메라 연결하기'
            }
            className={styles.primaryButton}
            disabled={isCapturing || cameraStatus === 'loading'}
            onClick={() => {
              void handleCapturePhoto();
            }}
            type="button"
          >
            <span aria-hidden className={styles.buttonIcon}>
              <ScanGlyphIcon />
            </span>
            {isCapturing ? '촬영 중...' : 'QR 스캔하기'}
          </button>

          <button className={styles.secondaryButton} onClick={handleOpenGallery} type="button">
            <span aria-hidden className={styles.buttonIcon}>
              <UploadGlyphIcon />
            </span>
            갤러리에서 업로드
          </button>

          <input
            accept="image/*"
            hidden
            onChange={handleGalleryFileChange}
            ref={fileInputRef}
            type="file"
          />

          <p className={styles.helperText}>
            라이브 카메라 미리보기가 준비되면 초록색 버튼으로 현재 화면을 바로 촬영할 수 있습니다.
          </p>
        </section>

        <section aria-labelledby="recent-scan-title" className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} id="recent-scan-title">
              최근 스캔 기록
            </h2>
            <Link className={styles.viewAllLink} to="/scan-list">
              전체보기
            </Link>
          </div>

          <article
            aria-label={
              recentScanItem
                ? `${statusLabelByTone[recentScanItem.status]} 결과 페이지로 이동`
                : undefined
            }
            className={
              recentScanItem
                ? `${styles.historyCard} ${styles.historyCardInteractive}`
                : styles.historyCard
            }
            onClick={recentScanItem ? handleOpenRecentScanResult : undefined}
            onKeyDown={
              recentScanItem
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleOpenRecentScanResult();
                    }
                  }
                : undefined
            }
            role={recentScanItem ? 'button' : undefined}
            tabIndex={recentScanItem ? 0 : undefined}
          >
            <button
              aria-label="이전 스캔 이력 보기"
              className={`${styles.historyNavButton} ${styles.historyNavButtonLeft}`}
              disabled={!canNavigateHistory}
              onClick={(event) => {
                event.stopPropagation();
                handleShowPreviousHistoryItem();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
              type="button"
            >
              <span aria-hidden className={styles.historyNavIcon}>
                <HistoryPrevIcon />
              </span>
            </button>

            <div className={styles.historyContent}>
              {recentScanItem ? (
                <>
                  <span
                    className={`${styles.historyBadge} ${styles.historyBadgeTone[recentScanItem.status]}`}
                  >
                    <span aria-hidden className={styles.historyBadgeIcon}>
                      <ViewGlyphIcon />
                    </span>
                    {statusLabelByTone[recentScanItem.status]}
                  </span>

                  <p className={styles.historyDate}>{recentScanItem.scannedAt}</p>
                  <p className={styles.historyHeadline}>{recentScanItem.url}</p>
                  <p
                    className={`${styles.historyStatus} ${styles.historyStatusTone[recentScanItem.status]}`}
                  >
                    {statusSummaryByTone[recentScanItem.status]}
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.historyDate}>스캔 이력이 없습니다.</p>
                  <p className={styles.historyHeadline}>
                    최근 스캔 이력이 생기면 이곳에 가장 최신 항목이 표시됩니다.
                  </p>
                  <p className={styles.historyStatus}>
                    전체보기에서 스캔 목록을 확인할 수 있습니다.
                  </p>
                </>
              )}
            </div>

            <button
              aria-label="다음 스캔 이력 보기"
              className={`${styles.historyNavButton} ${styles.historyNavButtonRight}`}
              disabled={!canNavigateHistory}
              onClick={(event) => {
                event.stopPropagation();
                handleShowNextHistoryItem();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
              type="button"
            >
              <span aria-hidden className={styles.historyNavIcon}>
                <HistoryNextIcon />
              </span>
            </button>
          </article>
        </section>
      </div>
    </main>
  );
}
