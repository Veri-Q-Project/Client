# Veri-Q

의심스러운 QR 코드와 링크를 빠르게 점검하고, 결과에 따라 대응 가이드를 제공하는 퀴싱 방지 웹사이트입니다.

## Tech Stack

| 분야          | 기술                               |
| ------------- | ---------------------------------- |
| Language      | TypeScript                         |
| Frontend      | React 19                           |
| Build Tool    | Vite                               |
| Routing       | TanStack Router                    |
| Styling       | vanilla-extract (theme tokens)     |
| Quality       | ESLint, Prettier, Vitest           |
| CI / Security | GitHub Actions, CodeQL, Secretlint |

## Project Structure

```text
src/
  pages/        # page-level ui
  routes/       # tanstack router setup
  features/     # user action features
  shared/       # shared ui, libs, types, constants
```

## Getting Started

```bash
pnpm install
pnpm dev
```

기본 개발 서버 주소:

```text
http://localhost:5173
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
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
