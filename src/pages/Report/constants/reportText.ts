import type { ResultTone } from '@/shared/types/resultTone';

type ReportFallbackCopy = {
  detectedRiskTypes: string[];
  domainRiskBadge: string;
  riskDescription: string;
  riskLevelText: string;
};

export const missingReportInfoLabel = '정보 없음';

export const reportFallbackCopyByTone: Record<ResultTone, ReportFallbackCopy> = {
  critical: {
    detectedRiskTypes: ['위험 점수 높음', '악성 또는 피싱 의심'],
    domainRiskBadge: '위험 등급: 높음',
    riskDescription: '악성 행위 또는 피싱과 관련된 강한 위험 신호가 감지되었습니다.',
    riskLevelText: '위험',
  },
  safe: {
    detectedRiskTypes: ['위협 미검출'],
    domainRiskBadge: '위험 등급: 낮음',
    riskDescription: '현재 분석 기준에서 위험 신호가 발견되지 않았습니다.',
    riskLevelText: '안전',
  },
  warning: {
    detectedRiskTypes: ['주의 필요', '추가 확인 필요'],
    domainRiskBadge: '위험 등급: 중간',
    riskDescription: '일부 의심 정황이 감지되어 추가 확인이 필요합니다.',
    riskLevelText: '주의',
  },
};

export const trustScoreFallbackByTone: Record<ResultTone, number> = {
  critical: 82,
  safe: 18,
  warning: 45,
};
