type ShareCurrentPageOptions = {
  fallbackCopySuccessMessage?: string;
  fallbackNotSupportedMessage?: string;
  text: string;
  title: string;
  url?: string;
};

export async function shareCurrentPage({
  fallbackCopySuccessMessage = '결과 링크를 복사했습니다.',
  fallbackNotSupportedMessage = '현재 환경에서는 공유를 지원하지 않습니다.',
  text,
  title,
  url = window.location.href,
}: ShareCurrentPageOptions): Promise<void> {
  const shareData: ShareData = {
    title,
    text,
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    window.alert(fallbackCopySuccessMessage);
  } catch {
    window.alert(fallbackNotSupportedMessage);
  }
}
