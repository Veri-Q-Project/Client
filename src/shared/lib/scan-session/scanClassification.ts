type ScanTargetLike = {
  isUrl?: boolean | null;
  schemeType?: string | null;
  url?: string | null;
};

const webSchemeTypeAliases = new Set(['URL', 'WEB']);

export function normalizeScanSchemeTypeAlias(schemeType: string | null | undefined): string | null {
  if (!schemeType) {
    return null;
  }

  const normalizedSchemeType = schemeType.trim().toUpperCase();

  if (normalizedSchemeType.length === 0) {
    return null;
  }

  return webSchemeTypeAliases.has(normalizedSchemeType) ? 'WEB' : normalizedSchemeType;
}

export function isHttpUrl(url: unknown): boolean {
  return typeof url === 'string' && /^https?:\/\//iu.test(url.trim());
}

export function isWebScanTarget({ isUrl, schemeType, url }: ScanTargetLike): boolean {
  const normalizedSchemeType = normalizeScanSchemeTypeAlias(schemeType);

  if (normalizedSchemeType) {
    return normalizedSchemeType === 'WEB';
  }

  if (isHttpUrl(url)) {
    return true;
  }

  if (typeof isUrl === 'boolean') {
    return isUrl;
  }

  return false;
}
