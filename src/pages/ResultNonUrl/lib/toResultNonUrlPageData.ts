import { pickSourceString } from '@/shared/api/responseAccess/payloadAccess';
import {
  isHttpUrl,
  normalizeScanSchemeTypeAlias,
} from '@/shared/lib/scan-session/scanClassification';
import type { ScanSessionSnapshot } from '@/shared/store/scanSessionStore';

import { resolveNonUrlSectionCopy } from '../constants/nonUrlActionText';

import type { NonUrlActionType, ResultNonUrlPageData } from '../types/resultNonUrlPage.types';

const schemeTypeAliasToActionType: Record<string, NonUrlActionType> = {
  APP: 'DEEP_LINK',
  APP_LAUNCH: 'DEEP_LINK',
  APP_STORE: 'APP_STORE',
  APPSTORE: 'APP_STORE',
  BITCOIN: 'CRYPTO',
  BIT_LY: 'SHORT_URL',
  BITLY: 'SHORT_URL',
  BTC: 'CRYPTO',
  CALL: 'TEL',
  CONTACT: 'CONTACT',
  CRYPTO: 'CRYPTO',
  DEEP_LINK: 'DEEP_LINK',
  DEEPLINK: 'DEEP_LINK',
  EMAIL: 'EMAIL',
  INTENT: 'DEEP_LINK',
  MAIL: 'EMAIL',
  MAILTO: 'EMAIL',
  MARKET: 'APP_STORE',
  MECARD: 'CONTACT',
  MFA: 'OTP',
  NON_WEB: 'OTHER',
  OTP: 'OTP',
  OTPAUTH: 'OTP',
  OTHER: 'OTHER',
  PHONE: 'TEL',
  PLAY_STORE: 'APP_STORE',
  PLAYSTORE: 'APP_STORE',
  SHORT_LINK: 'SHORT_URL',
  SHORT_URL: 'SHORT_URL',
  SHORTURL: 'SHORT_URL',
  SMS: 'SMS',
  SMSTO: 'SMS',
  STORE: 'APP_STORE',
  TEL: 'TEL',
  TEXT: 'OTHER',
  UNKNOWN: 'OTHER',
  VCARD: 'CONTACT',
  WEB: 'WEB',
  WIFI: 'WIFI',
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
  'email',
  'emailAddress',
  'email_address',
  'typeInfo',
  'type_info',
  'url',
];

const appStoreUrlPattern =
  /^https?:\/\/(?:play\.google\.com\/store|apps\.apple\.com\/|itunes\.apple\.com\/)/iu;
const shortUrlPattern =
  /^https?:\/\/(?:bit\.ly|t\.co|tinyurl\.com|goo\.gl|rebrand\.ly|cutt\.ly|ow\.ly|buff\.ly|tiny\.one|is\.gd|soo\.gd)\b/iu;
const cryptoSchemePattern =
  /^(bitcoin|ethereum|eth|solana|sol|tron|trx|litecoin|ltc|dogecoin|doge|xrp|walletconnect):/iu;
const genericSchemePattern = /^([a-z][a-z0-9+.-]*):/iu;

function canonicalizeSchemeType(rawActionType: string): string {
  return rawActionType
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function resolveActionTypeFromScheme(rawActionType: string | null): NonUrlActionType | null {
  const normalizedActionType = normalizeScanSchemeTypeAlias(rawActionType);

  if (!normalizedActionType) {
    return null;
  }

  return schemeTypeAliasToActionType[canonicalizeSchemeType(normalizedActionType)] ?? null;
}

function inferActionTypeFromTargetValue(targetValue: string | null): NonUrlActionType | null {
  const normalizedTargetValue = targetValue?.trim();

  if (!normalizedTargetValue) {
    return null;
  }

  if (appStoreUrlPattern.test(normalizedTargetValue)) {
    return 'APP_STORE';
  }

  if (shortUrlPattern.test(normalizedTargetValue)) {
    return 'SHORT_URL';
  }

  if (isHttpUrl(normalizedTargetValue)) {
    return 'WEB';
  }

  if (/^otpauth:/iu.test(normalizedTargetValue)) {
    return 'OTP';
  }

  if (cryptoSchemePattern.test(normalizedTargetValue)) {
    return 'CRYPTO';
  }

  if (/^(smsto|sms):/iu.test(normalizedTargetValue)) {
    return 'SMS';
  }

  if (/^wifi:/iu.test(normalizedTargetValue)) {
    return 'WIFI';
  }

  if (/^(begin:vcard|mecard:)/iu.test(normalizedTargetValue)) {
    return 'CONTACT';
  }

  if (/^tel:/iu.test(normalizedTargetValue)) {
    return 'TEL';
  }

  if (/^mailto:/iu.test(normalizedTargetValue)) {
    return 'EMAIL';
  }

  if (/^intent:/iu.test(normalizedTargetValue)) {
    return 'DEEP_LINK';
  }

  const schemeMatch = normalizedTargetValue.match(genericSchemePattern);

  if (schemeMatch && !['http', 'https'].includes(schemeMatch[1].toLowerCase())) {
    return 'DEEP_LINK';
  }

  return null;
}

function resolveNonUrlActionType(
  rawActionType: string | null,
  targetValue: string | null,
): NonUrlActionType {
  return (
    resolveActionTypeFromScheme(rawActionType) ??
    inferActionTypeFromTargetValue(targetValue) ??
    'OTHER'
  );
}

export function toResultNonUrlPageData(session: ScanSessionSnapshot): ResultNonUrlPageData {
  const sources = [
    session.analysisDetail,
    session.finalResult,
    session.scanResponse,
    session.historySelection,
  ];
  const targetValue = pickSourceString(sources, targetValueKeys) ?? session.decodedUrl;
  const rawActionType =
    pickSourceString(sources, ['actionType', 'action_type', 'schemeType', 'scheme_type']) ??
    session.schemeType;
  const actionType = resolveNonUrlActionType(rawActionType, targetValue);
  const copy = resolveNonUrlSectionCopy(actionType);

  return {
    detectedActionType: actionType,
    sectionDescription: copy.sectionDescription,
    sectionNumber: '1',
    sectionTitle: copy.sectionTitle,
    targetValue: targetValue ?? undefined,
  };
}
