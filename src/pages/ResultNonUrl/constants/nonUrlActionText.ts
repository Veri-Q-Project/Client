import type { NonUrlActionType, ResultNonUrlPageData } from '../types/resultNonUrlPage.types';

type NonUrlSectionCopy = Pick<ResultNonUrlPageData, 'sectionDescription' | 'sectionTitle'>;

type NonUrlActionCatalogItem = NonUrlSectionCopy & {
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

const nonUrlActionTypeOrder: NonUrlActionType[] = [
  'WEB',
  'SHORT_URL',
  'OTP',
  'CRYPTO',
  'SMS',
  'WIFI',
  'CONTACT',
  'DEEP_LINK',
  'TEL',
  'EMAIL',
  'APP_STORE',
  'OTHER',
];

const nonUrlActionTextMap: Record<NonUrlActionType, NonUrlActionCatalogItem> = {
  WEB: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 웹페이지로 이동하도록 설계된 QR 코드입니다. 스캔 후 브라우저에서 해당 사이트를 열 수 있습니다.`
        : '브라우저에서 일반 웹페이지를 여는 QR 코드입니다. 로그인, 결제, 정보 입력 화면으로 연결될 수 있습니다.',
    caution:
      '도메인이 비슷한 피싱 사이트나 가짜 결제 페이지일 수 있습니다. 공식 주소인지 확인하기 전에는 민감한 정보를 입력하지 마세요.',
    englishLabel: 'WEB LINK',
    previewLabel: '웹',
    sectionDescription:
      '일반적인 웹사이트 주소로 연결되는 QR 코드입니다. 접속 전에 도메인과 접속 목적을 먼저 확인하세요.',
    sectionTitle: '탐지된 웹사이트 이동 정보',
    title: '웹 링크 감지',
  },
  SHORT_URL: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 단축 링크를 열도록 유도하는 QR 코드입니다. 클릭 직후 다른 주소로 즉시 리다이렉트될 수 있습니다.`
        : 'bit.ly 같은 단축 URL을 열어 실제 목적지로 리다이렉트시키는 QR 코드입니다.',
    caution:
      '단축 URL은 표시된 링크만으로 최종 목적지를 판단하기 어렵습니다. 출처가 확실하지 않다면 바로 열지 않는 편이 안전합니다.',
    englishLabel: 'SHORT URL',
    previewLabel: '단축 URL',
    sectionDescription:
      'bit.ly 등 단축 URL 서비스로 연결되는 QR 코드입니다. 실제 최종 도착지가 숨겨져 있을 수 있습니다.',
    sectionTitle: '탐지된 단축 URL 정보',
    title: '단축 링크 감지',
  },
  OTP: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 인증용 OTP 설정 정보를 담고 있는 QR 코드입니다. 인증 앱에 새 계정을 등록하도록 유도할 수 있습니다.`
        : '2단계 인증 앱에서 새 OTP 계정을 등록하거나 불러오는 용도의 QR 코드입니다.',
    caution:
      '본인이 직접 설정 중인 계정이 아니라면 추가하지 마세요. 잘못 등록하면 계정 접근이나 복구 과정에 혼선이 생길 수 있습니다.',
    englishLabel: 'OTP SETUP',
    previewLabel: 'OTP',
    sectionDescription:
      '2단계 인증용 일회용 비밀번호 설정 정보가 포함된 QR 코드입니다. 인증 앱에 계정이 추가될 수 있습니다.',
    sectionTitle: '탐지된 OTP 등록 정보',
    title: 'OTP 설정 감지',
  },
  CRYPTO: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 지갑 주소 또는 송금 요청 값을 포함한 QR 코드입니다. 지갑 앱이나 결제 화면이 열릴 수 있습니다.`
        : '가상자산 지갑 주소, 송금 요청, 결제 연결에 사용되는 QR 코드입니다.',
    caution:
      '가상자산 전송은 되돌리기 어렵습니다. 주소, 네트워크, 금액을 모두 직접 확인하기 전에는 승인하지 마세요.',
    englishLabel: 'CRYPTO PAYMENT',
    previewLabel: '가상자산',
    sectionDescription:
      '가상자산 지갑 주소 및 송금 요청을 담은 QR 코드입니다. 지갑 앱 실행이나 송금 화면으로 이어질 수 있습니다.',
    sectionTitle: '탐지된 가상자산 지갑 정보',
    title: '가상자산 요청 감지',
  },
  SMS: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 문자 전송 동작을 유도하는 QR 코드입니다. 메시지 앱이 열리면서 수신자 또는 본문이 미리 입력될 수 있습니다.`
        : '문자 메시지 앱을 열어 발송을 유도하는 QR 코드입니다.',
    caution:
      '자동 입력된 수신자나 문구를 그대로 보내면 비용 발생, 인증 요청 대응, 피싱 회신으로 이어질 수 있으니 내용을 먼저 확인하세요.',
    englishLabel: 'SMS ACTION',
    previewLabel: '문자',
    sectionDescription:
      '문자 메시지 작성 또는 발송 화면을 여는 QR 코드입니다. 수신자와 본문이 자동으로 채워질 수 있습니다.',
    sectionTitle: '탐지된 문자 발송 정보',
    title: '문자 발송 감지',
  },
  WIFI: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" Wi-Fi 네트워크에 연결하도록 돕는 QR 코드입니다. 기기에서 네트워크 추가 또는 자동 연결이 제안될 수 있습니다.`
        : 'SSID, 보안 방식, 비밀번호 등 Wi-Fi 접속 정보를 담은 QR 코드입니다.',
    caution:
      '출처가 불분명한 네트워크에 연결하면 트래픽 가로채기나 가짜 포털 페이지로 이어질 수 있습니다. 네트워크 제공자를 먼저 확인하세요.',
    englishLabel: 'WIFI CONFIGURATION',
    previewLabel: 'Wi-Fi',
    sectionDescription: '와이파이 네트워크에 자동 연결할 수 있는 설정 정보가 담긴 QR 코드입니다.',
    sectionTitle: '탐지된 Wi-Fi 연결 정보',
    title: 'Wi-Fi 연결 감지',
  },
  CONTACT: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 연락처 정보를 기기에 저장하도록 유도하는 QR 코드입니다. 주소록 앱이 열리거나 신규 연락처 등록이 제안될 수 있습니다.`
        : '연락처 카드(vCard/MECARD)를 불러와 저장하도록 돕는 QR 코드입니다.',
    caution:
      '허위 연락처를 저장하면 사칭 연락이나 사회공학 공격에 더 취약해질 수 있습니다. 저장 전 발신처와 상세 정보를 검토하세요.',
    englishLabel: 'CONTACT VCARD',
    previewLabel: '연락처',
    sectionDescription:
      '연락처(vCard) 정보를 담은 QR 코드입니다. 이름, 전화번호, 이메일 등이 주소록에 저장될 수 있습니다.',
    sectionTitle: '탐지된 연락처 저장 정보',
    title: '연락처 카드 감지',
  },
  DEEP_LINK: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 앱 내부의 특정 화면을 바로 열도록 설계된 QR 코드입니다. 앱이 설치되어 있으면 즉시 해당 화면으로 이동할 수 있습니다.`
        : '앱 실행 후 특정 화면이나 기능으로 바로 이동시키는 딥링크 QR 코드입니다.',
    caution:
      '딥링크는 송금, 로그인, 공유, 결제 같은 민감한 화면으로 바로 연결될 수 있습니다. 실행 전에 어떤 앱이 열리는지 확인하세요.',
    englishLabel: 'APP DEEP LINK',
    previewLabel: '딥링크',
    sectionDescription:
      '특정 앱의 특정 화면을 바로 여는 딥링크입니다. 예: instagram://, kakaotalk://, kakaopay/money/remit',
    sectionTitle: '탐지된 앱 딥링크 정보',
    title: '앱 딥링크 감지',
  },
  TEL: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 번호로 전화를 걸도록 유도하는 QR 코드입니다. 스캔 후 전화 앱이 열리며 발신 준비 상태가 될 수 있습니다.`
        : '전화 앱을 열어 특정 번호로 발신을 유도하는 QR 코드입니다.',
    caution:
      '고가 요금 번호나 상담 사칭 통화로 이어질 수 있습니다. 번호를 직접 확인한 뒤 진행하세요.',
    englishLabel: 'PHONE CALL',
    previewLabel: '전화',
    sectionDescription:
      '전화 걸기 화면으로 이동하는 QR 코드입니다. 번호가 자동 입력될 수 있습니다.',
    sectionTitle: '탐지된 전화 걸기 정보',
    title: '전화 걸기 감지',
  },
  EMAIL: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 메일 작성 동작을 유도하는 QR 코드입니다. 메일 앱이 열리면서 수신자나 제목, 본문이 자동 입력될 수 있습니다.`
        : '메일 앱을 열어 특정 주소로 이메일 작성을 유도하는 QR 코드입니다.',
    caution:
      '자동 입력된 수신자나 본문에 민감한 정보가 포함될 수 있습니다. 보내기 전에 주소와 내용을 다시 확인하세요.',
    englishLabel: 'EMAIL ACTION',
    previewLabel: '이메일',
    sectionDescription:
      '이메일 작성 화면을 여는 QR 코드입니다. 받는 사람, 제목, 본문이 미리 입력될 수 있습니다.',
    sectionTitle: '탐지된 이메일 작성 정보',
    title: '이메일 작성 감지',
  },
  APP_STORE: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 앱 마켓 페이지로 연결되는 QR 코드입니다. 앱 설치, 업데이트, 상세 페이지 열기를 유도할 수 있습니다.`
        : '앱 마켓에서 특정 앱 페이지를 열도록 설계된 QR 코드입니다.',
    caution:
      '유사 앱이나 사칭 앱 설치로 이어질 수 있으니 앱 이름, 개발사, 다운로드 수를 확인한 뒤 진행하세요.',
    englishLabel: 'APP STORE LINK',
    previewLabel: '앱 마켓',
    sectionDescription:
      '앱 마켓(Play Store, App Store)의 설치 또는 업데이트 페이지로 이동하는 QR 코드입니다.',
    sectionTitle: '탐지된 앱 마켓 이동 정보',
    title: '앱 마켓 이동 감지',
  },
  OTHER: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 값을 포함하고 있지만 현재 규칙만으로는 정확한 동작을 단정하기 어려운 QR 코드입니다.`
        : '현재 분류 체계로 바로 식별되지 않는 기타 QR 코드입니다.',
    caution:
      '정확한 동작이 불분명한 경우 직접 실행하지 않는 편이 안전합니다. 필요한 경우 내용을 별도로 검토한 뒤 판단하세요.',
    englishLabel: 'OTHER / UNKNOWN',
    previewLabel: '기타',
    sectionDescription:
      '기타 텍스트 및 미분류 타입입니다. 기기에서 예상치 못한 동작이 제안될 수 있습니다.',
    sectionTitle: '탐지된 기타 스키마 정보',
    title: '기타 스키마 감지',
  },
};

export const nonUrlActionPreviewItems: NonUrlActionPreviewItem[] = nonUrlActionTypeOrder.map(
  (actionType) => ({
    actionType,
    label: nonUrlActionTextMap[actionType].previewLabel,
  }),
);

export function resolveNonUrlSectionCopy(actionType: NonUrlActionType): NonUrlSectionCopy {
  const catalogItem = nonUrlActionTextMap[actionType];

  return {
    sectionDescription: catalogItem.sectionDescription,
    sectionTitle: catalogItem.sectionTitle,
  };
}

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
