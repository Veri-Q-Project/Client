'use client';

import { useState } from 'react';

import { isSafeExternalUrl } from '@/shared/lib/security/isSafeExternalUrl';

import ScanResultCard from '@/entities/scan-result/ui/ScanResultCard';
type ScanState = 'idle' | 'safe' | 'warning';

function createScanFeedback(url: string): {
  description: string;
  hints: string[];
  state: ScanState;
  title: string;
} {
  if (!url) {
    return {
      state: 'idle',
      title: '아직 링크를 점검하지 않았습니다.',
      description: '현재는 초기 구조 단계라서 URL 형식과 일부 위험 신호만 먼저 확인합니다.',
      hints: [
        '문자, 메신저, 이메일로 받은 주소를 그대로 붙여 넣어 보세요.',
        '비정상 프로토콜이나 계정 정보 포함 URL은 바로 경고 대상으로 처리합니다.',
      ],
    };
  }

  const scriptProtocol = ['java', 'script:'].join('');

  if (!isSafeExternalUrl(url)) {
    return {
      state: 'warning',
      title: '주의가 필요한 링크 형식입니다.',
      description: '입력한 주소가 비정상 프로토콜이거나 구조적으로 위험 신호를 포함하고 있습니다.',
      hints: [
        `${scriptProtocol}, data:, file: 같은 프로토콜은 바로 차단하세요.`,
        '아이디나 비밀번호가 URL에 포함되면 즉시 공유를 멈추세요.',
        '다음 단계에서는 도메인 평판이나 신고 이력을 연결할 수 있습니다.',
      ],
    };
  }

  const hints = [
    '실제 도메인과 보낸 사람 정보를 함께 확인하세요.',
    '로그인이나 결제를 유도하면 한 번 더 검증하세요.',
  ];

  if (url.startsWith('http://')) {
    hints.unshift('보호되지 않은 http 주소입니다. 실제 여부를 더 엄격하게 확인하세요.');
  }

  return {
    state: 'safe',
    title: '기본 점검이 가능한 링크 형식입니다.',
    description:
      '기본 입력 조건은 통과했습니다. 다만 안전이 보장된 것은 아니며, 실제 탐지 로직은 다음 단계에서 붙어야 합니다.',
    hints,
  };
}

export default function UrlScanForm() {
  const [inputValue, setInputValue] = useState('');
  const [submittedUrl, setSubmittedUrl] = useState('');

  const feedback = createScanFeedback(submittedUrl);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedUrl(inputValue.trim());
  }

  return (
    <section className="scan-form panel" id="scan">
      <h2 className="scan-form__title">빠른 링크 점검</h2>
      <p className="scan-form__description">
        사용자가 바로 입력하고 결과를 볼 수 있도록 필요한 최소 흐름만 먼저 구성했습니다.
      </p>

      <form className="scan-form__controls" onSubmit={handleSubmit}>
        <label className="scan-form__label" htmlFor="url-input">
          의심되는 URL 입력
        </label>
        <input
          className="scan-form__input"
          id="url-input"
          name="url"
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="https://example.com"
          type="url"
          value={inputValue}
        />
        <button className="button button--primary" type="submit">
          기본 점검 실행
        </button>
        <span className="scan-form__caption">
          현재는 클라이언트 단계의 URL 형식 점검만 연결되어 있습니다.
        </span>
      </form>

      <ScanResultCard
        description={feedback.description}
        hints={feedback.hints}
        state={feedback.state}
        title={feedback.title}
      />
    </section>
  );
}
