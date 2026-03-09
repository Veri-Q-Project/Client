import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import './app.css.ts';

export const metadata: Metadata = {
  title: 'Quishing Guard',
  description:
    '의심스러운 링크를 빠르게 점검하고 기본 대응 흐름을 안내하는 퀴싱 예방 웹사이트입니다.',
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
