import type { ResultNonUrlPageData } from '../types/resultNonUrlPage.types';

export const mockResultNonUrlPageData: ResultNonUrlPageData = {
  detectedActionType: 'telSms',
  sectionDescription: '백엔드에서 전달한 실행 유형 상세 설명과 주의사항을 표시합니다.',
  sectionNumber: '1',
  sectionTitle: '탐지된 비 URL 유형 분석',
  targetValue: '010-1234-5678',
};

export async function fetchResultNonUrlPageData(): Promise<ResultNonUrlPageData> {
  return Promise.resolve(mockResultNonUrlPageData);
}

export function getInitialResultNonUrlPageData(): ResultNonUrlPageData {
  return mockResultNonUrlPageData;
}
