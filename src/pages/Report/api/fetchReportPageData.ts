import type { ReportPageData } from '../types/reportPage.types';

export const mockReportPageData: ReportPageData = {
  detectedRiskTypes: ['유니코드 및 난독화'],
  domainComparison: {
    officialUrl: 'https://www.official-bank.com/login',
    riskBadgeText: '위험 등급: 높음',
    summary:
      '접속 시도 URL이 공식 금융기관 주소와 매우 유사하게 설계되어 사칭 사이트일 가능성이 높습니다.',
    suspiciousUrl: 'https://secure-bank-login.portal-verify.com/login',
  },
  reputation: {
    detailDescription:
      'Google Safe Browsing 조회 결과, 등재된 피싱·멀웨어·원치 않는 소프트웨어 위협은 발견되지 않았습니다.',
    providerName: 'Google Safe Browsing',
    providerStatusText: '검사 완료',
    summary: {
      malwareCount: 0,
      phishingCount: 0,
      spamCount: 0,
    },
  },
  reportTitle: '상세 분석 리포트',
  riskDescription: '의심 정황이 감지되어 추가 확인이 필요합니다.',
  riskLevel: 'warning',
  riskLevelText: '주의',
  scannedAt: '2026-03-14 14:10',
  scannedUrl: 'https://www.example-warning-site.com',
  serverInfo: {
    certificateIssuer: 'Google Trust Services LLC',
    certificateStatusText: '만료됨',
    certificateStatusTone: 'error',
    certificateValidityPeriod: '2024.01.15 - 2025.01.15',
    serverLocation: 'San Francisco, US',
    serverType: 'cloudflare-nginx',
  },
  trustScore: 68,
  urlAnalysis: {
    destinationUrl: 'https://secure-bank-login.portal-verify.com/login',
    originalUrl: 'https://qr-code-scanner.app/scan/result?id=82731',
  },
};

export async function fetchReportPageData(): Promise<ReportPageData> {
  return Promise.resolve(mockReportPageData);
}

export function getInitialReportPageData(): ReportPageData {
  return mockReportPageData;
}
