# Veri-Q Client

Veri-Q는 QR 코드 이미지에서 URL 또는 비 URL 스킴을 분석하고, 위험도에 맞는 결과 페이지와 상세 리포트를 제공하는 React 클라이언트입니다.

## Tech Stack

| Area     | Stack                                |
| -------- | ------------------------------------ |
| Language | TypeScript                           |
| Frontend | React 19                             |
| Build    | Vite                                 |
| Routing  | TanStack Router                      |
| State    | Zustand                              |
| Styling  | vanilla-extract                      |
| UI       | Ant Design                           |
| Quality  | ESLint, Prettier, Vitest, TypeScript |
| Security | Secretlint, pnpm audit, CodeQL       |

## Architecture

현재 구조는 FSD를 가볍게 적용한 FSD-lite 방식입니다.

```text
src/
  pages/        # 페이지 조합, page-local hooks/lib/ui
  routes/       # TanStack Router 설정과 route-level lazy loading
  features/     # 사용자 액션 중심 기능 API와 타입
  shared/       # 공통 API, store, lib, UI, icon, type
  test-code/    # 테스트용 QR PNG 생성 스크립트
```

주요 정리 내용:

- `shared/lib/scan-session`: URL/스키마/위험도/결과 라우트/스캔 식별자 공통화
- `shared/store`: 스캔 세션 상태 전환을 순수 함수로 분리
- `pages/Loading/lib`: SSE 완료 판정, 상세 조회 retry, polling 정책 분리
- `pages/Report/lib`: 리포트 컨텍스트, 평판, 도메인, 서버 정보 섹션 빌더 분리
- `routes/router.tsx`: 페이지 단위 `lazy()`와 `Suspense` 적용
- `vite.config.ts`: `react`, `antd`, `router`, `state` vendor chunk 분리

## Setup

```bash
pnpm install
```

설치 중 `postinstall` 스크립트가 실행되며 예시 파일을 기준으로 `.env.local`과 `.env.server.local`을 생성합니다.

필요한 환경 파일:

- `.env.local`: 브라우저에서 사용하는 Vite 환경 변수
- `.env.server.local`: 로컬 captcha verify 서버의 서버 전용 secret

예시 파일:

- [.env.example](./.env.example)
- [.env.server.example](./.env.server.example)

## Development

```bash
pnpm dev
```

기본 주소:

```text
http://localhost:5173
```

로컬 개발 서버는 Vite 앱과 captcha verify 서버를 함께 실행합니다.

프론트만 실행하려면:

```bash
pnpm dev:web
```

## Backend Proxy

로컬 Vite proxy와 Vercel rewrite는 다음 경로를 사용합니다.

| Path     | Target        |
| -------- | ------------- |
| `/be1/*` | BE1 API       |
| `/be3/*` | BE3 API / SSE |

주요 환경 변수:

| Variable                 | Description                              |
| ------------------------ | ---------------------------------------- |
| `VITE_BE1_BASE_URL`      | 브라우저 기준 BE1 base URL 또는 `/be1`   |
| `VITE_BE3_BASE_URL`      | 브라우저 기준 BE3 base URL 또는 `/be3`   |
| `BE1_PROXY_TARGET_URL`   | Vercel Function에서 사용할 BE1 실제 대상 |
| `BE3_PROXY_TARGET_URL`   | Vercel Function에서 사용할 BE3 실제 대상 |
| `VITE_API_TIMEOUT_MS`    | 일반 API timeout                         |
| `VITE_UPLOAD_TIMEOUT_MS` | QR 이미지 업로드 timeout                 |
| `VITE_SSE_RECONNECT_MAX` | SSE 최대 재연결 횟수                     |

## Scripts

```bash
pnpm dev
pnpm dev:web
pnpm build
pnpm preview
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:write
pnpm test
pnpm typecheck
pnpm security:check
```

CI 기준으로 로컬에서 확인할 때는 아래 명령을 모두 통과시키면 됩니다.

```bash
pnpm format
pnpm lint
pnpm test
pnpm typecheck
pnpm security:check
pnpm build
```

## Test QR Code

테스트 URL을 QR PNG로 만들 수 있습니다.

```bash
pnpm test-code https://naver.com
```

`//`가 빠진 입력도 보정합니다.

```bash
pnpm test-code: https:naver.com
```

생성 위치:

```text
src/test-code/generated-qr/
```

PowerShell에서 쿼리스트링에 `&`가 있는 URL은 따옴표로 감싸세요.

```bash
pnpm test-code "https://example.com/?a=1&b=2"
```

## Commit Safety

- `.env.local`과 `.env.server.local`은 커밋하지 않습니다.
- pre-commit hook에서 secretlint, eslint, prettier가 staged file 기준으로 실행됩니다.
- 보안 확인은 `pnpm security:check`로 수행합니다.

## Documents

- [작업 컨벤션](./docs/convention.md)
- [리팩토링 로드맵](./docs/refactor-roadmap.md)
