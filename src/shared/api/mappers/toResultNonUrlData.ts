import { pickSourceString } from '@/shared/api/mappers/payloadAccess';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';

type ResultNonUrlActionType = 'appLaunch' | 'appStore' | 'bitcoin' | 'telSms' | 'unknown' | 'wifi';

type ResultNonUrlViewData = {
  detectedActionType: ResultNonUrlActionType;
  sectionDescription: string;
  sectionNumber: string;
  sectionTitle: string;
  targetValue?: string;
};

type NonUrlCopy = {
  sectionDescription: string;
  sectionTitle: string;
};

const actionMatchers: Array<{
  actionType: ResultNonUrlActionType;
  keywords: string[];
}> = [
  { actionType: 'wifi', keywords: ['wifi'] },
  { actionType: 'bitcoin', keywords: ['bitcoin', 'btc'] },
  { actionType: 'telSms', keywords: ['sms', 'tel'] },
  { actionType: 'appStore', keywords: ['store', 'market'] },
  { actionType: 'appLaunch', keywords: ['app', 'intent'] },
];

const nonUrlCopyByActionType: Record<ResultNonUrlActionType, NonUrlCopy> = {
  appLaunch: {
    sectionDescription:
      '특정 앱 실행을 요청하는 QR 코드입니다. 사용자가 예상한 앱이 맞는지 먼저 확인해야 합니다.',
    sectionTitle: '탐지된 앱 실행 정보',
  },
  appStore: {
    sectionDescription:
      '앱 스토어 이동이 포함된 QR 코드입니다. 앱 이름과 개발사를 확인하기 전에는 설치를 진행하지 않는 편이 안전합니다.',
    sectionTitle: '탐지된 앱 스토어 이동 정보',
  },
  bitcoin: {
    sectionDescription:
      '가상자산 지갑 주소 또는 결제 요청이 포함된 QR 코드입니다. 송금 전 주소와 요청 맥락을 다시 확인해야 합니다.',
    sectionTitle: '탐지된 비트코인 지갑 정보',
  },
  telSms: {
    sectionDescription:
      '전화 또는 문자 앱 실행을 유도하는 QR 코드입니다. 의도하지 않은 발신이 발생하지 않도록 번호를 먼저 검토해야 합니다.',
    sectionTitle: '탐지된 전화·문자 실행 정보',
  },
  unknown: {
    sectionDescription:
      '정확한 실행 방식을 식별하지 못했습니다. 어떤 동작이 수행되는지 불명확하므로 직접 실행은 피하는 편이 안전합니다.',
    sectionTitle: '탐지된 비 URL 실행 정보',
  },
  wifi: {
    sectionDescription:
      'Wi-Fi 연결 정보를 포함한 QR 코드입니다. 네트워크 제공 주체를 확인한 뒤 연결 여부를 결정해야 합니다.',
    sectionTitle: '탐지된 Wi-Fi 연결 정보',
  },
};

const targetValueKeys = [
  'targetValue',
  'target_value',
  'decodedUrl',
  'decoded_url',
  'phoneNumber',
  'phone_number',
  'ssid',
  'appName',
  'app_name',
  'walletAddress',
  'wallet_address',
  'url',
];

function resolveNonUrlActionType(rawActionType: string | null): ResultNonUrlActionType {
  const normalizedActionType = rawActionType?.trim().toLowerCase() ?? '';

  if (!normalizedActionType) {
    return 'unknown';
  }

  return (
    actionMatchers.find(({ keywords }) =>
      keywords.some((keyword) => normalizedActionType.includes(keyword)),
    )?.actionType ?? 'unknown'
  );
}

export function toResultNonUrlData(session: ScanSessionSnapshot): ResultNonUrlViewData {
  const sources = [session.analysisDetail, session.finalResult, session.scanResponse];
  const actionType = resolveNonUrlActionType(
    pickSourceString(sources, ['actionType', 'action_type', 'schemeType', 'scheme_type']),
  );
  const copy = nonUrlCopyByActionType[actionType];

  return {
    detectedActionType: actionType,
    sectionDescription: copy.sectionDescription,
    sectionNumber: '1',
    sectionTitle: copy.sectionTitle,
    targetValue: pickSourceString(sources, targetValueKeys) ?? undefined,
  };
}
