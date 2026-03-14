import type {
  LoadingCaseNumber,
  LoadingDetailStep,
  LoadingStep,
  LoadingStepId,
} from './types/loadingPage.types';

type LoadingStepOverride = Partial<Omit<LoadingStep, 'id'>>;

const aiAnalysisDetailSteps: LoadingDetailStep[] = [
  {
    title: '리다이렉트 경로 분석',
    weight: 26,
  },
  {
    title: '글로벌 보안 DB 대조',
    weight: 24,
  },
  {
    title: '도메인 사칭 분석',
    weight: 25,
  },
  {
    title: '서버 및 인증서 검사',
    weight: 25,
  },
];

const loadingStepMap: Record<LoadingStepId, LoadingStep> = {
  aiAnalysis: {
    activeDescription: '딥러닝 엔진이 위험 요소를 탐지하고 있습니다...',
    details: aiAnalysisDetailSteps,
    doneDescription: 'AI 위험 분석이 완료되었습니다.',
    id: 'aiAnalysis',
    pendingDescription: 'AI 위험 분석을 준비하고 있습니다...',
    title: 'AI 위험 분석',
    weight: 18,
  },
  completed: {
    activeDescription: '분석 결과를 정리하고 결과 페이지로 이동할 준비를 하고 있습니다...',
    doneDescription: '분석이 완료되었습니다. 결과 페이지로 이동합니다.',
    id: 'completed',
    pendingDescription: '최종 결과 정리를 준비하고 있습니다...',
    title: '분석 완료',
    weight: 8,
  },
  decode: {
    activeDescription: 'QR 코드의 실제 대상 URL을 읽어오고 있습니다...',
    doneDescription: 'QR 코드 디코딩이 완료되었습니다.',
    id: 'decode',
    pendingDescription: 'QR 코드 디코딩을 준비하고 있습니다...',
    title: 'QR 디코딩',
    weight: 14,
  },
  externalApi: {
    activeDescription: '외부 보안 API에서 위협 및 평판 정보를 조회하고 있습니다...',
    doneDescription: '외부 API 조회가 완료되었습니다.',
    id: 'externalApi',
    pendingDescription: '외부 API 조회를 준비하고 있습니다...',
    title: '외부 API 조회',
    weight: 12,
  },
  internalDb: {
    activeDescription: '내부 DB에서 기존 분석 이력과 수집 데이터를 조회하고 있습니다...',
    doneDescription: '내부 DB 조회가 완료되었습니다.',
    id: 'internalDb',
    pendingDescription: '내부 DB 조회를 준비하고 있습니다...',
    title: '내부 DB 조회',
    weight: 12,
  },
  redirect: {
    activeDescription: '단축 URL 또는 중간 경유 경로를 추적하고 있습니다...',
    doneDescription: '리다이렉션 추적이 완료되었습니다.',
    id: 'redirect',
    pendingDescription: '리다이렉션 추적을 준비하고 있습니다...',
    title: '리다이렉션 추적',
    weight: 14,
  },
  report: {
    activeDescription: '상세 분석 리포트를 작성하고 있습니다...',
    doneDescription: '리포트 작성이 완료되었습니다.',
    id: 'report',
    pendingDescription: '리포트 작성을 준비하고 있습니다...',
    title: '리포트 작성',
    weight: 10,
  },
  riskScore: {
    activeDescription: '분석 결과를 바탕으로 종합 위험도를 산출하고 있습니다...',
    doneDescription: '종합 위험도 산출이 완료되었습니다.',
    id: 'riskScore',
    pendingDescription: '종합 위험도 산출을 준비하고 있습니다...',
    title: '종합 위험도 산출',
    weight: 12,
  },
  shortUrlCheck: {
    activeDescription: '단축 URL 여부를 확인하고 있습니다...',
    doneDescription: '단축 URL이 확인되었습니다.',
    id: 'shortUrlCheck',
    pendingDescription: '단축 URL 여부 확인을 준비하고 있습니다...',
    title: '단축 URL 여부 확인',
    weight: 8,
  },
};

const loadingCaseStepOrder: Record<LoadingCaseNumber, LoadingStepId[]> = {
  1: ['decode', 'shortUrlCheck', 'redirect', 'internalDb', 'riskScore', 'report', 'completed'],
  2: [
    'decode',
    'shortUrlCheck',
    'redirect',
    'internalDb',
    'aiAnalysis',
    'riskScore',
    'report',
    'completed',
  ],
  3: [
    'decode',
    'shortUrlCheck',
    'redirect',
    'internalDb',
    'externalApi',
    'aiAnalysis',
    'riskScore',
    'report',
    'completed',
  ],
  4: ['decode', 'internalDb', 'riskScore', 'report', 'completed'],
  5: ['decode', 'internalDb', 'aiAnalysis', 'redirect', 'riskScore', 'report', 'completed'],
  6: [
    'decode',
    'internalDb',
    'externalApi',
    'aiAnalysis',
    'redirect',
    'riskScore',
    'report',
    'completed',
  ],
  7: ['decode', 'externalApi', 'completed'],
  8: ['decode', 'completed'],
};

const loadingCaseStepOverrides: Record<
  LoadingCaseNumber,
  Partial<Record<LoadingStepId, LoadingStepOverride>>
> = {
  1: {
    internalDb: {
      doneDescription: '분석 이력이 확인되어 저장된 결과를 그대로 사용합니다.',
    },
    shortUrlCheck: {
      doneDescription: '단축 URL이 확인되어 리다이렉션 추적으로 이동합니다.',
    },
  },
  2: {
    internalDb: {
      doneDescription: '분석 이력은 없지만 수집된 데이터가 있어 AI 분석을 이어갑니다.',
    },
    shortUrlCheck: {
      doneDescription: '단축 URL이 확인되어 리다이렉션 추적으로 이동합니다.',
    },
  },
  3: {
    externalApi: {
      doneDescription: '외부 API 조회가 완료되어 AI 위험 분석으로 이동합니다.',
    },
    internalDb: {
      doneDescription: '내부 DB에 분석 데이터가 없어 외부 API 조회를 진행합니다.',
    },
    shortUrlCheck: {
      doneDescription: '단축 URL이 확인되어 리다이렉션 추적으로 이동합니다.',
    },
  },
  4: {
    internalDb: {
      doneDescription: '분석 이력이 확인되어 저장된 결과를 그대로 사용합니다.',
    },
  },
  5: {
    internalDb: {
      doneDescription: '수집 데이터가 확인되어 AI 위험 분석을 진행합니다.',
    },
  },
  6: {
    externalApi: {
      doneDescription: '외부 API 조회가 완료되어 AI 위험 분석으로 이동합니다.',
    },
    internalDb: {
      doneDescription: '내부 DB만으로는 부족하여 외부 API 조회를 진행합니다.',
    },
  },
  7: {
    completed: {
      activeDescription: '안전 판정이 확인되어 결과 페이지로 이동하고 있습니다...',
      doneDescription: '외부 API에서 안전으로 판정되어 분석을 종료했습니다.',
    },
    externalApi: {
      doneDescription: '외부 API에서 안전 결과가 확인되어 추가 분석 없이 종료합니다.',
    },
  },
  8: {
    completed: {
      activeDescription: 'URL 형식이 아닌 QR 코드로 확인되어 분석을 종료하고 있습니다...',
      doneDescription: 'URL 형식이 아닌 QR 코드로 확인되어 분석을 종료했습니다.',
    },
    decode: {
      doneDescription: 'QR 코드 내용을 확인한 결과 URL 형식이 아니었습니다.',
    },
  },
};

export function getLoadingSteps(caseNumber: LoadingCaseNumber): LoadingStep[] {
  const stepOverrides = loadingCaseStepOverrides[caseNumber];

  return loadingCaseStepOrder[caseNumber].map((stepId) => {
    const step = loadingStepMap[stepId];
    const override = stepOverrides?.[stepId];
    const resolvedDetails = override?.details ?? step.details;

    return {
      ...step,
      ...override,
      details: resolvedDetails ? [...resolvedDetails] : undefined,
    };
  });
}

export function isLoadingCaseNumber(value: number): value is LoadingCaseNumber {
  return Number.isInteger(value) && value >= 1 && value <= 8;
}
