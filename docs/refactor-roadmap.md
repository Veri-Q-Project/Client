# Refactor Roadmap

## Current Baseline

- Branch: `feat/42`
- Test: `pnpm test` passed
- Lint: `pnpm lint` passed
- Format: `pnpm format` passed
- Typecheck: `pnpm typecheck` passed
- Security: `pnpm security:check` passed
- Build: `pnpm build` passed

## Status

All planned refactor items in this roadmap are complete as of 2026-05-14.

## Progress Log

- 2026-05-14: P0 CI 안정성 보강 완료. `typecheck` 스크립트와 CI 단계를 추가했다.
- 2026-05-14: P1 비 URL 실행 보안 1차 보강 완료. 실행 가능한 스킴을 허용 목록으로 제한하고, 실행 전 확인 단계를 추가했다.
- 2026-05-14: P1 응답 정규화 1차 보강 완료. URL, 스키마, 웹 여부, 위험도 판정을 공통 유틸로 분리했다.
- 2026-05-14: P1 URL 해석 1차 보강 완료. 결과/리포트 페이지의 스캔 URL, 원본 URL, 최종 URL 선택 기준을 공통화했다.
- 2026-05-14: P1 상태 관리 1차 보강 완료. `scanSessionStore`의 상태 전환 계산을 순수 함수로 분리하고 회귀 테스트를 추가했다.
- 2026-05-14: P2 로딩/SSE 1차 분리 완료. 결과 라우트 결정, 스캔 식별자 비교, 완료 진행 이벤트 판정을 순수 함수로 분리했다.
- 2026-05-14: P2 로딩 상세 조회 1차 분리 완료. 상세 조회 재시도와 polling 타이머 정책을 테스트 가능한 유틸로 분리했다.
- 2026-05-14: P2 리포트 데이터 1차 분리 완료. 리포트 컨텍스트 추출과 평판 섹션 빌더를 분리하고 회귀 테스트를 추가했다.
- 2026-05-14: P2 리포트 데이터 2차 분리 완료. 도메인 비교와 서버/인증서 정보 빌더를 분리하고 회귀 테스트를 추가했다.
- 2026-05-14: P2 성능 점검 완료. 페이지 단위 lazy loading과 vendor chunk 분리 설정을 확인했다.
- 2026-05-14: P3 문서 정리 완료. README와 로드맵을 현재 구조, 스크립트, 검증 절차 기준으로 최신화했다.

## Completed Items

| Priority | Area          | Result                                                                            |
| -------- | ------------- | --------------------------------------------------------------------------------- |
| P0       | CI 안정성     | `typecheck` 스크립트와 CI typecheck 단계를 추가했다.                              |
| P1       | 보안          | 비 URL 실행 스킴을 허용 목록으로 제한하고 위험 스킴은 확인 단계를 거치게 했다.    |
| P1       | 데이터 정규화 | URL, 위험도, 스키마, 웹 여부 판정을 공통 scan-session 유틸로 모았다.              |
| P1       | 상태 관리     | `scanSessionStore`에서 상태 전환 계산을 순수 함수로 분리했다.                     |
| P2       | 로딩/SSE      | SSE 최종 결과, 상세 조회 retry, polling, 결과 라우팅 판정을 작은 함수로 분리했다. |
| P2       | 성능          | route-level lazy loading과 vendor chunk 분리를 유지한다.                          |
| P2       | 리포트 페이지 | `toReportPageData`를 컨텍스트, 평판, 도메인, 서버 정보 빌더로 분리했다.           |
| P3       | 문서          | README와 로드맵을 최신 구조와 검증 명령 기준으로 정리했다.                        |

## Current Architecture Notes

- `pages`는 화면 조합과 page-local hook/lib/ui를 맡는다.
- `features`는 사용자 액션 중심 API와 타입을 맡는다.
- `shared`는 공통 API, 상태 저장소, scan-session 유틸, 보안 유틸, 공용 UI를 맡는다.
- `routes`는 TanStack Router 설정과 route-level lazy loading을 맡는다.
- `widgets`는 아직 필요하지 않아 만들지 않았다. 여러 페이지에서 재사용되는 조합 UI가 생기면 추가한다.

## Verification

마지막 완료 기준 검증 명령:

```bash
pnpm format
pnpm lint
pnpm test
pnpm typecheck
pnpm security:check
pnpm build
```

## Next Candidates

현재 로드맵 범위는 완료했다. 이후 개선은 다음 별도 이슈로 분리하는 것이 좋다.

- `ReportPage` JSX를 섹션 컴포넌트로 더 세분화
- QR 스캔 카메라 제어 로직 분리
- 실제 운영 번들 기준 시각화 도구 추가
- UI 문구 전체 i18n 또는 copy catalog 도입
