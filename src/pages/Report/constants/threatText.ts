import type { ResultTone } from '@/shared/types/resultTone';

export type RiskDetectionContent = {
  description: string;
  englishLabel: string;
  risk: string;
  title: string;
};

type RiskDetectionCatalogItem = RiskDetectionContent & {
  names: string[];
};

export const threatTextCatalog: RiskDetectionCatalogItem[] = [
  {
    description:
      '네이버, 구글 등 유명 사이트와 주소가 한 글자만 다르거나(예: naver → navar) 철자 순서를 바꾼 가짜 사이트입니다.',
    englishLabel: 'TYPOSQUATTING ANALYSIS',
    names: [
      '위장 사이트 (사칭 및 오타 유도)',
      '위장 사이트',
      '사칭 사이트',
      'typosquatting',
      'typo_squatting',
      'lookalike_domain',
      'spoofed_domain',
    ],
    risk: '육안으로 구분하기 어려운 점을 악용해 로그인 정보를 입력하도록 유도하고 계정을 탈취할 수 있습니다.',
    title: '위장 사이트 감지',
  },
  {
    description:
      '데이터 전송 시 암호화를 거치지 않는 구식 통신 방식(http://) 사용이 감지되었습니다.',
    englishLabel: 'INSECURE HTTP',
    names: [
      'HTTPS 미사용',
      'HTTP 사용',
      '비암호화 HTTP 사용',
      'insecure_http',
      'http_only',
      'no_https',
      'https_missing',
    ],
    risk: '아이디, 비밀번호 같은 민감 정보가 중간에서 탈취될 수 있어 금융/인증 화면에서는 매우 치명적입니다.',
    title: 'HTTPS 미사용 감지',
  },
  {
    description:
      '주소가 비정상적으로 길거나 주소 중간에 @ 기호를 사용해 실제 목적지를 숨기는 패턴이 감지되었습니다.',
    englishLabel: 'URL LENGTH & @ OBFUSCATION',
    names: [
      '비정상적인 URL 길이 및 @ 기호 사용',
      'URL 길이 이상',
      'URL @ 기호 사용',
      'long_url',
      'url_length_anomaly',
      'at_symbol_url',
      'url_obfuscation',
    ],
    risk: '앞부분에 정상 사이트처럼 보이는 문자열을 넣어 사용자의 클릭을 유도하는 전형적인 피싱 수법입니다.',
    title: '비정상 URL 구조 감지',
  },
  {
    description:
      '알파벳 대신 특수 문자 또는 다른 언어의 유사 문자를 섞어 주소를 난독화한 패턴이 확인되었습니다.',
    englishLabel: 'UNICODE OBFUSCATION',
    names: [
      '유니코드 및 난독화',
      '유니 코드 및 난독화',
      '난독화 URL',
      'unicode_obfuscation',
      'homograph_attack',
      'idn_homograph',
    ],
    risk: '육안으로는 정상 주소처럼 보여도 실제로는 다른 서버로 연결되어 보안 필터 우회를 시도할 수 있습니다.',
    title: '유니코드/난독화 감지',
  },
  {
    description:
      'URL 내에 -, _, ., % 같은 특수문자나 인코딩 기호가 비정상적으로 많이 포함된 패턴입니다.',
    englishLabel: 'SPECIAL CHARACTER OVERUSE',
    names: [
      '특수문자 과사용',
      '특수 문자 과사용',
      'special_char_overuse',
      'special_character_overuse',
      'excessive_special_chars',
    ],
    risk: '실제 목적지를 숨겨 보안 탐지를 회피하고 사용자를 혼란시키는 의도가 강한 패턴입니다.',
    title: '특수문자 과사용 감지',
  },
  {
    description:
      '사람이 읽기 어려운 무작위 문자열 기반 도메인(a1b2c3d4.com 형태)이 감지되었습니다.',
    englishLabel: 'RANDOM DOMAIN PATTERN',
    names: [
      '무의미한 URL 감지',
      '난수 도메인',
      '무작위 URL',
      'random_domain',
      'dga',
      'algorithmically_generated_domain',
    ],
    risk: '자동 생성된 일회성 악성 도메인일 가능성이 높고, 단기간 악성 유포 후 사라지는 서버에서 자주 보입니다.',
    title: '무의미한 URL 감지',
  },
  {
    description:
      'naver.com 같은 도메인 대신 123.45.67.89 형태의 IP 주소로 직접 접속을 유도하는 패턴입니다.',
    englishLabel: 'DIRECT IP ACCESS',
    names: ['IP 주소 직접 사용', 'IP 직접 사용', 'direct_ip_access', 'ip_access', 'raw_ip_url'],
    risk: '정식 도메인 등록 없이 운영되는 불분명한 서버일 가능성이 높아 피싱/악성 서버 위험이 큽니다.',
    title: 'IP 직접 접근 감지',
  },
  {
    description:
      '접속 시 사용자 동의 없이 .apk, .exe 등 실행 파일 다운로드를 유도하거나 자동 시작하는 동작이 감지되었습니다.',
    englishLabel: 'MALICIOUS DOWNLOAD ATTEMPT',
    names: [
      '악성 파일 다운로드 유도',
      '악성 파일 유도',
      'malicious_download',
      'drive_by_download',
      'auto_download',
    ],
    risk: '악성 앱 설치 후 문자 탈취, 원격 제어, 계정 탈취 등 보이스피싱 핵심 공격으로 이어질 수 있습니다.',
    title: '악성 파일 유도 감지',
  },
  {
    description:
      'javascript 스킴 등 브라우저 내부 기능을 직접 제어하려는 스크립트 실행 패턴이 탐지되었습니다.',
    englishLabel: 'BROWSER SCRIPT INJECTION',
    names: [
      '브라우저 취약점 공격 (스크립트 실행)',
      '스크립트 실행 공격',
      'javascript 스킴 공격',
      'script_injection',
      'javascript_scheme',
      'browser_exploit',
    ],
    risk: '사용자 동의 없이 화면 조작, 세션 정보 탈취, 인증 우회 같은 고위험 공격으로 이어질 수 있습니다.',
    title: '스크립트 실행 공격 감지',
  },
  {
    description:
      'bit.ly, tinyurl 등 최종 목적지를 숨기기 위해 URL을 짧게 줄인 단축 URL이 감지되었습니다.',
    englishLabel: 'SHORT URL MASKING',
    names: ['단축 URL 서비스 감지', '단축 URL 감지', 'shortened_url', 'short_url', 'url_shortener'],
    risk: '피싱 목적지를 은폐하고 URL 필터링을 우회하기 위해 공격자가 자주 사용하는 대표적인 패턴입니다.',
    title: '단축 URL 감지',
  },
  {
    description:
      '최종 목적지로 가기 전에 여러 중간 서버를 거치도록 설계된 다중 리다이렉트 경로가 확인되었습니다.',
    englishLabel: 'MULTI-REDIRECT CHAIN',
    names: [
      '다중 리다이렉트 감지',
      '리다이렉트 체인',
      'multi_redirect',
      'redirect_chain',
      'multiple_redirects',
    ],
    risk: '분석/추적을 방해하고 사용자를 예상치 못한 위험 사이트로 유도하려는 악의적 의도가 포함될 수 있습니다.',
    title: '다중 리다이렉트 감지',
  },
  {
    description:
      'Veri-Q AI 모델이 학습된 피싱·악성 패턴과 일치하는 신호를 URL 구조에서 포착했습니다.',
    englishLabel: 'AI MODEL SIGNAL',
    names: [
      'ML 모델 의심 신호',
      'ml_threat',
      'dummy_ml_threat',
      'ml_signal',
      'ml_anomaly',
      'model_flagged',
    ],
    risk: '단일 신호만으로 단정 짓기는 어렵지만, 다른 위험 항목과 함께 발견되면 종합적인 위험도가 크게 상승합니다.',
    title: 'AI 모델 의심 신호 감지',
  },
  {
    description:
      'bit.ly, tinyurl처럼 최종 목적지를 바로 확인하기 어려운 단축 URL 서비스가 사용되었습니다.',
    englishLabel: 'SHORTENED URL',
    names: ['SHORTENED_URL'],
    risk: '실제 목적지를 숨긴 뒤 피싱 사이트나 악성 파일 배포지로 이동시키는 데 자주 사용됩니다.',
    title: '단축 URL 감지',
  },
  {
    description: 'URL 안에 %2F, %3A처럼 문자를 퍼센트 인코딩으로 감춘 흔적이 확인되었습니다.',
    englishLabel: 'PERCENT ENCODING DETECTED',
    names: ['percent_encoding_detected', 'percent_encoding', 'url_percent_encoding'],
    risk: '위험 키워드나 실제 이동 경로를 숨겨 보안 필터와 사용자의 육안 확인을 우회할 수 있습니다.',
    title: '퍼센트 인코딩 감지',
  },
  {
    description:
      'URL 일부가 한 번 더 인코딩된 형태로 보여, 원래 문자열을 바로 확인하기 어렵습니다.',
    englishLabel: 'DOUBLE ENCODING SUSPECTED',
    names: ['double_encoding_suspected', 'double_encoding', 'nested_encoding'],
    risk: '악성 경로나 파라미터를 단계적으로 숨겨 자동 분석과 차단 규칙을 회피하려는 패턴일 수 있습니다.',
    title: '이중 인코딩 의심 감지',
  },
  {
    description:
      '쿼리 파라미터에 redirect, callback, next 등 외부 이동이나 민감 동작과 관련된 의심 패턴이 포함되었습니다.',
    englishLabel: 'SUSPICIOUS QUERY PARAMETER',
    names: [
      'suspicious_query_param_detected',
      'suspicious_query_param',
      'suspicious_query_parameter',
    ],
    risk: '정상 사이트처럼 보이는 주소에서 사용자를 다른 목적지로 넘기거나 피싱 절차를 숨길 수 있습니다.',
    title: '의심스러운 쿼리 파라미터 감지',
  },
  {
    description:
      'URL 내부에 또 다른 URL이 포함되어 있어 최종 이동 목적지가 별도로 숨겨져 있을 가능성이 있습니다.',
    englishLabel: 'EMBEDDED URL',
    names: ['embedded_url', 'nested_url', 'url_in_url'],
    risk: '정상 도메인을 경유지처럼 사용해 사용자를 악성 사이트로 리다이렉트하는 공격에 활용될 수 있습니다.',
    title: 'URL 내부 삽입 주소 감지',
  },
  {
    description:
      '쿼리 문자열에서 login, verify, password, wallet 같은 민감 행동을 유도하는 키워드가 확인되었습니다.',
    englishLabel: 'SUSPICIOUS QUERY KEYWORD',
    names: [
      'suspicious_query_keyword_detected',
      'suspicious_query_keyword',
      'query_keyword_detected',
    ],
    risk: '계정 인증, 결제, 지갑 연결처럼 사용자의 민감 정보를 입력하게 만드는 피싱 흐름일 수 있습니다.',
    title: '쿼리 위험 키워드 감지',
  },
  {
    description:
      'URL 경로에서 login, update, secure, download 등 공격자가 자주 쓰는 유도성 키워드가 감지되었습니다.',
    englishLabel: 'SUSPICIOUS PATH KEYWORD',
    names: ['suspicious_path_keyword_detected', 'suspicious_path_keyword', 'path_keyword_detected'],
    risk: '공식 로그인, 보안 업데이트, 파일 다운로드처럼 보이게 만들어 클릭과 정보 입력을 유도할 수 있습니다.',
    title: '경로 위험 키워드 감지',
  },
  {
    description:
      'URL fragment 영역(# 뒤 문자열)에 민감 행동을 유도하는 의심 키워드가 포함되었습니다.',
    englishLabel: 'SUSPICIOUS FRAGMENT KEYWORD',
    names: [
      'suspicious_fragment_keyword_detected',
      'suspicious_fragment_keyword',
      'fragment_keyword_detected',
    ],
    risk: '서버 로그에 잘 남지 않는 fragment를 이용해 피싱 화면 상태나 악성 동작 정보를 숨길 수 있습니다.',
    title: '프래그먼트 위험 키워드 감지',
  },
  {
    description: '외부 위협 정보에서 악성코드 배포 또는 악성 행위와 관련된 URL로 분류되었습니다.',
    englishLabel: 'MALWARE',
    names: ['MALWARE', 'malware'],
    risk: '접속만으로 악성 파일 다운로드, 브라우저 악용, 계정 정보 탈취 같은 피해로 이어질 수 있습니다.',
    title: '악성코드 위협 감지',
  },
  {
    description:
      '사용자를 속여 로그인, 결제, 설치, 권한 허용 같은 행동을 하게 만드는 사회공학 공격 신호가 확인되었습니다.',
    englishLabel: 'SOCIAL ENGINEERING',
    names: ['SOCIAL_ENGINEERING', 'social_engineering'],
    risk: '정상 안내처럼 보이지만 민감 정보 입력이나 악성 앱 설치를 유도해 직접적인 피해를 만들 수 있습니다.',
    title: '사회공학 위협 감지',
  },
  {
    description:
      '원치 않는 광고, 브라우저 설정 변경, 번들 프로그램 설치 등 사용자에게 불필요하거나 해로운 소프트웨어와 관련된 신호입니다.',
    englishLabel: 'UNWANTED SOFTWARE',
    names: ['UNWANTED_SOFTWARE', 'unwanted_software'],
    risk: '명확한 동의 없이 프로그램이 설치되거나 환경 설정이 바뀌어 개인정보 노출과 추가 악성 행위로 이어질 수 있습니다.',
    title: '원치 않는 소프트웨어 감지',
  },
  {
    description: '잠재적으로 유해한 앱 설치 또는 실행을 유도하는 URL로 분류되었습니다.',
    englishLabel: 'POTENTIALLY HARMFUL APPLICATION',
    names: ['POTENTIALLY_HARMFUL_APPLICATION', 'potentially_harmful_application', 'pha'],
    risk: '문자, 연락처, 인증 정보 같은 권한을 악용하거나 원격 제어 기능으로 금융 피해를 유발할 수 있습니다.',
    title: '잠재적 유해 앱 감지',
  },
  {
    description: '로그인 정보, 결제 정보, 인증 코드 등을 탈취하려는 피싱 URL로 분류되었습니다.',
    englishLabel: 'PHISHING',
    names: ['PHISHING', 'phishing'],
    risk: '공식 사이트와 유사한 화면으로 사용자를 속여 계정 탈취, 결제 피해, 추가 사기 피해로 이어질 수 있습니다.',
    title: '피싱 위협 감지',
  },
  {
    description: '랜섬웨어 유포 또는 랜섬웨어 공격 인프라와 관련된 신호가 확인되었습니다.',
    englishLabel: 'RANSOMWARE',
    names: ['RANSOMWARE', 'ransomware'],
    risk: '악성 파일 실행 시 기기나 파일이 암호화되고 금전 요구, 업무 중단, 데이터 손실로 이어질 수 있습니다.',
    title: '랜섬웨어 위협 감지',
  },
  {
    description: '감염된 기기 네트워크나 자동화된 악성 트래픽과 관련된 봇넷 신호가 확인되었습니다.',
    englishLabel: 'BOTNET',
    names: ['BOTNET', 'botnet'],
    risk: '접속한 기기가 악성 네트워크에 연결되거나 스팸 발송, 디도스, 추가 감염에 악용될 수 있습니다.',
    title: '봇넷 위협 감지',
  },
  {
    description: '대량 발송 스팸, 사기성 광고, 악성 링크 배포와 관련된 URL로 분류되었습니다.',
    englishLabel: 'SPAM',
    names: ['SPAM', 'spam'],
    risk: '반복적인 사기 메시지나 악성 링크 유입 경로로 사용되어 피싱, 결제 사기, 악성 앱 설치로 이어질 수 있습니다.',
    title: '스팸 위협 감지',
  },
  {
    description:
      '악성코드가 명령을 받거나 탈취 정보를 전송하는 C2(Command and Control) 인프라 신호가 감지되었습니다.',
    englishLabel: 'COMMAND AND CONTROL',
    names: ['C2', 'c2', 'command_and_control', 'command_control'],
    risk: '이미 감염된 기기를 제어하거나 추가 명령을 내려 정보 탈취와 내부 확산을 수행할 수 있습니다.',
    title: 'C2 통신 위협 감지',
  },
  {
    description:
      '외부 평판 또는 분석 결과에서 명확한 세부 분류는 없지만 의심 URL로 표시되었습니다.',
    englishLabel: 'SUSPICIOUS',
    names: ['SUSPICIOUS', 'suspicious'],
    risk: '단일 신호로 단정할 수는 없지만 다른 탐지 항목과 함께 나타나면 접속 위험도가 크게 올라갑니다.',
    title: '의심 URL 감지',
  },
  {
    description: '서버가 공인 인증기관이 아닌 자체 서명 인증서를 사용하고 있습니다.',
    englishLabel: 'CERT SELF SIGNED',
    names: ['CERT_SELF_SIGNED', 'cert_self_signed', 'self_signed_certificate'],
    risk: '서버 신원을 제3자가 검증하지 않았기 때문에 위장 서버나 중간자 공격 가능성을 추가로 확인해야 합니다.',
    title: '자체 서명 인증서 감지',
  },
  {
    description: '브라우저나 보안 시스템이 신뢰하지 않는 인증서 체인이 확인되었습니다.',
    englishLabel: 'CERT UNTRUSTED',
    names: ['CERT_UNTRUSTED', 'cert_untrusted', 'untrusted_certificate'],
    risk: '정상적인 HTTPS처럼 보여도 인증서 발급 주체를 신뢰하기 어려워 민감 정보 입력 시 위험할 수 있습니다.',
    title: '신뢰되지 않은 인증서 감지',
  },
  {
    description: 'HTTPS 인증서의 유효 기간이 이미 만료된 것으로 확인되었습니다.',
    englishLabel: 'CERT EXPIRED',
    names: ['CERT_EXPIRED', 'cert_expired', 'expired_certificate'],
    risk: '관리되지 않는 서버이거나 위장 사이트일 가능성이 있으며, 암호화 연결의 신뢰성을 보장하기 어렵습니다.',
    title: '만료된 인증서 감지',
  },
  {
    description: '인증서에 기록된 도메인과 실제 접속하려는 호스트명이 서로 일치하지 않습니다.',
    englishLabel: 'CERT HOSTNAME MISMATCH',
    names: ['CERT_HOSTNAME_MISMATCH', 'cert_hostname_mismatch', 'hostname_mismatch'],
    risk: '다른 사이트용 인증서를 사용한 위장 서버일 수 있어 로그인, 결제, 개인정보 입력을 피해야 합니다.',
    title: '인증서 호스트명 불일치 감지',
  },
  {
    description: '인증서의 유효 시작일이 아직 도래하지 않아 현재 시점에서는 유효하지 않습니다.',
    englishLabel: 'CERT NOT YET VALID',
    names: ['CERT_NOT_YET_VALID', 'cert_not_yet_valid', 'certificate_not_yet_valid'],
    risk: '서버 시간이 잘못되었거나 비정상 인증서를 사용했을 수 있어 신뢰성을 판단하기 어렵습니다.',
    title: '아직 유효하지 않은 인증서 감지',
  },
  {
    description: '인증서가 발급기관에 의해 폐기 또는 취소된 상태로 확인되었습니다.',
    englishLabel: 'CERT REVOKED',
    names: ['CERT_REVOKED', 'cert_revoked', 'revoked_certificate'],
    risk: '인증서 탈취, 잘못된 발급, 서버 침해 같은 문제로 폐기되었을 수 있어 접속 위험도가 높습니다.',
    title: '폐기된 인증서 감지',
  },
  {
    description: 'SSL/TLS 연결 또는 인증서 검증 과정에서 일반적인 보안 오류가 발생했습니다.',
    englishLabel: 'CERT SSL ERROR',
    names: ['CERT_SSL_ERROR', 'cert_ssl_error', 'ssl_error', 'tls_error'],
    risk: '암호화 연결이 정상적으로 검증되지 않아 중간자 공격이나 잘못 구성된 서버 가능성을 배제하기 어렵습니다.',
    title: 'SSL/TLS 오류 감지',
  },
  {
    description: '인증서 검증에 사용할 호스트 정보가 잘못되었거나 유효하지 않습니다.',
    englishLabel: 'CERT INVALID HOST',
    names: ['CERT_INVALID_HOST', 'cert_invalid_host', 'invalid_certificate_host'],
    risk: '정상 도메인이 아닌 값으로 인증서 검증이 시도되어 실제 서버 신원을 확인하기 어렵습니다.',
    title: '인증서 호스트 오류 감지',
  },
  {
    description: '인증서 확인을 위한 HTTPS 연결을 정상적으로 수립하지 못했습니다.',
    englishLabel: 'CERT CONNECTION FAILED',
    names: ['CERT_CONNECTION_FAILED', 'cert_connection_failed', 'certificate_connection_failed'],
    risk: '서버가 분석을 차단하거나 불안정한 악성 인프라일 수 있어 다른 신호와 함께 주의가 필요합니다.',
    title: '인증서 연결 실패 감지',
  },
  {
    description: '인증서 조회 대상의 DNS 또는 호스트 정보를 확인하지 못했습니다.',
    englishLabel: 'CERT LOOKUP FAILED',
    names: ['CERT_LOOKUP_FAILED', 'cert_lookup_failed', 'certificate_lookup_failed'],
    risk: '일시적으로 사라지는 도메인, 잘못된 URL, 분석 회피용 인프라일 가능성이 있어 신뢰 판단이 제한됩니다.',
    title: '인증서 조회 실패 감지',
  },
  {
    description: '인증서 검증 요청이 제한 시간 안에 완료되지 않았습니다.',
    englishLabel: 'CERT TIMEOUT',
    names: ['CERT_TIMEOUT', 'cert_timeout', 'certificate_timeout', 'tls_certificate_timeout'],
    risk: 'HTTPS 신뢰 정보를 충분히 확인하지 못해 서버 신뢰성을 판단하기 어렵고, 은폐된 서버일 수 있습니다.',
    title: '인증서 검증 시간 초과 감지',
  },
  {
    description: '서버가 HTTPS 연결에서 확인 가능한 인증서를 제공하지 않았습니다.',
    englishLabel: 'CERT NO CERTIFICATE',
    names: ['CERT_NO_CERTIFICATE', 'cert_no_certificate', 'no_certificate'],
    risk: '서버 신원을 확인할 수 없어 민감 정보 입력 시 도청, 위장 서버, 피싱 위험을 배제하기 어렵습니다.',
    title: '인증서 미제공 감지',
  },
  {
    description: '인증서 검증 중 분류되지 않은 오류가 발생했습니다.',
    englishLabel: 'CERT UNKNOWN ERROR',
    names: ['CERT_UNKNOWN_ERROR', 'cert_unknown_error', 'unknown_certificate_error'],
    risk: '정확한 원인은 확인되지 않았지만 HTTPS 신뢰 검증이 완료되지 않아 보수적인 접근이 필요합니다.',
    title: '인증서 알 수 없는 오류 감지',
  },
  {
    description: 'Google Safe Browsing 평판 조회가 정상적으로 완료되지 않았습니다.',
    englishLabel: 'GSB FAILED',
    names: ['GSB_FAILED', 'gsb_failed', 'google_safe_browsing_failed'],
    risk: '외부 평판 결과가 비어 있어 안전 여부를 단정하기 어렵고, 다른 탐지 신호를 함께 확인해야 합니다.',
    title: 'Google Safe Browsing 조회 실패 감지',
  },
  {
    description: 'OTX 위협 인텔리전스 조회가 정상적으로 완료되지 않았습니다.',
    englishLabel: 'OTX FAILED',
    names: ['OTX_FAILED', 'otx_failed', 'alienvault_otx_failed'],
    risk: '공개 위협 정보 기반 검증이 제한되어 최근 악성 이력이나 캠페인 연관성을 충분히 확인하지 못했습니다.',
    title: 'OTX 조회 실패 감지',
  },
  {
    description: 'WHOIS 또는 도메인 등록 정보 조회가 정상적으로 완료되지 않았습니다.',
    englishLabel: 'WHOIS FAILED',
    names: ['WHOIS_FAILED', 'whois_failed', 'domain_whois_failed'],
    risk: '도메인 생성일, 등록자, 만료일 같은 신뢰 판단 자료가 부족해 신생 악성 도메인 여부를 확인하기 어렵습니다.',
    title: 'WHOIS 조회 실패 감지',
  },
  {
    description: '리다이렉트 경로 분석이 정상적으로 완료되지 않았습니다.',
    englishLabel: 'REDIRECT FAILED',
    names: ['REDIRECT_FAILED', 'redirect_failed', 'redirect_analysis_failed'],
    risk: '최종 도착지를 확인하지 못해 정상 URL처럼 보이는 중간 경유지 뒤의 위험 사이트를 놓칠 수 있습니다.',
    title: '리다이렉트 분석 실패 감지',
  },
  {
    description: '리다이렉트 대상에 요청을 보내는 과정에서 오류가 발생했습니다.',
    englishLabel: 'REDIRECT REQUEST FAILED',
    names: ['REDIRECT_REQUEST_FAILED', 'redirect_request_failed'],
    risk: '서버가 분석 요청을 차단하거나 조건부로 다른 목적지를 제공할 수 있어 실제 사용자의 이동 경로 확인이 제한됩니다.',
    title: '리다이렉트 요청 실패 감지',
  },
  {
    description: '리다이렉트 요청 중 클라이언트 오류 응답이 확인되었습니다.',
    englishLabel: 'REDIRECT CLIENT ERROR',
    names: ['REDIRECT_CLIENT_ERROR', 'redirect_client_error'],
    risk: '잘못된 경로 또는 접근 제한으로 인해 최종 URL을 확인하지 못했으며, 의도적으로 분석을 방해하는 구성일 수 있습니다.',
    title: '리다이렉트 클라이언트 오류 감지',
  },
  {
    description: '리다이렉트가 같은 경로를 반복하는 순환 구조로 확인되었습니다.',
    englishLabel: 'REDIRECT LOOP DETECTED',
    names: ['REDIRECT_LOOP_DETECTED', 'redirect_loop_detected', 'redirect_loop'],
    risk: '분석과 추적을 방해하거나 사용자를 특정 흐름에 가두려는 비정상 구성일 수 있습니다.',
    title: '리다이렉트 루프 감지',
  },
  {
    description: '허용 범위를 넘는 과도한 리다이렉트 단계가 확인되었습니다.',
    englishLabel: 'REDIRECT TOO MANY REDIRECTS',
    names: ['REDIRECT_TOO_MANY_REDIRECTS', 'redirect_too_many_redirects', 'too_many_redirects'],
    risk: '최종 목적지를 숨기고 보안 필터를 우회하기 위한 다단계 이동 경로일 가능성이 있습니다.',
    title: '과도한 리다이렉트 감지',
  },
  {
    description: '리다이렉트 응답의 Location 값이 비어 있거나 유효한 URL 형식이 아닙니다.',
    englishLabel: 'REDIRECT INVALID LOCATION',
    names: ['REDIRECT_INVALID_LOCATION', 'redirect_invalid_location', 'invalid_redirect_location'],
    risk: '비정상 응답으로 최종 목적지 확인이 제한되며, 분석 회피 또는 잘못 구성된 위험 서버일 수 있습니다.',
    title: '유효하지 않은 리다이렉트 위치 감지',
  },
  {
    description: '서버 유형, 위치, 응답 헤더 등 인프라 정보 조회가 정상적으로 완료되지 않았습니다.',
    englishLabel: 'SERVER INFO FAILED',
    names: ['SERVER_INFO_FAILED', 'server_info_failed', 'server_lookup_failed'],
    risk: '서버 신뢰 판단에 필요한 정보가 부족해 정상 서비스 여부와 운영 안정성을 충분히 확인하기 어렵습니다.',
    title: '서버 정보 조회 실패 감지',
  },
  {
    description: '인증서 분석 단계 전체가 정상적으로 완료되지 않았습니다.',
    englishLabel: 'CERTIFICATE FAILED',
    names: ['CERTIFICATE_FAILED', 'certificate_failed', 'certificate_analysis_failed'],
    risk: 'HTTPS 신뢰성 검증 결과가 제한되어 접속 대상 서버의 신원을 확정하기 어렵습니다.',
    title: '인증서 분석 실패 감지',
  },
  {
    description: 'CharCNN 기반 URL 패턴 분석 모델 실행이 정상적으로 완료되지 않았습니다.',
    englishLabel: 'CHARCNN FAILED',
    names: ['CHARCNN_FAILED', 'charcnn_failed', 'char_cnn_failed'],
    risk: '문자 패턴 기반 AI 탐지가 누락되어 난독화 URL이나 피싱 패턴 판단 신뢰도가 낮아질 수 있습니다.',
    title: 'CharCNN 분석 실패 감지',
  },
  {
    description: 'XGBoost 기반 위험도 분석 모델 실행이 정상적으로 완료되지 않았습니다.',
    englishLabel: 'XGB FAILED',
    names: ['XGB_FAILED', 'xgb_failed', 'xgboost_failed'],
    risk: '특징 기반 AI 판정이 누락되어 최종 점수 산정에 필요한 일부 근거가 부족할 수 있습니다.',
    title: 'XGB 분석 실패 감지',
  },
  {
    description: '머신러닝 분석 단계가 정상적으로 완료되지 않았습니다.',
    englishLabel: 'ML FAILED',
    names: ['ML_FAILED', 'ml_failed', 'machine_learning_failed'],
    risk: 'AI 기반 위험 탐지 결과가 제한되어 규칙 기반 신호와 외부 평판만으로 판단해야 합니다.',
    title: 'ML 분석 실패 감지',
  },
  {
    description:
      '탐지 결과를 종합해 최종 위험 점수를 계산하는 단계가 정상적으로 완료되지 않았습니다.',
    englishLabel: 'SCORING FAILED',
    names: ['SCORING_FAILED', 'scoring_failed', 'risk_scoring_failed'],
    risk: '최종 위험도 산정이 제한되어 실제 위험 수준이 과소 또는 과대 표시될 수 있습니다.',
    title: '위험 점수 산정 실패 감지',
  },
  {
    description: 'URL에서 접속 대상 호스트명을 확인하지 못했거나 DNS 해석에 실패한 신호입니다.',
    englishLabel: 'HOSTNAME MISSING',
    names: [
      'hostname_missing',
      'missing_hostname',
      'host_missing',
      'dns_resolution_failed',
      '[Errno -2] Name or service not known',
      'name_or_service_not_known',
    ],
    risk: '정상적인 접속 대상이 불명확해 분석이 제한되며, 잘못 구성된 URL 또는 일시적인 악성 인프라일 수 있습니다.',
    title: '호스트명 확인 실패 감지',
  },
  {
    description: '인증서 정보를 확인하는 요청이 제한 시간 안에 완료되지 않았습니다.',
    englishLabel: 'CERTIFICATE REQUEST TIMEOUT',
    names: ['certificate_request_timeout'],
    risk: 'HTTPS 인증 상태를 충분히 검증하지 못해 서버 신뢰성을 판단하기 어렵고, 불안정하거나 은폐된 서버일 수 있습니다.',
    title: '인증서 요청 시간 초과 감지',
  },
  {
    description:
      '인증서 검증 과정에서 유효하지 않은 응답이 반환되어 HTTPS 신뢰 정보를 정상적으로 해석하지 못했습니다.',
    englishLabel: 'INVALID CERTIFICATE RESPONSE',
    names: ['invalid certificate response', 'invalid_certificate_response'],
    risk: '인증서 체인이나 검증 응답이 비정상적이면 중간자 공격, 잘못된 서버 설정, 위장 서버 가능성을 확인해야 합니다.',
    title: '유효하지 않은 인증서 응답 감지',
  },
  {
    description: 'HTTPS 연결 대상 서버에서 확인 가능한 피어 인증서를 제공하지 않았습니다.',
    englishLabel: 'PEER CERTIFICATE NOT AVAILABLE',
    names: ['peer certificate not available', 'peer_certificate_not_available'],
    risk: '서버 신원을 확인할 수 없어 민감 정보 입력 시 도청, 위장 서버, 피싱 위험을 배제하기 어렵습니다.',
    title: '피어 인증서 미제공 감지',
  },
];

export const unknownThreatTextByTone: Record<ResultTone, RiskDetectionContent> = {
  critical: {
    description:
      '검사 과정에서 안전하다고 보기 어려운 비정상 신호가 발견되었습니다. 정확한 세부 유형은 추가 확인이 필요하지만, 위험 사이트에서 자주 보이는 의심스러운 동작이나 연결 상태가 함께 나타난 경우입니다.',
    englishLabel: 'UNKNOWN CRITICAL RISK SIGNAL',
    risk: '공식 사이트처럼 보여도 로그인, 결제, 개인정보 입력, 파일 설치를 진행하지 않는 것이 안전합니다. 주소를 직접 검색해 공식 경로인지 확인하고, 이미 정보를 입력했다면 비밀번호 변경과 계정 보안 점검이 필요합니다.',
    title: '추가 확인이 필요한 고위험 신호 감지',
  },
  safe: {
    description:
      '위험으로 확정된 항목은 아니지만, 분석 과정에서 참고할 만한 특이점이 발견되었습니다. 정상 사이트에서도 일시적으로 나타날 수 있으므로, 주소와 화면 내용이 평소와 같은지 확인하는 것이 좋습니다.',
    englishLabel: 'UNKNOWN LOW RISK SIGNAL',
    risk: '현재 위험도는 낮더라도 로그인이나 결제 화면처럼 민감한 작업을 할 때는 주소창의 도메인, HTTPS 표시, 공식 앱 또는 공식 웹사이트 여부를 한 번 더 확인하는 것이 안전합니다.',
    title: '추가 확인이 필요한 참고 신호 감지',
  },
  warning: {
    description:
      '검사 과정에서 평소 정상 사이트와 다른 의심 신호가 발견되었습니다. 위험으로 단정할 수는 없지만, 피싱 사이트나 임시 악성 페이지에서 보이는 패턴과 일부 유사한 상태입니다.',
    englishLabel: 'UNKNOWN WARNING RISK SIGNAL',
    risk: '사이트가 익숙해 보여도 바로 정보를 입력하지 말고, 공식 앱이나 검색을 통해 같은 주소가 맞는지 확인하세요. 파일 다운로드, 앱 설치, 인증번호 입력을 요구한다면 특히 주의해야 합니다.',
    title: '추가 확인이 필요한 의심 신호 감지',
  },
};
