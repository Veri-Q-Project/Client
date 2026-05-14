import type { NonUrlActionType, ResultNonUrlPageData } from '../types/resultNonUrlPage.types';

type NonUrlSectionCopy = Pick<ResultNonUrlPageData, 'sectionDescription' | 'sectionTitle'>;

type NonUrlActionCatalogItem = NonUrlSectionCopy & {
  buildDescription: (targetValue?: string) => string;
  caution: string;
  englishLabel: string;
  title: string;
};

type ResolvedNonUrlActionContent = {
  caution: string;
  description: string;
  englishLabel: string;
  title: string;
};

const nonUrlActionTextMap: Record<NonUrlActionType, NonUrlActionCatalogItem> = {
  WEB: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 웹페이지를 열도록 설계된 QR 코드입니다. 스캔하면 브라우저가 열리며 해당 사이트로 이동할 수 있고, 이후 로그인, 결제, 본인인증, 파일 다운로드 같은 추가 동작으로 이어질 수 있습니다. 겉보기에는 정상 사이트처럼 보여도 중간에 다른 페이지로 이동하거나 비슷한 주소를 사용하는 피싱 페이지일 수 있습니다.`
        : '일반 웹사이트를 열도록 만든 QR 코드입니다. 스캔 후 브라우저에서 사이트가 열리며, 로그인 화면이나 이벤트 페이지, 결제 화면, 자료 다운로드 페이지처럼 사용자의 추가 행동을 유도하는 흐름으로 이어질 수 있습니다. URL이 익숙해 보여도 실제 도메인과 연결 목적을 꼭 다시 확인하는 것이 좋습니다.',
    caution:
      '공식 사이트와 비슷한 주소를 사용한 피싱 페이지일 수 있습니다. 로그인 정보, 카드 정보, 계정 인증번호 같은 민감한 정보를 입력하기 전에는 도메인을 먼저 확인하세요.',
    englishLabel: 'WEB LINK',
    sectionDescription:
      '일반적인 웹사이트 주소로 연결되는 QR 코드입니다. 브라우저에서 페이지가 열리며 로그인, 결제, 다운로드, 개인정보 입력 같은 후속 행동이 이어질 수 있으니 접속 전에 도메인과 목적을 먼저 확인하세요.',
    sectionTitle: '탐지된 웹사이트 이동 정보',
    title: '웹 링크 감지',
  },
  SHORT_URL: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 단축 URL을 열도록 유도하는 QR 코드입니다. 단축 링크는 표시되는 주소와 실제 최종 도착 주소가 다를 수 있어서, 스캔 직후 다른 사이트로 자동 이동할 수 있습니다. 정상적인 마케팅 링크일 수도 있지만, 사용자가 목적지를 바로 알아차리지 못하게 하려는 의도로 악용되는 경우도 있습니다.`
        : 'bit.ly 같은 단축 URL 서비스를 이용하는 QR 코드입니다. 이런 링크는 짧고 깔끔해 보여도 실제로는 다른 긴 주소로 리다이렉트되며, 사용자는 스캔 전에는 최종 목적지를 정확히 알기 어렵습니다. 정상 링크인지 아닌지 외형만 보고 판단하기 어려운 유형입니다.',
    caution:
      '단축 URL은 최종 목적지가 숨겨져 있어 바로 신뢰하기 어렵습니다. 출처가 명확하지 않다면 즉시 열지 말고, 가능한 경우 목적지를 먼저 확인하세요.',
    englishLabel: 'SHORT URL',
    sectionDescription:
      'bit.ly 등 단축 URL 서비스로 연결되는 QR 코드입니다. 실제 최종 도착 주소가 가려져 있을 수 있어서, 사용자는 스캔 전에는 어디로 이동하는지 정확히 알기 어렵습니다.',
    sectionTitle: '탐지된 단축 URL 정보',
    title: '단축 링크 감지',
  },
  OTP: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" OTP 등록 정보를 담고 있는 QR 코드입니다. 보통 인증 앱이 이 값을 읽어 특정 계정의 2단계 인증용 일회용 비밀번호를 생성할 수 있게 설정합니다. 사용자가 의도하지 않은 계정을 인증 앱에 추가하거나, 공격자가 잘못된 계정을 등록하도록 유도하는 데 악용될 수 있으므로 어떤 서비스의 인증 정보인지 확인이 필요합니다.`
        : '2단계 인증용 OTP 설정 정보를 담은 QR 코드입니다. 보통 Google Authenticator, Microsoft Authenticator 같은 인증 앱에서 새 계정을 추가할 때 사용되며, 스캔 후에는 해당 서비스의 일회용 인증번호를 생성할 수 있게 됩니다. 본인이 직접 설정 중인 계정이 아니라면 무심코 등록하지 않는 것이 안전합니다.',
    caution:
      '본인이 직접 등록하려던 계정이 아니라면 추가하지 마세요. 잘못된 OTP를 등록하면 계정 관리 과정에 혼선이 생기거나, 공격자가 안내하는 인증 절차에 끌려갈 수 있습니다.',
    englishLabel: 'OTP SETUP',
    sectionDescription:
      '2단계 인증용 일회용 비밀번호 설정 정보가 포함된 QR 코드입니다. 인증 앱에 새 계정이 추가될 수 있으므로 어떤 서비스의 계정을 등록하는지 먼저 확인해야 합니다.',
    sectionTitle: '탐지된 OTP 등록 정보',
    title: 'OTP 설정 감지',
  },
  CRYPTO: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 가상자산 지갑 주소 또는 송금 요청 값을 포함한 QR 코드입니다. 스캔하면 지갑 앱이나 결제 화면이 열리면서 받는 주소, 전송 네트워크, 금액, 메모가 미리 채워질 수 있습니다. 암호화폐 전송은 한 번 승인하면 취소가 어렵기 때문에, 표시된 정보가 익숙해 보여도 주소와 요청 맥락을 직접 다시 확인해야 합니다.`
        : '가상자산 지갑 주소나 송금 요청을 담은 QR 코드입니다. 주로 비트코인, 이더리움 같은 지갑 앱에서 결제나 송금을 더 쉽게 하기 위해 사용되며, 스캔 후에는 지갑 앱 또는 송금 확인 화면이 열릴 수 있습니다. 거래 특성상 잘못 보낸 자산을 되돌리기 어려워 특히 주의가 필요한 유형입니다.',
    caution:
      '가상자산 전송은 되돌리기 어렵습니다. 주소, 네트워크, 금액, 요청한 상대가 모두 맞는지 직접 확인하기 전에는 승인하지 마세요.',
    englishLabel: 'CRYPTO PAYMENT',
    sectionDescription:
      '가상자산 지갑 주소 및 송금 요청을 담은 QR 코드입니다. 스캔 후 지갑 앱이 열리거나 송금 화면이 표시될 수 있으며, 주소와 금액이 자동으로 채워질 수 있습니다.',
    sectionTitle: '탐지된 가상자산 지갑 정보',
    title: '가상자산 요청 감지',
  },
  SMS: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 문자 메시지 발송 동작을 유도하는 QR 코드입니다. 스캔하면 메시지 앱이 열리고 수신자 번호나 본문이 미리 입력될 수 있어, 사용자가 확인 버튼만 누르면 바로 발송되는 흐름이 만들어질 수 있습니다. 본문에 특정 링크 클릭 요청, 인증번호 회신 요청, 상담 유도 문구가 포함되어 있을 가능성도 있어 내용을 충분히 읽어보는 것이 중요합니다.`
        : '문자 메시지 작성 또는 발송 화면을 여는 QR 코드입니다. 스캔 후 메시지 앱이 열리면서 특정 번호와 문구가 자동 입력될 수 있고, 사용자는 그 상태에서 전송만 하도록 유도될 수 있습니다. 짧은 동작처럼 보여도 비용 발생이나 스미싱 대응으로 이어질 수 있어 주의가 필요합니다.',
    caution:
      '자동 입력된 번호나 문구를 그대로 보내면 비용 발생, 인증 우회 시도 대응, 스미싱 회신으로 이어질 수 있습니다. 전송 전 수신자와 본문을 모두 확인하세요.',
    englishLabel: 'SMS ACTION',
    sectionDescription:
      '문자 메시지 작성 또는 발송 화면을 여는 QR 코드입니다. 수신자 번호와 본문이 자동 입력될 수 있어서, 사용자가 의도하지 않은 메시지를 보내도록 유도할 수 있습니다.',
    sectionTitle: '탐지된 문자 발송 정보',
    title: '문자 발송 감지',
  },
  WIFI: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" Wi-Fi 네트워크 접속 정보를 담고 있는 QR 코드입니다. 스캔하면 기기에서 네트워크 추가 또는 자동 연결이 제안될 수 있으며, SSID와 보안 방식, 비밀번호가 포함될 수 있습니다. 편리한 연결 수단처럼 보이지만, 출처가 불분명한 무선 네트워크는 트래픽 가로채기나 가짜 로그인 포털로 이어질 수 있습니다.`
        : 'Wi-Fi 네트워크에 연결하기 위한 설정 정보를 담은 QR 코드입니다. 사용자는 비밀번호를 직접 입력하지 않아도 네트워크를 추가하거나 연결할 수 있어서 편리하지만, 그만큼 어떤 네트워크에 붙는지 무심코 지나치기 쉽습니다. 공개 장소에서 제공된 QR이라면 운영 주체가 신뢰할 만한지 먼저 확인하는 것이 좋습니다.',
    caution:
      '모르는 Wi-Fi에 연결하면 통신 내용 가로채기, 가짜 인증 페이지, 악성 설정 유도로 이어질 수 있습니다. 네트워크 이름과 제공 주체를 먼저 확인하세요.',
    englishLabel: 'WIFI CONFIGURATION',
    sectionDescription:
      '와이파이 네트워크에 자동 연결할 수 있는 설정 정보가 담긴 QR 코드입니다. SSID, 보안 방식, 비밀번호가 포함될 수 있으므로 신뢰할 수 있는 네트워크인지 먼저 확인한 뒤 연결해야 합니다.',
    sectionTitle: '탐지된 Wi-Fi 연결 정보',
    title: 'Wi-Fi 연결 감지',
  },
  CONTACT: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 연락처 저장 정보를 담은 QR 코드입니다. 스캔하면 주소록 앱이 열리거나 신규 연락처 저장 화면이 표시되며, 이름, 전화번호, 이메일, 회사명, 웹사이트 같은 값이 자동 입력될 수 있습니다. 편리한 명함 공유 용도로 자주 쓰이지만, 허위 연락처를 저장하게 하거나 사칭 대상을 주소록에 남기게 만드는 데 악용될 수도 있습니다.`
        : '연락처 카드(vCard, MECARD) 정보를 담은 QR 코드입니다. 보통 명함이나 안내문에서 연락처를 빠르게 저장하게 할 때 사용되며, 스캔 후에는 주소록 등록 화면이 열릴 수 있습니다. 등록 자체는 단순해 보여도 잘못된 연락처를 저장하면 이후 사칭 전화나 메시지를 더 쉽게 신뢰하게 될 수 있습니다.',
    caution:
      '저장 전 이름, 전화번호, 이메일, 회사명이 실제로 맞는지 확인하세요. 허위 연락처를 저장하면 이후 사칭 연락을 더 쉽게 믿게 될 수 있습니다.',
    englishLabel: 'CONTACT VCARD',
    sectionDescription:
      '연락처(vCard) 정보를 담은 QR 코드입니다. 이름, 전화번호, 이메일, 회사명 등이 주소록에 저장될 수 있으므로 저장 전에 정보의 진위를 확인하는 것이 좋습니다.',
    sectionTitle: '탐지된 연락처 저장 정보',
    title: '연락처 카드 감지',
  },
  DEEP_LINK: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 앱 내부의 특정 화면을 바로 열도록 설계된 딥링크 QR 코드입니다. 앱이 이미 설치되어 있으면 해당 앱이 즉시 실행되며, 로그인 화면, 친구 추가 화면, 송금 화면, 게시물 화면, 결제 화면처럼 특정 기능으로 바로 이동할 수 있습니다. 일반 웹링크보다 사용자가 지금 어느 앱으로 이동하는지 놓치기 쉬워서, 예상하지 못한 앱 실행이나 민감한 화면 진입에 특히 주의해야 합니다.`
        : '특정 앱의 특정 화면이나 기능을 직접 열기 위한 딥링크 QR 코드입니다. 예를 들어 메신저 대화창, SNS 프로필, 간편결제 송금 화면처럼 앱 내부의 세부 위치로 바로 이동할 수 있습니다. 사용자가 의도하지 않은 앱을 실행하게 만들거나 금융·인증 화면으로 바로 진입시키는 데 악용될 수 있는 유형입니다.',
    caution:
      '딥링크는 송금, 로그인, 친구추가, 결제 같은 민감한 화면으로 바로 연결될 수 있습니다. 어떤 앱이 열리는지와 왜 그 화면으로 가는지를 먼저 확인하세요.',
    englishLabel: 'APP DEEP LINK',
    sectionDescription:
      '특정 앱의 특정 화면을 바로 여는 딥링크입니다. 예를 들어 instagram://, kakaotalk://, kakaopay/money/remit 같은 형식으로 앱 내부 기능까지 직접 열 수 있습니다.',
    sectionTitle: '탐지된 앱 딥링크 정보',
    title: '앱 딥링크 감지',
  },
  TEL: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 번호로 전화를 걸도록 유도하는 QR 코드입니다. 스캔하면 전화 앱이 열리고 상대 번호가 미리 입력된 상태가 될 수 있어, 사용자는 발신 버튼만 누르면 바로 통화가 시작될 수 있습니다. 고객센터나 예약 전화처럼 정상적인 용도도 있지만, 고가 요금 번호 연결이나 기관 사칭 통화로 이어질 수 있어 번호 자체를 먼저 확인하는 것이 중요합니다.`
        : '전화 걸기 화면을 여는 QR 코드입니다. 사용자는 번호를 직접 입력하지 않아도 바로 발신 준비 상태로 이동할 수 있어 빠르지만, 그만큼 어떤 번호로 연결되는지 놓치기 쉽습니다. 정상적인 안내용 QR일 수도 있지만, 사칭 상담 번호나 비용이 큰 번호로 유도하는 데 악용될 가능성도 있습니다.',
    caution:
      '모르는 번호나 고가 요금 번호로 연결될 수 있습니다. 발신 전에 번호와 안내한 주체가 실제로 맞는지 확인하세요.',
    englishLabel: 'PHONE CALL',
    sectionDescription:
      '전화 걸기 화면으로 이동하는 QR 코드입니다. 번호가 자동 입력될 수 있어서 사용자가 의도하지 않은 상대에게 바로 발신하도록 유도할 수 있습니다.',
    sectionTitle: '탐지된 전화 걸기 정보',
    title: '전화 걸기 감지',
  },
  EMAIL: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 이메일 작성 동작을 유도하는 QR 코드입니다. 스캔하면 메일 앱이 열리고 받는 사람, 제목, 본문이 미리 채워질 수 있어 사용자는 확인 후 바로 전송하도록 유도될 수 있습니다. 정상 문의 접수용일 수도 있지만, 민감한 정보 제출을 유도하거나 특정 주소로 자료를 보내게 만드는 방식으로 악용될 수도 있습니다.`
        : '이메일 작성 화면을 여는 QR 코드입니다. 특정 수신자와 제목, 본문을 자동으로 넣어 사용자가 빠르게 메일을 보내도록 돕는 형태이며, 행사 문의나 고객지원 용도로도 사용됩니다. 다만 무심코 전송하면 의도하지 않은 주소로 개인정보나 첨부파일을 보내게 될 수 있어 주의가 필요합니다.',
    caution:
      '자동 입력된 수신자, 제목, 본문을 그대로 신뢰하지 마세요. 보내기 전에 이메일 주소와 요청 내용이 적절한지 다시 확인하세요.',
    englishLabel: 'EMAIL ACTION',
    sectionDescription:
      '이메일 작성 화면을 여는 QR 코드입니다. 받는 사람, 제목, 본문이 미리 입력될 수 있어 사용자가 특정 주소로 바로 메일을 보내도록 유도할 수 있습니다.',
    sectionTitle: '탐지된 이메일 작성 정보',
    title: '이메일 작성 감지',
  },
  APP_STORE: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 앱 마켓 페이지로 연결되는 QR 코드입니다. 스캔하면 Play Store 또는 App Store의 특정 앱 상세 화면, 설치 화면, 업데이트 화면이 열릴 수 있습니다. 공식 앱 설치를 돕는 정상 용도도 많지만, 사용자가 앱 이름만 보고 유사 앱이나 사칭 앱을 설치하도록 유도하는 흐름으로 악용될 수도 있습니다.`
        : '앱 마켓에서 특정 앱 페이지를 열도록 설계된 QR 코드입니다. 사용자는 검색 과정을 거치지 않고 바로 설치 또는 업데이트 화면으로 이동할 수 있어 편리하지만, 그만큼 개발사와 앱 이름을 꼼꼼히 보지 않고 설치를 진행하기 쉽습니다. 공식 서비스로 보이더라도 개발사명과 앱 정보를 직접 확인하는 것이 좋습니다.',
    caution:
      '앱 이름이 비슷하다고 같은 앱은 아닙니다. 설치 전 개발사명, 다운로드 수, 리뷰, 권한 요청 내용을 확인하세요.',
    englishLabel: 'APP STORE LINK',
    sectionDescription:
      '앱 마켓(Play Store, App Store)의 설치 또는 업데이트 페이지로 이동하는 QR 코드입니다. 검색 없이 바로 앱 페이지로 이동하므로 개발사와 앱 정보를 꼭 확인해야 합니다.',
    sectionTitle: '탐지된 앱 마켓 이동 정보',
    title: '앱 마켓 이동 감지',
  },
  OTHER: {
    buildDescription: (targetValue) =>
      targetValue
        ? `"${targetValue}" 값을 포함하고 있지만 현재 분류 규칙만으로는 정확한 동작을 단정하기 어려운 QR 코드입니다. 단순한 텍스트일 수도 있고, 특정 앱이나 서비스에서만 해석되는 사용자 정의 스키마일 수도 있습니다. 어떤 앱이 이 값을 처리하느냐에 따라 전혀 다른 동작이 일어날 수 있으므로 내용을 충분히 검토하기 전에는 바로 실행하지 않는 편이 안전합니다.`
        : '현재 분류 체계에서 명확히 식별되지 않는 기타 QR 코드입니다. 일반 텍스트, 내부 시스템 코드, 특수 포맷, 사용자 정의 스키마처럼 다양한 값이 여기에 포함될 수 있습니다. 겉으로는 무해해 보여도 특정 앱이 해석하면 예상치 못한 행동으로 이어질 수 있어 보수적으로 판단하는 편이 좋습니다.',
    caution:
      '정확한 동작을 알 수 없는 QR 코드는 자동 실행하지 않는 편이 안전합니다. 필요한 경우 내용을 먼저 검토하고, 신뢰할 수 있는 출처인지 확인한 뒤 판단하세요.',
    englishLabel: 'OTHER / UNKNOWN',
    sectionDescription:
      '기타 텍스트 및 미분류 타입입니다. 현재 규칙으로는 동작을 명확히 설명하기 어려우며, 특정 앱이나 환경에서만 해석되는 값일 수 있으니 바로 실행하지 않는 것이 안전합니다.',
    sectionTitle: '탐지된 기타 스키마 정보',
    title: '기타 스키마 감지',
  },
};

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
