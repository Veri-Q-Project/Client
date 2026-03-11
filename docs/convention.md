# Convention

> 이 문서는 프로젝트의 기본 코드 컨벤션을 정리한 문서입니다. 설명보다 규칙과 예시를 우선합니다.

## 기본 원칙

- 일관성을 우선합니다.
- 한 파일은 한 가지 책임만 갖도록 작성합니다.
- 페이지는 조합에 집중하고, 사용자 액션 로직은 `features`에 둡니다.
- 불필요한 레이어를 만들지 않습니다. 필요할 때만 추가합니다.

## 폴더 구조

```text
src/
  pages/        # 페이지 UI 컴포넌트
  routes/       # TanStack Router 설정 및 라우트 연결
  features/     # 사용자 액션 단위 기능
  shared/       # 공통 UI, 유틸, 타입, 상수, API
  widgets/      # (선택) 여러 요소를 조합한 큰 UI 블록
```

## 컴포넌트 선언 및 export

- 페이지/컴포넌트 파일은 `default export`를 사용합니다.
- 유틸/훅/상수는 `named export`를 사용합니다.
- 익명 `default export`는 사용하지 않습니다.

짧은 예시:

```tsx
export default function HomePage() {
  return <main />;
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

프로젝트 내부 절대 경로 순서:

`shared -> features -> widgets -> pages -> routes -> local`

추가 규칙:

- 그룹 사이에는 한 줄 공백을 둡니다.
- 타입 전용 import는 `import type`으로 분리합니다.

## 파일명 규칙

| 구분                  | 규칙                  | 예시                              |
| --------------------- | --------------------- | --------------------------------- |
| 폴더명                | `kebab-case`          | `scan-url`, `result-summary`      |
| 컴포넌트 파일         | `PascalCase`          | `HomePage.tsx`, `UrlScanForm.tsx` |
| util 함수 / 상수 파일 | `lowerCamelCase`      | `formatDate.ts`, `constants.ts`   |
| 테스트 파일           | 대상 파일명 + `.test` | `isSafeExternalUrl.test.ts`       |

REST API 관련 파일명/함수명 접두사:

- GET: `fetch`
- POST: `submit`
- DELETE: `remove`
- PUT/PATCH: `update`

## 슬라이스 공개 범위

- 슬라이스 외부 공개 진입점은 가능하면 `index.ts`로 관리합니다.
- 다른 슬라이스의 내부 경로 직접 import는 지양합니다.

## 컴포넌트 작성 규칙

- 페이지 컴포넌트는 화면 조합과 데이터 연결에 집중합니다.
- `shared/ui`에는 도메인 의존성이 없는 공용 UI만 둡니다.
- 재사용되지 않는 컴포넌트는 해당 기능/페이지 근처에 둡니다.
- `utils.ts`, `helpers.ts`, `common.ts`처럼 의미가 약한 파일명은 지양합니다.

## 접근성

- `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` 같은 시맨틱 태그를 우선 사용합니다.
- 인터랙티브 요소에는 텍스트, `label`, `aria-label` 중 하나가 필요합니다.
- 아이콘만 있는 버튼은 반드시 `aria-label`을 추가합니다.

## Router Note

- 라우트 정의는 `src/routes`에 둡니다.
- 화면 컴포넌트는 `src/pages`에서 import 합니다.
- 파일 기반 자동 생성 대신 명시적인 라우트 트리 구성을 기본으로 사용합니다.
