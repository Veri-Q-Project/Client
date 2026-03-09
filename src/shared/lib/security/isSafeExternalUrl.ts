const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

export function isSafeExternalUrl(value: string): boolean {
  const candidate = value.trim();

  if (!candidate) {
    return false;
  }

  try {
    const url = new URL(candidate);

    if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
      return false;
    }

    if (url.username || url.password) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
