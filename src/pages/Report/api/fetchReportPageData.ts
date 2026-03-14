import type { ReportPageData } from '../types/reportPage.types';

export const mockReportPageData: ReportPageData = {
  reportTitle: '상세 분석 리포트',
  riskLevel: 'warning',
  scannedAt: '2026-03-14 14:10',
  scannedUrl: 'https://www.example-warning-site.com',
  sections: [
    {
      id: 'summary',
      items: ['리다이렉션이 2회 감지되었습니다.', '도메인 생성일이 짧아 추가 검토가 필요합니다.'],
      summary: '분석 결과, 주의가 필요한 정황이 확인되었습니다.',
      title: '요약',
    },
    {
      id: 'domain',
      items: [
        'WHOIS 생성일: 2025-12-01',
        'SSL 인증서 유효 기간이 짧습니다.',
        '유사 도메인 패턴이 일부 감지되었습니다.',
      ],
      summary: '도메인 및 인증서 정보 기준으로 위험 신호를 정리했습니다.',
      title: '도메인 분석',
    },
    {
      id: 'response',
      items: [
        '즉시 개인정보 입력을 요구하지 마세요.',
        '공식 사이트 주소와 일치하는지 교차 확인하세요.',
      ],
      summary: '사용자가 바로 취할 수 있는 대응 가이드입니다.',
      title: '대응 가이드',
    },
  ],
};

export async function fetchReportPageData(): Promise<ReportPageData> {
  return Promise.resolve(mockReportPageData);
}

export function getInitialReportPageData(): ReportPageData {
  return mockReportPageData;
}
