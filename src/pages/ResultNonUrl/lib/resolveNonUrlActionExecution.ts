import type { NonUrlActionType } from '../types/resultNonUrlPage.types';

type NonUrlActionExecutionPlan =
  | {
      href: string;
      kind: 'navigate';
      message: string;
    }
  | {
      kind: 'open';
      message: string;
      url: string;
    }
  | {
      kind: 'unsupported';
      message: string;
    };

const httpUrlPattern = /^https?:\/\//iu;
const genericSchemePattern = /^[a-z][a-z0-9+.-]*:/iu;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

function normalizePhoneNumber(targetValue?: string): string {
  if (!targetValue) {
    return '';
  }

  return targetValue.trim().replace(/[\s()-]/g, '');
}

function isValidPhoneNumber(targetValue: string): boolean {
  return /^\+?\d{7,15}$/u.test(targetValue);
}

function normalizeHttpUrl(targetValue?: string): string | null {
  const normalizedTargetValue = targetValue?.trim();

  if (!normalizedTargetValue) {
    return null;
  }

  if (httpUrlPattern.test(normalizedTargetValue)) {
    return normalizedTargetValue;
  }

  if (/^[\w.-]+\.[a-z]{2,}(?:[/?#].*)?$/iu.test(normalizedTargetValue)) {
    return `https://${normalizedTargetValue}`;
  }

  return null;
}

function resolveTelHref(targetValue?: string): string | null {
  const normalizedTargetValue = targetValue?.trim();

  if (!normalizedTargetValue) {
    return null;
  }

  if (/^tel:/iu.test(normalizedTargetValue)) {
    return normalizedTargetValue;
  }

  const normalizedPhoneNumber = normalizePhoneNumber(normalizedTargetValue);

  return isValidPhoneNumber(normalizedPhoneNumber) ? `tel:${normalizedPhoneNumber}` : null;
}

function resolveSmsHref(targetValue?: string): string | null {
  const normalizedTargetValue = targetValue?.trim();

  if (!normalizedTargetValue) {
    return null;
  }

  if (/^(smsto|sms):/iu.test(normalizedTargetValue)) {
    return normalizedTargetValue;
  }

  const normalizedPhoneNumber = normalizePhoneNumber(normalizedTargetValue);

  return isValidPhoneNumber(normalizedPhoneNumber) ? `smsto:${normalizedPhoneNumber}` : null;
}

function resolveMailtoHref(targetValue?: string): string | null {
  const normalizedTargetValue = targetValue?.trim();

  if (!normalizedTargetValue) {
    return null;
  }

  if (/^mailto:/iu.test(normalizedTargetValue)) {
    return normalizedTargetValue;
  }

  return emailPattern.test(normalizedTargetValue) ? `mailto:${normalizedTargetValue}` : null;
}

function resolveSchemeHref(targetValue?: string): string | null {
  const normalizedTargetValue = targetValue?.trim();

  if (!normalizedTargetValue || !genericSchemePattern.test(normalizedTargetValue)) {
    return null;
  }

  return normalizedTargetValue;
}

export function resolveNonUrlActionExecution(
  actionType: NonUrlActionType,
  targetValue?: string,
): NonUrlActionExecutionPlan {
  switch (actionType) {
    case 'WEB': {
      const url = normalizeHttpUrl(targetValue);

      if (!url) {
        return {
          kind: 'unsupported',
          message: '열 수 있는 웹 주소 정보가 없습니다.',
        };
      }

      return {
        kind: 'open',
        message: '웹페이지를 열고 있습니다.',
        url,
      };
    }

    case 'SHORT_URL': {
      const url = normalizeHttpUrl(targetValue);

      if (!url) {
        return {
          kind: 'unsupported',
          message: '열 수 있는 단축 URL 정보가 없습니다.',
        };
      }

      return {
        kind: 'open',
        message: '단축 URL을 열고 있습니다. 최종 이동 주소를 다시 확인하세요.',
        url,
      };
    }

    case 'TEL': {
      const href = resolveTelHref(targetValue);

      if (!href) {
        return {
          kind: 'unsupported',
          message: '전화 앱을 열 수 있는 번호 정보가 없습니다.',
        };
      }

      return {
        href,
        kind: 'navigate',
        message: '전화 앱 실행을 시도합니다.',
      };
    }

    case 'SMS': {
      const href = resolveSmsHref(targetValue);

      if (!href) {
        return {
          kind: 'unsupported',
          message: '문자 앱을 열 수 있는 번호 정보가 없습니다.',
        };
      }

      return {
        href,
        kind: 'navigate',
        message: '문자 앱 실행을 시도합니다.',
      };
    }

    case 'EMAIL': {
      const href = resolveMailtoHref(targetValue);

      if (!href) {
        return {
          kind: 'unsupported',
          message: '메일 앱을 열 수 있는 이메일 정보가 없습니다.',
        };
      }

      return {
        href,
        kind: 'navigate',
        message: '메일 앱 실행을 시도합니다.',
      };
    }

    case 'APP_STORE': {
      const url = normalizeHttpUrl(targetValue);
      const keyword = (targetValue ?? '').trim();

      return {
        kind: 'open',
        message: '앱 마켓 페이지를 열고 있습니다.',
        url:
          url ??
          `https://play.google.com/store/search?c=apps&q=${encodeURIComponent(keyword || 'app')}`,
      };
    }

    case 'DEEP_LINK': {
      const href = resolveSchemeHref(targetValue);

      if (!href) {
        return {
          kind: 'unsupported',
          message: '실행할 수 있는 앱 딥링크 정보가 없습니다.',
        };
      }

      return {
        href,
        kind: 'navigate',
        message: '앱 딥링크 실행을 시도합니다.',
      };
    }

    case 'CRYPTO': {
      const href =
        resolveSchemeHref(targetValue) ??
        ((targetValue ?? '').trim() ? `bitcoin:${targetValue?.trim()}` : null);

      if (!href) {
        return {
          kind: 'unsupported',
          message: '지갑 또는 송금 요청 정보가 없습니다.',
        };
      }

      return {
        href,
        kind: 'navigate',
        message: '지갑 또는 결제 앱 실행을 시도합니다.',
      };
    }

    case 'OTP':
      return {
        kind: 'unsupported',
        message:
          '브라우저에서는 OTP 설정 QR을 직접 실행할 수 없습니다. 인증 앱에서 내용을 확인하세요.',
      };

    case 'WIFI':
      return {
        kind: 'unsupported',
        message:
          '브라우저에서는 Wi-Fi 연결 QR을 직접 실행할 수 없습니다. 기기 설정에서 내용을 확인하세요.',
      };

    case 'CONTACT':
      return {
        kind: 'unsupported',
        message:
          '브라우저에서는 연락처 저장 QR을 직접 실행할 수 없습니다. 내용을 확인한 뒤 수동으로 저장하세요.',
      };

    case 'OTHER':
    default:
      return {
        kind: 'unsupported',
        message: '정확한 실행 방식을 알 수 없어 안전을 위해 자동 실행하지 않습니다.',
      };
  }
}
