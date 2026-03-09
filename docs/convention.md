# Convention

> 이 문서는 프로젝트의 기본 코드 컨벤션을 정리한 문서입니다. 설명보다 규칙과 예시를 우선합니다.

## 기본 원칙

- 일관성을 우선합니다.
- 한 파일은 한 가지 책임을 갖도록 작성합니다.
- 페이지는 조합에 집중하고, 비즈니스 로직은 `features` 또는 `entities`에 둡니다.
- 초기 단계에서는 가벼운 FSD 구조를 사용하고, 필요 없는 레이어는 억지로 만들지 않습니다.

## 폴더 구조

```text
src/
  app/          # 앱 진입점, 전역 설정, provider
  pages/        # 일반 규칙상 페이지 단위 화면
  screens/      # 이 프로젝트에서 사용하는 페이지 단위 화면
  widgets/      # 페이지를 구성하는 큰 UI 블록
  features/     # 사용자 액션 단위 기능
  entities/     # 핵심 도메인 모델
  shared/       # 공통 UI, 유틸, 타입, 상수, API
```

슬라이스 예시:

```text
features/
  scan-url/
    api/
    model/
    ui/
    lib/
    index.ts
```

## 컴포넌트 선언 및 내보내기

| 구분                  | export 방식 | 함수 선언 형태             | 예시                                  |
| --------------------- | ----------- | -------------------------- | ------------------------------------- |
| 주요 컴포넌트         | `default`   | 일반 함수 선언             | `export default function Header() {}` |
| 유틸 / 훅 / 상수      | `named`     | 화살표 함수 또는 일반 함수 | `export const formatDate = ...`       |
| 여러 기능 재노출 파일 | `named`     | 혼합 가능                  | `export { Header, Footer }`           |

규칙:

- 컴포넌트 파일은 파일명과 함수명을 일치시킵니다.
- 익명 `default export`는 사용하지 않습니다.
- 공용 유틸, 훅, 상수는 `named export`를 사용합니다.

짧은 예시:

```tsx
export default function UrlScanForm() {
  return <form />;
}
```

```ts
export const MAX_URL_LENGTH = 2048;
```

## import 순서

1. 프레임워크/런타임 모듈
2. 외부 패키지
3. 프로젝트 내부 절대 경로
4. 현재 디렉터리 기준 상대 경로

프로젝트 내부 절대 경로는 가능하면 아래 순서를 따릅니다.

`shared -> entities -> features -> widgets -> pages/screens -> app -> local`

추가 규칙:

- 각 그룹 사이에는 한 줄 공백을 둡니다.
- 같은 소스 기준에서는 기본 import를 먼저, named import를 나중에 둡니다.
- 타입 전용 import는 `import type`으로 분리합니다.

짧은 예시:

```tsx
import React from 'react';
import type { ReactNode } from 'react';

import DOMPurify from 'dompurify';
import { Button } from 'antd';

import { ErrorState } from '@/shared/ui/error-state/ErrorState';
import { ScanResultCard } from '@/entities/scan-result';
import { useUrlScan } from '@/features/scan-url';

import './UrlScanForm.css';
```

향후 `ESLint`와 `Prettier`로 import 정렬을 자동화합니다.

## 파일명 및 함수명 컨벤션

기본적인 파일명 규칙은 다음과 같습니다.

| 구분                  | 규칙                  | 예시                            |
| --------------------- | --------------------- | ------------------------------- |
| 폴더명                | `kebab-case`          | `scan-url`, `result-summary`    |
| 컴포넌트 파일         | `PascalCase`          | `Header.tsx`, `UrlScanForm.tsx` |
| util 함수 / 상수 파일 | `lowerCamelCase`      | `formatDate.ts`, `constants.ts` |
| 라우트 세그먼트       | `kebab-case`          | `scan-result/page.tsx`          |
| 테스트 파일           | 대상 파일명 + `.test` | `formatDate.test.ts`            |

REST API 관련 파일명과 함수명은 아래 접두사를 사용합니다.

| HTTP Method | 접두사   | 파일명 예시           | 함수명 예시        |
| ----------- | -------- | --------------------- | ------------------ |
| GET         | `fetch`  | `fetchPostDetail.ts`  | `fetchPostDetail`  |
| POST        | `submit` | `submitPost.ts`       | `submitPost`       |
| DELETE      | `remove` | `removePost.ts`       | `removePost`       |
| PUT / PATCH | `update` | `updatePostDetail.ts` | `updatePostDetail` |

커스텀 훅은 위 접두사 앞에 `use`를 붙입니다.

짧은 예시:

```ts
export async function fetchPostDetail() {}
export async function submitPost() {}
export async function removePost() {}
export async function updatePostDetail() {}

export function useFetchPostDetail() {}
export function useSubmitPost() {}
```

## 슬라이스 공개 범위

- 각 슬라이스의 외부 공개 진입점은 `index.ts`로 관리합니다.
- 다른 슬라이스에서 내부 경로를 직접 import하지 않습니다.
- 가능한 한 슬라이스 루트만 import하도록 유지합니다.

짧은 예시:

```ts
import { useUrlScan } from '@/features/scan-url';
```

```ts
// 지양
import { useUrlScan } from '@/features/scan-url/model/useUrlScan';
```

## 컴포넌트 작성 규칙

- 페이지 컴포넌트는 화면 조합과 데이터 연결에 집중합니다.
- `shared/ui`에는 도메인 의존성이 없는 공용 UI만 둡니다.
- 재사용되지 않는 컴포넌트는 해당 슬라이스 내부에 둡니다.
- `utils.ts`, `helpers.ts`, `common.ts`처럼 의미가 약한 파일명은 지양합니다.
- 하나의 컴포넌트 파일에 여러 개의 큰 컴포넌트를 넣지 않습니다.

짧은 예시:

- `screens/scan` : URL 검사 페이지 조합
- `features/scan-url` : URL 제출과 검사 요청
- `entities/scan-result` : 결과 데이터 모델과 표시 UI
- `shared/ui/Button` : 공통 버튼

## 시맨틱 태그와 접근성

- `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` 같은 시맨틱 태그를 우선 사용합니다.
- 모든 인터랙티브 요소에는 텍스트, `label`, `aria-label` 중 하나가 필요합니다.
- 아이콘만 있는 버튼은 반드시 `aria-label`을 추가합니다.

짧은 예시:

```tsx
<header>
  <button aria-label="검사 결과 복사">복사</button>
</header>
```

## 상태 UI 공용화

- `Loading`, `ErrorState`, `EmptyState` UI는 가능한 공용 컴포넌트로 관리합니다.
- 반복되는 상태 UI는 `shared/ui` 또는 관련 엔티티 내부에서 재사용합니다.

짧은 예시:

```text
shared/ui/loading/Loading.tsx
shared/ui/error-state/ErrorState.tsx
shared/ui/empty-state/EmptyState.tsx
```

## Router Note

- TanStack Router 파일은 `src/routes`에 둡니다.
- `src/routes` 파일은 라우트 연결만 담당하고, 실제 화면 컴포넌트는 별도 슬라이스에서 import 합니다.
- 이 프로젝트는 `Next.js App Router`를 함께 사용하므로, 예약 디렉터리 충돌을 피하기 위해 페이지 단위 화면 슬라이스를 `src/pages` 대신 `src/screens`에 둡니다.
- import 순서에서는 `pages`와 같은 위치로 보고 `widgets -> screens -> app -> local` 순서를 따릅니다.
- `src/screens`도 기존 규칙을 그대로 따릅니다.
  - 폴더명: `kebab-case`
  - 컴포넌트 파일명: `PascalCase`
  - 슬라이스 진입점: `index.ts`
