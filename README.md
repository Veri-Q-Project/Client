# Veri-Q

의심스러운 QR 코드와 링크를 빠르게 점검하고, 결과에 따라 사용자에게 대응 가이드를 제공하는 퀴싱 방지 웹사이트입니다.

## Overview

Veri-Q는 문자, 메신저, 이메일, 웹페이지에서 전달된 QR 코드 및 URL이 안전한지 확인할 수 있도록 돕는 것을 목표로 합니다.

사용자는 링크를 스캔하거나 입력한 뒤 다음 흐름을 따라가게 됩니다.

- 초기 화면
- 캡챠
- 로딩 화면
- 결과 화면
- 안전
- 주의
- 심각
- 상세 보고서 페이지
- 스캔 이력 목록창

## Goals

- 사용자가 의심 링크를 열기 전에 한 번 더 확인할 수 있는 진입점을 제공합니다.
- 안전, 주의, 심각의 3단계 결과로 위험도를 직관적으로 안내합니다.
- 상세 보고서와 대응 가이드를 통해 후속 행동을 돕습니다.
- 스캔 이력을 관리할 수 있는 구조를 제공합니다.

## Tech Stack

| 분야            | 기술                               |
| --------------- | ---------------------------------- |
| Language        | TypeScript                         |
| Frontend        | React 19                           |
| Framework       | Next.js App Router                 |
| Routing         | TanStack Router                    |
| Package Manager | pnpm                               |
| Styling         | vanilla-extract                    |
| Quality         | ESLint, Prettier, Vitest           |
| CI / Security   | GitHub Actions, CodeQL, Secretlint |

## Project Structure

```text
src/
  app/          # Next.js app entry
  routes/       # TanStack Router route files
  screens/      # page-level screens
  widgets/      # large UI blocks
  features/     # user action features
  entities/     # domain models
  shared/       # shared ui, libs, utils
```

## Getting Started

```bash
pnpm install
pnpm dev
```

기본 개발 서버 주소:

```text
http://localhost:3000
```

포트가 이미 사용 중이면 Next.js가 다른 포트로 실행하며, 실제 주소는 터미널 로그에 표시됩니다.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm routes:generate
pnpm routes:watch
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:write
pnpm test
pnpm security:check
```

## Documents

- [협업 가이드](./CONTRIBUTING.md)
- [코드 컨벤션](./docs/convention.md)

## Status

현재는 초기 세팅 단계로, 라우트 구조와 기본 화면 골격을 우선 구성한 상태입니다. 실제 탐지 로직, 상세 UI, 데이터 연동은 이후 단계에서 확장될 예정입니다.
