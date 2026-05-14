import { RiskLevelCard, TrustScoreCard } from '@/shared/component';
import googleSafeBrowsingIcon from '@/shared/icon/Google Safe Browsing.svg';
import { qrIconByTone, statusMarkIconByTone } from '@/shared/icon/resultIcons';
import AppHeader from '@/shared/ui/app-header';

import { resolveRiskDetectionContent } from './constants/riskDetectionCatalog';
import { useReportPage } from './hooks/useReportPage';
import * as styles from './styles/reportPage.css';

import type { ReportStatusTone } from './types/reportPage.types';

type ProtocolTone = 'secure' | 'unknown' | 'warning';

const riskLevelLabel = {
  critical: '위험',
  safe: '안전',
  warning: '주의',
} as const;

const sectionNumber = {
  detection: '5',
  domain: '3',
  reputation: '2',
  server: '4',
  url: '1',
} as const;

function resolveProtocolTone(url: string): ProtocolTone {
  const normalizedUrl = url.trim().toLowerCase();

  if (normalizedUrl.startsWith('https://')) {
    return 'secure';
  }

  if (normalizedUrl.startsWith('http://')) {
    return 'warning';
  }

  return 'unknown';
}

const protocolLabelByTone: Record<ProtocolTone, string> = {
  secure: 'HTTPS',
  unknown: 'UNKNOWN',
  warning: 'HTTP',
};

const certificateStatusClassNameByTone: Record<ReportStatusTone, string> = {
  error: styles.certificateError,
  success: styles.certificateSuccess,
  warning: styles.certificateWarning,
};

export default function ReportPage() {
  const { handleRescan, reportPageData } = useReportPage();

  if (!reportPageData) {
    return null;
  }

  const handlePrintPdf = () => {
    window.print();
  };

  const reputationReportCount = reportPageData.reputation.summary.reportCount;

  const originalProtocolTone = resolveProtocolTone(reportPageData.urlAnalysis.originalUrl);
  const destinationProtocolTone = resolveProtocolTone(reportPageData.urlAnalysis.destinationUrl);

  const hasInsecureProtocol =
    originalProtocolTone !== 'secure' || destinationProtocolTone !== 'secure';

  const reputationBadgeTone = reputationReportCount === 0 ? 'clean' : 'warning';
  const providerStatusTone = reputationReportCount === 0 ? 'safe' : reportPageData.riskLevel;

  const detectedRiskCards = reportPageData.detectedRiskTypes.map((riskType, index) => ({
    ...resolveRiskDetectionContent(riskType, reportPageData.riskLevel),
    key: `${riskType}-${index}`,
  }));

  const toneKey = reportPageData.riskLevel;

  return (
    <main className={styles.page}>
      <div className={styles.printHidden}>
        <AppHeader iconSrc={qrIconByTone[reportPageData.riskLevel]} />
      </div>

      <div className={styles.shell}>
        <section className={styles.content}>
          <header
            className={`${styles.toneHeader} ${styles.toneHeaderTone[reportPageData.riskLevel]}`}
          >
            <div className={styles.toneHeaderTop}>
              <div className={styles.toneTitleWrap}>
                <span aria-hidden className={styles.toneIconWrap}>
                  <img
                    alt=""
                    className={styles.toneIconImage}
                    src={statusMarkIconByTone[reportPageData.riskLevel]}
                  />
                </span>

                <div className={styles.toneTitleBlock}>
                  <h1 className={styles.toneTitle}>{reportPageData.reportTitle}</h1>
                  <p className={styles.toneSubtitle}>
                    {riskLevelLabel[reportPageData.riskLevel]} 상태 기반 상세 분석 결과
                  </p>
                </div>
              </div>

              <span
                className={`${styles.levelBadge} ${styles.levelBadgeTone[reportPageData.riskLevel]}`}
              >
                {reportPageData.riskLevelText}
              </span>
            </div>

            <div className={styles.toneMetaGrid}>
              <p className={styles.toneMeta}>
                <span className={styles.toneMetaKey}>분석 대상</span>
                <span className={styles.toneMetaValue}>{reportPageData.scannedUrl}</span>
              </p>
              <p className={styles.toneMeta}>
                <span className={styles.toneMetaKey}>분석 시각</span>
                <span className={styles.toneMetaValue}>{reportPageData.scannedAt}</span>
              </p>
            </div>
          </header>

          <section className={styles.metricsGrid}>
            <TrustScoreCard score={reportPageData.trustScore} tone={reportPageData.riskLevel} />
            <RiskLevelCard
              description={reportPageData.riskDescription}
              levelText={reportPageData.riskLevelText}
              tone={reportPageData.riskLevel}
            />
          </section>

          <section className={`${styles.sectionCard} ${styles.sectionCardTone[toneKey]}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <span className={`${styles.sectionNumber} ${styles.sectionNumberTone[toneKey]}`}>
                  {sectionNumber.url}
                </span>
                <div>
                  <h2 className={styles.sectionTitle}>URL 분석 상세</h2>
                  <p className={styles.sectionSubtitle}>원본 URL과 실제 도착 URL을 비교합니다.</p>
                </div>
              </div>
            </div>

            <div className={styles.urlCompareGrid}>
              <article className={styles.urlBox}>
                <div className={styles.urlLabelRow}>
                  <p className={styles.urlLabel}>URL (ORIGINAL SOURCE)</p>
                  <span
                    className={`${styles.protocolBadge} ${styles.protocolBadgeTone[originalProtocolTone]}`}
                  >
                    {protocolLabelByTone[originalProtocolTone]}
                  </span>
                </div>
                <p className={styles.urlValue}>{reportPageData.urlAnalysis.originalUrl}</p>
              </article>

              <article className={`${styles.urlBox} ${styles.destinationUrlBox}`}>
                <div className={styles.urlLabelRow}>
                  <p className={styles.urlLabel}>URL (DESTINATION ANALYSIS)</p>
                  <span
                    className={`${styles.protocolBadge} ${styles.protocolBadgeTone[destinationProtocolTone]}`}
                  >
                    {protocolLabelByTone[destinationProtocolTone]}
                  </span>
                </div>
                <p className={styles.urlValue}>{reportPageData.urlAnalysis.destinationUrl}</p>
              </article>
            </div>

            <p
              className={`${styles.protocolSummary} ${
                hasInsecureProtocol ? styles.protocolSummaryWarning : styles.protocolSummarySecure
              }`}
            >
              {hasInsecureProtocol
                ? '비암호화(HTTP) 주소가 포함되어 있습니다. 입력 정보 탈취 위험이 있어 주의가 필요합니다.'
                : '암호화(HTTPS) 통신으로 확인되었습니다. 전송 구간 보안이 적용되어 있습니다.'}
            </p>
          </section>

          <section className={`${styles.sectionCard} ${styles.sectionCardTone[toneKey]}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <span className={`${styles.sectionNumber} ${styles.sectionNumberTone[toneKey]}`}>
                  {sectionNumber.reputation}
                </span>
                <div>
                  <h2 className={styles.sectionTitle}>평판 및 도메인 정보 조회</h2>
                  <p className={styles.sectionSubtitle}>
                    신고 이력과 도메인 생성 정보를 기준으로 조회한 결과입니다.
                  </p>
                </div>
              </div>

              <span
                className={`${styles.reputationBadge} ${styles.reputationBadgeTone[reputationBadgeTone]}`}
              >
                {reputationBadgeTone === 'clean' ? '클린' : '주의'}
              </span>
            </div>

            <div className={styles.reputationStatGrid}>
              <article className={styles.reputationStatCard}>
                <p className={styles.reputationStatLabel}>신고 건수</p>
                <p className={styles.reputationStatValue}>
                  {reportPageData.reputation.summary.reportCount}건
                </p>
              </article>

              <article className={styles.reputationStatCard}>
                <p className={styles.reputationStatLabel}>도메인 생성일</p>
                <p className={styles.reputationStatValue}>
                  {reportPageData.reputation.summary.domainAgeText}
                </p>
              </article>
            </div>

            <section className={styles.providerPanel}>
              <article className={styles.providerCard}>
                <div className={styles.providerMain}>
                  <span aria-hidden className={styles.providerIconWrap}>
                    <img alt="" className={styles.providerIconImage} src={googleSafeBrowsingIcon} />
                  </span>

                  <div className={styles.providerTextBlock}>
                    <p className={styles.providerName}>{reportPageData.reputation.providerName}</p>
                    <p className={styles.providerStatusText}>
                      {reportPageData.reputation.providerStatusText}
                    </p>
                  </div>
                </div>

                <span aria-hidden className={styles.providerResultIconWrap}>
                  <img
                    alt=""
                    className={styles.providerResultIconImage}
                    src={statusMarkIconByTone[providerStatusTone]}
                  />
                </span>
              </article>

              <article className={styles.providerDescriptionCard}>
                <p className={styles.providerDescriptionText}>
                  {reportPageData.reputation.detailDescription}
                </p>
              </article>
            </section>
          </section>

          <section className={`${styles.sectionCard} ${styles.sectionCardTone[toneKey]}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <span className={`${styles.sectionNumber} ${styles.sectionNumberTone[toneKey]}`}>
                  {sectionNumber.domain}
                </span>
                <div>
                  <h2 className={styles.sectionTitle}>도메인 비교 분석</h2>
                  <p className={styles.sectionSubtitle}>
                    접속 시도 URL과 공식 URL의 유사도를 비교합니다.
                  </p>
                </div>
              </div>

              <span className={`${styles.riskBadge} ${styles.riskBadgeTone[toneKey]}`}>
                {reportPageData.domainComparison.riskBadgeText}
              </span>
            </div>

            <div className={styles.domainCompareGrid}>
              <article
                className={`${styles.domainCompareRow} ${styles.domainCompareRowTone[toneKey]}`}
              >
                <p className={styles.domainCompareLabel}>접속 시도 URL</p>
                <p className={styles.domainCompareSuspicious}>
                  {reportPageData.domainComparison.suspiciousUrl}
                </p>
              </article>

              <article
                className={`${styles.domainCompareRow} ${styles.domainCompareRowTone[toneKey]}`}
              >
                <p className={styles.domainCompareLabel}>실제 공식 URL</p>
                <p className={styles.domainCompareOfficial}>
                  {reportPageData.domainComparison.officialUrl}
                </p>
              </article>
            </div>

            <p className={styles.domainCompareSummary}>{reportPageData.domainComparison.summary}</p>
          </section>

          <section className={`${styles.sectionCard} ${styles.sectionCardTone[toneKey]}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <span className={`${styles.sectionNumber} ${styles.sectionNumberTone[toneKey]}`}>
                  {sectionNumber.server}
                </span>
                <div>
                  <h2 className={styles.sectionTitle}>서버 정보</h2>
                  <p className={styles.sectionSubtitle}>
                    서버 인프라와 인증서 메타 정보를 표시합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.serverInfoGrid}>
              <div className={styles.serverInfoRow}>
                <p className={styles.serverInfoKey}>서버 유형</p>
                <p className={styles.serverInfoValue}>{reportPageData.serverInfo.serverType}</p>
              </div>

              <div className={styles.serverInfoRow}>
                <p className={styles.serverInfoKey}>서버 위치</p>
                <p className={styles.serverInfoValue}>{reportPageData.serverInfo.serverLocation}</p>
              </div>

              <div className={styles.serverInfoRow}>
                <p className={styles.serverInfoKey}>인증서</p>
                <p className={styles.serverInfoValue}>
                  <span
                    className={`${styles.certificateStatus} ${
                      certificateStatusClassNameByTone[
                        reportPageData.serverInfo.certificateStatusTone
                      ]
                    }`}
                  >
                    {reportPageData.serverInfo.certificateStatusText}
                  </span>{' '}
                  · {reportPageData.serverInfo.certificateIssuer}
                </p>
              </div>

              <div className={styles.serverInfoRow}>
                <p className={styles.serverInfoKey}>유효 기간</p>
                <p className={styles.serverInfoValue}>
                  {reportPageData.serverInfo.certificateValidityPeriod}
                </p>
              </div>
            </div>
          </section>

          <section className={`${styles.sectionCard} ${styles.sectionCardTone[toneKey]}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <span className={`${styles.sectionNumber} ${styles.sectionNumberTone[toneKey]}`}>
                  {sectionNumber.detection}
                </span>
                <div>
                  <h2 className={styles.sectionTitle}>탐지된 위험 유형 분석</h2>
                  <p className={styles.sectionSubtitle}>
                    백엔드에서 전달한 탐지 유형별 상세 설명과 위험성을 표시합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.riskDetectionGrid}>
              {detectedRiskCards.map((riskDetectionCard) => (
                <article
                  className={`${styles.riskDetectionCard} ${styles.riskDetectionCardTone[toneKey]}`}
                  key={riskDetectionCard.key}
                >
                  <div className={styles.riskDetectionCardHeader}>
                    <div
                      className={`${styles.riskDetectionHeaderTextBlock} ${styles.riskDetectionHeaderTextBlockTone[toneKey]}`}
                    >
                      <h3 className={styles.riskDetectionTitle}>{riskDetectionCard.title}</h3>
                      <p className={styles.riskDetectionEnglishLabel}>
                        {riskDetectionCard.englishLabel}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`${styles.riskDetectionBody} ${styles.riskDetectionBodyTone[toneKey]}`}
                  >
                    <p
                      className={`${styles.riskDetectionBodyLabel} ${styles.riskDetectionBodyLabelTone[toneKey]}`}
                    >
                      상세 설명
                    </p>
                    <p className={styles.riskDetectionDescription}>
                      {riskDetectionCard.description}
                    </p>
                    <p
                      className={`${styles.riskDetectionRisk} ${styles.riskDetectionRiskTone[toneKey]}`}
                    >
                      {riskDetectionCard.risk}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <div className={styles.exportActionWrap}>
          <button
            aria-label="PDF 출력"
            className={`${styles.printButton} ${styles.printButtonTone[toneKey]}`}
            onClick={handlePrintPdf}
            type="button"
          >
            PDF 출력
          </button>

          <button
            aria-label="다시 스캔하기"
            className={styles.rescanButton}
            onClick={handleRescan}
            type="button"
          >
            다시 스캔하기
          </button>
        </div>
      </div>
    </main>
  );
}
