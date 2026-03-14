import type { ReportPageData } from '../types/reportPage.types';

export const mockReportPageData: ReportPageData = {
  detectedRiskTypes: ['유니 코드 및 난독화'],
  domainComparison: {
    officialUrl: 'https://www.official-bank.com/login',
    riskBadgeText: '위험 등급: 높음',
    summary:
      '접속을 시도한 URL이 공식 금융기관 주소와 매우 유사하게 설계된 사칭 사이트로 확인되었습니다.',
    suspiciousUrl: 'https://secure-bank-login.portal-verify.com/login',
  },
  reputation: {
    detailDescription:
      'Google Safe Browsing이 이 URL을 실시간으로 스캔하고 분석한 결과 피싱, 악성 코드 배포, 또는 사용자를 속이려는 시도가 있는 사이트와 같은 위협 요소가 발견되지 않았습니다. 사용자는 이 웹사이트를 안심하고 방문하실 수 있습니다.',
    providerName: 'Google Safe Browsing',
    providerStatusText: '검사 완료',
    summary: {
      malwareCount: 0,
      phishingCount: 0,
      spamCount: 0,
    },
  },
  reportTitle: '상세 분석 리포트',
  riskDescription: '의심 패턴이 일부 감지되어 추가 확인이 필요합니다.',
  riskLevel: 'warning',
  riskLevelText: '주의',
  scannedAt: '2026-03-14 14:10',
  scannedUrl: 'https://www.example-warning-site.com',
  serverInfo: {
    certificateIssuer: 'Google Trust Services LLC',
    certificateStatusText: '유효함',
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
