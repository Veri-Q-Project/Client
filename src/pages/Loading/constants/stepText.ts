import type { LoadingDetailStep, LoadingStep, LoadingStepId } from '../types/loadingPage.types';

type LoadingStepCopyOverride = Partial<Omit<LoadingStep, 'id'>>;

const analysisDetailSteps: LoadingDetailStep[] = [
  {
    title: '도메인 신뢰도 확인',
    weight: 25,
  },
  {
    title: '파라미터 위험 패턴 확인',
    weight: 25,
  },
  {
    title: 'ML 위험도 추론',
    weight: 25,
  },
  {
    title: '최종 점수 산정',
    weight: 25,
  },
];

export const stepTextMap: Record<LoadingStepId, LoadingStep> = {
  aiAnalysis: {
    activeDescription: 'ML 모델로 URL의 위험 패턴을 분석하고 있습니다.',
    details: analysisDetailSteps,
    doneDescription: 'ML 기반 위험 분석이 완료되었습니다.',
    id: 'aiAnalysis',
    pendingDescription: 'ML 기반 위험 분석을 준비하고 있습니다.',
    title: 'ML 위험 분석',
    weight: 14,
  },
  completed: {
    activeDescription: '분석 결과를 정리하고 결과 페이지로 이동할 준비를 하고 있습니다.',
    doneDescription: '분석이 완료되었습니다. 결과 페이지로 이동합니다.',
    id: 'completed',
    pendingDescription: '최종 결과 정리를 준비하고 있습니다.',
    title: '분석 완료',
    weight: 6,
  },
  decode: {
    activeDescription: 'QR 코드에서 분석할 URL 정보를 확인하고 있습니다.',
    doneDescription: '분석 대상 URL 확인이 완료되었습니다.',
    id: 'decode',
    pendingDescription: 'QR 코드 해석을 준비하고 있습니다.',
    title: 'QR 해석',
    weight: 8,
  },
  externalApi: {
    activeDescription: '외부 위협 정보에서 악성 여부를 조회하고 있습니다.',
    doneDescription: '외부 위협 정보 조회가 완료되었습니다.',
    id: 'externalApi',
    pendingDescription: '외부 위협 정보 조회를 준비하고 있습니다.',
    title: '외부 위협 조회',
    weight: 12,
  },
  internalDb: {
    activeDescription: '내부 DB에서 기존 분석 이력을 조회하고 있습니다.',
    doneDescription: '내부 DB 조회가 완료되었습니다.',
    id: 'internalDb',
    pendingDescription: '내부 DB 조회를 준비하고 있습니다.',
    title: '내부 DB 조회',
    weight: 10,
  },
  redirect: {
    activeDescription: '리다이렉트 경로와 최종 도착 URL을 확인하고 있습니다.',
    doneDescription: '리다이렉트 확인이 완료되었습니다.',
    id: 'redirect',
    pendingDescription: '리다이렉트 확인을 준비하고 있습니다.',
    title: '리다이렉트 확인',
    weight: 10,
  },
  report: {
    activeDescription: '분석 결과를 화면 데이터로 정리하고 있습니다.',
    doneDescription: '결과 데이터 정리가 완료되었습니다.',
    id: 'report',
    pendingDescription: '결과 데이터 정리를 준비하고 있습니다.',
    title: '결과 정리',
    weight: 6,
  },
  riskScore: {
    activeDescription: '검사 결과를 바탕으로 최종 위험 점수를 계산하고 있습니다.',
    doneDescription: '최종 위험도 계산이 완료되었습니다.',
    id: 'riskScore',
    pendingDescription: '최종 위험도 계산을 준비하고 있습니다.',
    title: '위험도 계산',
    weight: 10,
  },
  ruleAnalysis: {
    activeDescription: '도메인과 파라미터 규칙을 기준으로 위험 요소를 검사하고 있습니다.',
    doneDescription: '규칙 기반 분석이 완료되었습니다.',
    id: 'ruleAnalysis',
    pendingDescription: '규칙 기반 분석을 준비하고 있습니다.',
    title: '규칙 기반 분석',
    weight: 12,
  },
  shortUrlCheck: {
    activeDescription: '단축 URL 여부를 확인하고 있습니다.',
    doneDescription: '단축 URL 여부 확인이 완료되었습니다.',
    id: 'shortUrlCheck',
    pendingDescription: '단축 URL 여부 확인을 준비하고 있습니다.',
    title: '단축 URL 확인',
    weight: 8,
  },
  urlNormalize: {
    activeDescription: '분석에 사용할 URL 형식을 정규화하고 있습니다.',
    doneDescription: 'URL 정규화가 완료되었습니다.',
    id: 'urlNormalize',
    pendingDescription: 'URL 정규화를 준비하고 있습니다.',
    title: 'URL 정규화',
    weight: 8,
  },
};

export const stepTextOverridesByCase: Record<
  number,
  Partial<Record<LoadingStepId, LoadingStepCopyOverride>>
> = {
  1: {
    internalDb: {
      doneDescription: '기존 분석 이력이 확인되어 저장된 결과를 사용합니다.',
    },
  },
  2: {
    shortUrlCheck: {
      doneDescription: '단축 URL로 확인되어 리다이렉트 추적을 진행합니다.',
    },
  },
  3: {
    shortUrlCheck: {
      doneDescription: '단축 URL로 확인되어 리다이렉트 경로를 먼저 추적합니다.',
    },
  },
  4: {
    internalDb: {
      doneDescription: '기존 분석 이력이 확인되어 저장된 결과를 사용합니다.',
    },
  },
  7: {
    externalApi: {
      doneDescription: '외부 위협 정보에서 위험 신호가 확인되어 추가 분석 없이 결과를 정리합니다.',
    },
  },
  8: {
    completed: {
      activeDescription: 'URL 형식이 아닌 QR 코드로 확인되어 결과 페이지로 이동합니다.',
      doneDescription: 'URL 형식이 아닌 QR 코드 분석이 완료되었습니다.',
    },
    decode: {
      doneDescription: 'QR 코드 내용이 URL 형식이 아닌 것으로 확인되었습니다.',
    },
  },
};
