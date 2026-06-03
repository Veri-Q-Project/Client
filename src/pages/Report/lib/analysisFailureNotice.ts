import { resolveRiskTypeLookupKeys } from '../constants/riskDetectionCatalog';

const analysisFailureTypeLabels: Record<string, string> = {
  certificatefailed: '인증서 분석',
  charcnnfailed: '문자 패턴 AI 분석',
  gsbfailed: 'Google Safe Browsing 조회',
  mlfailed: '머신러닝 종합 분석',
  otxfailed: 'OTX 위협 정보 조회',
  redirectclienterror: '리다이렉트 추적',
  redirectfailed: '리다이렉트 분석',
  redirectinvalidlocation: '리다이렉트 위치 확인',
  redirectloopdetected: '리다이렉트 루프 확인',
  redirectrequestfailed: '리다이렉트 요청',
  redirecttoomanyredirects: '과도한 리다이렉트 확인',
  scoringfailed: '최종 위험 점수 산정',
  serverinfofailed: '서버 정보 조회',
  whoisfailed: 'WHOIS 도메인 조회',
  xgbfailed: 'XGB AI 분석',
};

export type AnalysisFailureNotice = {
  hasFailureAlert: boolean;
  isOnlyAnalysisFailures: boolean;
  labels: string[];
};

function resolveAnalysisFailureLabel(riskType: string): string | null {
  const failureKey = resolveRiskTypeLookupKeys(riskType).find((lookupKey) =>
    Boolean(analysisFailureTypeLabels[lookupKey]),
  );

  return failureKey ? analysisFailureTypeLabels[failureKey] : null;
}

export function resolveAnalysisFailureNotice(detectedRiskTypes: string[]): AnalysisFailureNotice {
  const resolvedLabels = detectedRiskTypes.map((riskType) => resolveAnalysisFailureLabel(riskType));
  const labels = Array.from(
    new Set(resolvedLabels.filter((label): label is string => label !== null)),
  );
  const failureCount = resolvedLabels.filter((label) => label !== null).length;

  return {
    hasFailureAlert: labels.length > 0,
    isOnlyAnalysisFailures:
      detectedRiskTypes.length > 0 && failureCount === detectedRiskTypes.length,
    labels,
  };
}
