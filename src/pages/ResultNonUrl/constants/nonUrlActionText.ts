import type { NonUrlActionType } from '../types/resultNonUrlPage.types';

type NonUrlActionCatalogItem = {
  buildDescription: (targetValue?: string) => string;
  caution: string;
  englishLabel: string;
  previewLabel: string;
  title: string;
};

type NonUrlActionPreviewItem = {
  actionType: NonUrlActionType;
  label: string;
};

type ResolvedNonUrlActionContent = {
  caution: string;
  description: string;
  englishLabel: string;
  title: string;
};

const nonUrlActionTextMap: Record<NonUrlActionType, NonUrlActionCatalogItem> = {
  appLaunch: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 앱을 바로 실행하려는 QR 코드입니다. 앱이 설치되어 있으면 즉시 열리고, 설치되어 있지 않으면 연결 가능한 앱 선택 화면으로 이동할 수 있습니다.`
        : '특정 앱을 바로 실행하려는 QR 코드입니다. 설치된 앱을 호출해 화면 전환이나 특정 작업을 유도할 수 있습니다.',
    caution:
      '예상하지 못한 앱 실행은 금융 앱 이동, 인증 화면 호출, 악성 앱 연계 등으로 이어질 수 있으므로 사용자가 의도한 동작인지 먼저 확인해야 합니다.',
    englishLabel: 'APP LAUNCH INTENT',
    previewLabel: '앱 실행',
    title: '앱 실행 감지',
  },
  appStore: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 앱 설치 페이지로 이동하려는 QR 코드입니다. 사용자를 앱 스토어로 보내 설치 또는 업데이트를 유도할 수 있습니다.`
        : '앱 스토어 설치 페이지로 이동하려는 QR 코드입니다. 특정 앱 다운로드나 업데이트를 유도하는 동작입니다.',
    caution:
      '출처가 불명확한 설치 유도는 가짜 앱, 악성 앱, 과도한 권한 요청으로 이어질 수 있으므로 앱 이름과 개발사를 반드시 대조해야 합니다.',
    englishLabel: 'APP STORE INTENT',
    previewLabel: '앱 스토어',
    title: '앱 스토어 이동 감지',
  },
  bitcoin: {
    buildDescription: (targetValue) =>
      targetValue
        ? `비트코인 지갑 주소 "${targetValue}"를 확인하거나 송금을 유도하는 QR 코드입니다. 결제 화면 또는 지갑 앱으로 연결될 수 있습니다.`
        : '비트코인 지갑 주소를 확인하거나 송금을 유도하는 QR 코드입니다. 가상자산 결제 또는 지갑 앱 호출이 목적일 수 있습니다.',
    caution:
      '코인 지갑 주소는 한번 송금하면 되돌리기 어렵습니다. 주소 위변조나 사기 결제 유도 가능성이 있으므로 발신자와 결제 맥락을 먼저 검증해야 합니다.',
    englishLabel: 'BITCOIN WALLET',
    previewLabel: '비트코인',
    title: '비트코인 지갑 감지',
  },
  telSms: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}"로 전화 또는 문자 앱을 실행하려는 QR 코드입니다. 탭 한 번으로 발신이나 문자 작성 화면이 열릴 수 있습니다.`
        : '특정 번호로 전화 또는 문자 앱을 실행하려는 QR 코드입니다. 사용자를 통화나 메시지 발신 화면으로 바로 이동시킬 수 있습니다.',
    caution:
      '의도하지 않은 통화나 문자 발신은 프리미엄 요금 번호 연결, 스미싱 링크 응답, 개인정보 노출로 이어질 수 있으므로 번호를 먼저 확인해야 합니다.',
    englishLabel: 'TEL / SMS ACTION',
    previewLabel: '전화/문자',
    title: '전화·문자 실행 감지',
  },
  unknown: {
    buildDescription: () =>
      'QR 코드 내부에 실행 동작이 포함되어 있지만, 현재 분석 정보만으로는 정확히 어떤 행동이 수행되는지 식별되지 않았습니다.',
    caution:
      '동작을 명확히 알 수 없는 QR 코드는 예기치 않은 페이지 이동, 앱 호출, 파일 실행으로 이어질 수 있으므로 직접 실행하지 않는 편이 안전합니다.',
    englishLabel: 'UNKNOWN ACTION',
    previewLabel: '알 수 없음',
    title: '알 수 없는 실행 요청 감지',
  },
  wifi: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" Wi-Fi 네트워크에 연결하려는 QR 코드입니다. 저장된 네트워크 정보가 있으면 자동 연결 설정으로 이어질 수 있습니다.`
        : 'Wi-Fi 네트워크에 연결하려는 QR 코드입니다. SSID와 인증 방식이 포함되어 사용자를 특정 무선 네트워크로 유도합니다.',
    caution:
      '낯선 Wi-Fi 연결은 트래픽 가로채기, 피싱 포털, 악성 설정 유도로 이어질 수 있습니다. 네트워크 이름과 제공 주체를 먼저 확인해야 합니다.',
    englishLabel: 'WIFI CONFIGURATION',
    previewLabel: 'Wi-Fi',
    title: 'Wi-Fi 연결 감지',
  },
};

export const nonUrlActionPreviewItems: NonUrlActionPreviewItem[] = Object.entries(
  nonUrlActionTextMap,
).map(([actionType, catalogItem]) => ({
  actionType: actionType as NonUrlActionType,
  label: catalogItem.previewLabel,
}));

export function resolveNonUrlActionContent(
  actionType: NonUrlActionType,
  targetValue?: string,
): ResolvedNonUrlActionContent {
  const catalogItem = nonUrlActionTextMap[actionType];

  return {
    caution: catalogItem.caution,
    description: catalogItem.buildDescription(targetValue),
    englishLabel: catalogItem.englishLabel,
    title: catalogItem.title,
  };
}
