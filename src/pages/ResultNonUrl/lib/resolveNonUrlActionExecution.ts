import type { NonUrlActionType } from '../types/resultNonUrlPage.types';

export type NonUrlActionExecutionPlan =
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

function normalizePhoneNumber(targetValue?: string): string {
  if (!targetValue) {
    return '';
  }

  return targetValue.trim().replace(/[\s()-]/g, '');
}

function isValidPhoneNumber(targetValue: string): boolean {
  return /^\+?\d{7,15}$/u.test(targetValue);
}

export function resolveNonUrlActionExecution(
  actionType: NonUrlActionType,
  targetValue?: string,
): NonUrlActionExecutionPlan {
  switch (actionType) {
    case 'telSms': {
      const normalizedPhoneNumber = normalizePhoneNumber(targetValue);

      if (!isValidPhoneNumber(normalizedPhoneNumber)) {
        return {
          kind: 'unsupported',
          message: '전화 또는 문자 실행을 위한 번호 정보가 없습니다.',
        };
      }

      return {
        href: `tel:${normalizedPhoneNumber}`,
        kind: 'navigate',
        message: '전화 앱 실행을 시도합니다.',
      };
    }

    case 'appStore': {
      const keyword = (targetValue ?? '').trim();

      return {
        kind: 'open',
        message: '앱 스토어 검색 페이지를 엽니다.',
        url: `https://play.google.com/store/search?c=apps&q=${encodeURIComponent(keyword || 'app')}`,
      };
    }

    case 'bitcoin': {
      const walletAddress = (targetValue ?? '').trim();

      if (!walletAddress) {
        return {
          kind: 'unsupported',
          message: '비트코인 지갑 주소 정보가 없습니다.',
        };
      }

      return {
        href: `bitcoin:${walletAddress}`,
        kind: 'navigate',
        message: '비트코인 지갑 실행을 시도합니다.',
      };
    }

    case 'wifi':
      return {
        kind: 'unsupported',
        message: '브라우저에서는 Wi-Fi 연결 QR을 직접 실행할 수 없습니다.',
      };

    case 'appLaunch':
      return {
        kind: 'unsupported',
        message: '앱 실행을 위한 정확한 스킴 정보가 없어 브라우저에서 바로 실행할 수 없습니다.',
      };

    case 'unknown':
    default:
      return {
        kind: 'unsupported',
        message: '정확한 실행 방식을 알 수 없어 안전상 직접 실행을 막았습니다.',
      };
  }
}
