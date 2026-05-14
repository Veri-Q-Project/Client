# Convention

이 문서는 Veri-Q Client의 기본 코드 작성 규칙입니다. 설명보다 일관성을 우선하고, 기존 구조와 가까운 방식으로 변경합니다.

## Architecture

현재 프로젝트는 FSD-lite 구조를 사용합니다.

```text
src/
  pages/        # 페이지 조합, page-local hooks/lib/ui
  routes/       # TanStack Router 설정
  features/     # 사용자 액션 단위 기능
  shared/       # 공통 API, store, lib, UI, icon, type
  test-code/    # 테스트 보조 스크립트
```

원칙:

- `pages`는 화면 조합과 페이지 전용 로직을 둔다.
- `features`는 업로드, 이력 조회처럼 사용자 액션 중심 기능을 둔다.
- `shared`는 여러 영역에서 재사용하는 API, store, lib, type, UI만 둔다.
- `widgets`는 아직 사용하지 않는다. 여러 페이지에서 재사용되는 조합 UI가 생길 때 추가한다.
- 새 레이어는 필요가 명확할 때만 만든다.

## Exports

- 페이지 컴포넌트는 `default export`를 사용한다.
- 유틸, 상수, 타입, store는 `named export`를 사용한다.
- 익명 `default export`는 사용하지 않는다.

```tsx
export default function ReportPage() {
  return <main />;
}
```

```ts
export const MAX_URL_LENGTH = 2048;
```

## Import Order

ESLint `import/order` 규칙을 따른다.

1. Node/builtin
2. 외부 패키지
3. 내부 alias 경로
4. 상대 경로
5. type import

내부 alias 우선순위:

```text
shared -> features -> widgets -> pages -> routes
```

규칙:

- import 그룹 사이에는 빈 줄을 둔다.
- 같은 그룹 안에는 불필요한 빈 줄을 두지 않는다.
- 타입 전용 import는 `import type`을 사용한다.

## File Naming

| Target            | Rule                  | Example                      |
| ----------------- | --------------------- | ---------------------------- |
| Folder            | `kebab-case`          | `scan-url`, `result-summary` |
| Page/component    | `PascalCase`          | `ReportPage.tsx`             |
| Hook              | `useSomething.ts`     | `useLoadingPage.ts`          |
| Utility/constants | `lowerCamelCase`      | `scanResultRoute.ts`         |
| Test              | source name + `.test` | `scanResultRoute.test.ts`    |

API 함수 접두어:

- GET: `fetch`
- POST: `submit`
- PUT/PATCH: `update`
- DELETE: `remove`

## Page Logic

- 페이지 컴포넌트는 화면 조합에 집중한다.
- 복잡한 데이터 변환은 `lib`의 순수 함수로 분리한다.
- 페이지 전용 hook은 `hooks`에 둔다.
- 여러 페이지에서 쓰는 로직은 `shared/lib` 또는 `shared/store`로 올린다.
- 테스트 가능한 로직은 UI에서 빼서 먼저 테스트할 수 있게 만든다.

## State

- Zustand store는 상태 보관과 액션 노출에 집중한다.
- 상태 전환 계산은 가능한 순수 함수로 분리한다.
- persist 대상은 필요한 최소 필드만 저장한다.

## Security

- 외부 링크와 실행 스킴은 허용 목록 기반으로 처리한다.
- 위험하거나 사용자 행동을 유발하는 스킴은 확인 단계를 둔다.
- `.env.local`, `.env.server.local`은 커밋하지 않는다.
- 새 API/보안 정책 변경은 성공 케이스와 차단 케이스를 모두 테스트한다.

## Tests

- 공통 유틸과 데이터 변환은 단위 테스트를 붙인다.
- 큰 리팩토링 전에는 기존 회귀 테스트를 보강한다.
- CI 기준 검증은 다음 명령이다.

```bash
pnpm format
pnpm lint
pnpm test
pnpm typecheck
pnpm security:check
pnpm build
```

## Accessibility

- `main`, `section`, `article`, `nav`, `header`, `footer` 같은 시맨틱 태그를 우선한다.
- 인터랙티브 요소에는 텍스트 label 또는 `aria-label`을 제공한다.
- 아이콘만 있는 버튼에는 반드시 `aria-label`을 둔다.

## Routing

- 라우트 정의는 `src/routes`에 둔다.
- 페이지 컴포넌트는 `src/pages`에서 import한다.
- 페이지는 route-level `lazy()`로 불러온다.
- 라우트 fallback은 접근 가능한 `role="status"` 영역으로 제공한다.
