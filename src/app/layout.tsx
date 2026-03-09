import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import './app.css.ts';

export const metadata: Metadata = {
  title: 'Veri-Q',
  description:
    '의심스러운 QR 코드와 링크를 빠르게 점검하고 기본 대응 흐름을 안내하는 퀴싱 방지 웹사이트입니다.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <div id="app">{children}</div>
      </body>
    </html>
  );
}
