import { isSafeExternalUrl } from '../security/isSafeExternalUrl';

export function openExternalLink(url: string): boolean {
  if (!isSafeExternalUrl(url)) {
    return false;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
