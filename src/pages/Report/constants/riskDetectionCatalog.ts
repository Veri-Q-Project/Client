export type RiskDetectionContent = {
  description: string;
  englishLabel: string;
  risk: string;
  title: string;
};

type RiskDetectionCatalogItem = RiskDetectionContent & {
  names: string[];
};

const riskDetectionCatalog: RiskDetectionCatalogItem[] = [
  {
    description:
      '네이버, 구글 등 유명 사이트와 주소가 한 글자만 다르거나(예: naver → navar) 철자 순서를 바꾼 가짜 사이트입니다.',
    englishLabel: 'TYPOSQUATTING ANALYSIS',
    names: ['위장 사이트 (사칭 및 오타 유도)', '위장 사이트', '사칭 사이트'],
    risk: '육안으로 구분하기 어려운 점을 악용해 로그인 정보를 입력하도록 유도하고 계정을 탈취할 수 있습니다.',
    title: '위장 사이트 감지',
  },
  {
    description:
      '데이터 전송 시 암호화를 거치지 않는 구식 통신 방식(http://) 사용이 감지되었습니다.',
    englishLabel: 'INSECURE HTTP',
    names: ['HTTPS 미사용', 'HTTP 사용', '비암호화 HTTP 사용'],
    risk: '아이디, 비밀번호 같은 민감 정보가 중간에서 탈취될 수 있어 금융/인증 화면에서는 매우 치명적입니다.',
    title: 'HTTPS 미사용 감지',
  },
  {
    description:
      '주소가 비정상적으로 길거나 주소 중간에 @ 기호를 사용해 실제 목적지를 숨기는 패턴이 감지되었습니다.',
    englishLabel: 'URL LENGTH & @ OBFUSCATION',
    names: ['비정상적인 URL 길이 및 @ 기호 사용', 'URL 길이 이상', 'URL @ 기호 사용'],
    risk: '앞부분에 정상 사이트처럼 보이는 문자열을 넣어 사용자의 클릭을 유도하는 전형적인 피싱 수법입니다.',
    title: '비정상 URL 구조 감지',
  },
  {
    description:
      '알파벳 대신 특수 문자 또는 다른 언어의 유사 문자를 섞어 주소를 난독화한 패턴이 확인되었습니다.',
    englishLabel: 'UNICODE OBFUSCATION',
    names: ['유니코드 및 난독화', '유니 코드 및 난독화', '난독화 URL'],
    risk: '육안으로는 정상 주소처럼 보여도 실제로는 다른 서버로 연결되어 보안 필터 우회를 시도할 수 있습니다.',
    title: '유니코드/난독화 감지',
  },
  {
    description:
      'URL 내에 -, _, ., % 같은 특수문자나 인코딩 기호가 비정상적으로 많이 포함된 패턴입니다.',
    englishLabel: 'SPECIAL CHARACTER OVERUSE',
    names: ['특수문자 과사용', '특수 문자 과사용'],
    risk: '실제 목적지를 숨겨 보안 탐지를 회피하고 사용자를 혼란시키는 의도가 강한 패턴입니다.',
    title: '특수문자 과사용 감지',
  },
  {
    description:
      '사람이 읽기 어려운 무작위 문자열 기반 도메인(a1b2c3d4.com 형태)이 감지되었습니다.',
    englishLabel: 'RANDOM DOMAIN PATTERN',
    names: ['무의미한 URL 감지', '난수 도메인', '무작위 URL'],
    risk: '자동 생성된 일회성 악성 도메인일 가능성이 높고, 단기간 악성 유포 후 사라지는 서버에서 자주 보입니다.',
    title: '무의미한 URL 감지',
  },
  {
    description:
      'naver.com 같은 도메인 대신 123.45.67.89 형태의 IP 주소로 직접 접속을 유도하는 패턴입니다.',
    englishLabel: 'DIRECT IP ACCESS',
    names: ['IP 주소 직접 사용', 'IP 직접 사용'],
    risk: '정식 도메인 등록 없이 운영되는 불분명한 서버일 가능성이 높아 피싱/악성 서버 위험이 큽니다.',
    title: 'IP 직접 접근 감지',
  },
  {
    description:
      '접속 시 사용자 동의 없이 .apk, .exe 등 실행 파일 다운로드를 유도하거나 자동 시작하는 동작이 감지되었습니다.',
    englishLabel: 'MALICIOUS DOWNLOAD ATTEMPT',
    names: ['악성 파일 다운로드 유도', '악성 파일 유도'],
    risk: '악성 앱 설치 후 문자 탈취, 원격 제어, 계정 탈취 등 보이스피싱 핵심 공격으로 이어질 수 있습니다.',
    title: '악성 파일 유도 감지',
  },
  {
    description:
      'javascript 스킴 등 브라우저 내부 기능을 직접 제어하려는 스크립트 실행 패턴이 탐지되었습니다.',
    englishLabel: 'BROWSER SCRIPT INJECTION',
    names: ['브라우저 취약점 공격 (스크립트 실행)', '스크립트 실행 공격', 'javascript 스킴 공격'],
    risk: '사용자 동의 없이 화면 조작, 세션 정보 탈취, 인증 우회 같은 고위험 공격으로 이어질 수 있습니다.',
    title: '스크립트 실행 공격 감지',
  },
  {
    description:
      'bit.ly, tinyurl 등 최종 목적지를 숨기기 위해 URL을 짧게 줄인 단축 URL이 감지되었습니다.',
    englishLabel: 'SHORT URL MASKING',
    names: ['단축 URL 서비스 감지', '단축 URL 감지'],
    risk: '피싱 목적지를 은폐하고 URL 필터링을 우회하기 위해 공격자가 자주 사용하는 대표적인 패턴입니다.',
    title: '단축 URL 감지',
  },
  {
    description:
      '최종 목적지로 가기 전에 여러 중간 서버를 거치도록 설계된 다중 리다이렉트 경로가 확인되었습니다.',
    englishLabel: 'MULTI-REDIRECT CHAIN',
    names: ['다중 리다이렉트 감지', '리다이렉트 체인'],
    risk: '분석/추적을 방해하고 사용자를 예상치 못한 위험 사이트로 유도하려는 악의적 의도가 포함될 수 있습니다.',
    title: '다중 리다이렉트 감지',
  },
];

const normalizeRiskType = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s\-_/.,:%@()]/g, '');

const riskDetectionLookup = riskDetectionCatalog.reduce<Map<string, RiskDetectionContent>>(
  (accumulator, catalogItem) => {
    catalogItem.names.forEach((name) => {
      accumulator.set(normalizeRiskType(name), {
        description: catalogItem.description,
        englishLabel: catalogItem.englishLabel,
        risk: catalogItem.risk,
        title: catalogItem.title,
      });
    });

    return accumulator;
  },
  new Map(),
);

export function resolveRiskDetectionContent(riskType: string): RiskDetectionContent {
  const normalizedRiskType = normalizeRiskType(riskType);
  const resolved = riskDetectionLookup.get(normalizedRiskType);

  if (resolved) {
    return resolved;
  }

  return {
    description: '백엔드에서 전달된 위험 유형에 대한 상세 설명이 아직 등록되지 않았습니다.',
    englishLabel: 'RISK SIGNAL ANALYSIS',
    risk: '정책 테이블에 매핑되지 않은 유형입니다. 추가 분석 후 위험성을 확정해 주세요.',
    title: `${riskType} 감지`,
  };
}
