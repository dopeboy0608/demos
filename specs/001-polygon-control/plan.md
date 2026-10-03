# Implementation Plan: 폴리곤 제어 데모 화면 이식

**Branch**: `feature/1-polygon-control` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-polygon-control/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

지도 2개 위에서 폴리곤을 그리고, 선택하고, 합치기(union/intersection/xor/difference)·분할하는
데모 화면을 `src/features/polygon/` 도메인에 새로 구현한다. 카카오맵 SDK로 지도/드로잉을,
polygon-clipping/polygon-splitter 계열 라이브러리로 폴리곤 연산을 처리하고, 연산 로직은 지도
렌더링과 분리된 순수 함수(helper)로 둬 TDD 대상으로 삼는다. 상태는 세션 메모리(Zustand)에만
유지하고 영속화하지 않는다(spec.md Assumptions).

## Technical Context

**Language/Version**: TypeScript 7.0.2 (React 19)

**Primary Dependencies**: React 19, rsbuild, TanStack Router(화면 라우트 등록), Zustand(폴리곤/선택
상태), antd + Tailwind CSS(버튼·레이아웃), `react-kakao-maps-sdk`(지도/드로잉, 신규 도입 — 아래
Constitution Check 참고), 폴리곤 불리언 연산/분할 라이브러리(신규 도입 — 아래 Constitution Check
참고)

**Storage**: N/A — 폴리곤 데이터는 세션 내 메모리(Zustand 스토어)에만 유지, 새로고침 시 초기화됨
(spec.md Assumptions)

**Testing**: vitest + @testing-library/react + msw. ARCHITECTURE.md "TDD 적용 기준"에 따라 폴리곤
연산(union/intersection/xor/difference/split)을 감싸는 순수 함수는 TDD 대상이고, 지도 렌더링·클릭
드로잉 등 카카오맵 SDK에 의존하는 인터랙션은 TDD 비대상 — `docs/spec/`(SDD) 문서화 후 수동/통합
테스트로 검증한다. 카카오맵 SDK 자체는 ARCHITECTURE.md "외부 SDK 모킹 전략"에 따라 실제 로딩 없이
모킹한다.

**Target Platform**: 웹 브라우저 (SPA, GitHub Pages 배포)

**Project Type**: web (frontend-only, 백엔드 없음 — CLAUDE.md 범위)

**Performance Goals**: 일반적인 SPA 수준(그리기 클릭 반응 100ms 이내 체감) — 별도 고성능 요구사항 없음

**Constraints**: 백엔드/DB 연동 없음, API 키는 환경변수로만 관리(`PUBLIC_KAKAO_MAP_API_KEY`)

**Scale/Scope**: 데모 화면 1개(지도 패널 2개), 동시 사용자/대규모 데이터 처리 비대상

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

이 레포의 `.specify/memory/constitution.md`는 아직 템플릿 상태(미작성)라, `CLAUDE.md`/
`docs/ARCHITECTURE.md`를 실질적인 거버넌스 기준으로 사용한다. 이번 기능에 해당하는 게이트:

- **신규 라이브러리 도입 전 사전 제안 + 동의** (CLAUDE.md "기술 스택", "금지 사항" 인접 원칙): 지도
  SDK(`react-kakao-maps-sdk`)와 폴리곤 연산/분할 라이브러리는 현재 `package.json`에 없는 신규
  의존성이다 → **PASS, 조건부**: Phase 0 research.md에서 후보를 제시하고, `/speckit-tasks` 진행 전
  사용자에게 최종 승인을 받는다(아래 Phase 0 결과 보고 시 확인 요청).
- **API 키 하드코딩 금지** (CLAUDE.md "금지 사항"): 카카오맵 키는 `PUBLIC_KAKAO_MAP_API_KEY`
  환경변수로 이미 설정됨 → **PASS**.
- **범위 밖 기능 임의 구현 금지** (백엔드/DB, 로그인, 결제): 이 기능은 폴리곤 데이터를 영속화하지
  않고 프론트엔드 상태로만 다룬다 → **PASS**.
- **TDD 적용 기준** (ARCHITECTURE.md): 순수 연산 함수와 컴포넌트/SDK 의존 코드를 분리해 전자만
  TDD 대상으로 삼는다 → **PASS** (Technical Context "Testing" 참고).

## Project Structure

### Documentation (this feature)

```text
specs/001-polygon-control/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

contracts/ 디렉터리는 생략한다 — 이 기능은 외부에 노출하는 API/CLI/라이브러리 인터페이스가 없는
순수 프론트엔드 화면이라 "외부 인터페이스 계약" 자체가 존재하지 않는다.

### Source Code (repository root)

```text
src/
├── features/
│   └── polygon/
│       ├── api/              # 현재 범위에서는 비어 있음 (백엔드 없음 — CLAUDE.md 범위)
│       ├── components/
│       │   ├── PolygonMapPanel.tsx     # 지도 1개 + 그리기/선택 UI를 감싸는 패널 (2개 렌더링)
│       │   ├── PolygonToolbar.tsx      # 그리기/합치기 4종/분할/삭제 버튼
│       │   └── PolygonMapGuard.tsx     # 카카오맵 키 미설정 시 안내 메시지 (FR-011)
│       ├── hooks/
│       │   └── usePolygonMapPanel.ts   # 패널 단위 그리기/선택 상태 ↔ store 연결
│       ├── queries/           # 현재 범위에서는 비어 있음 (서버 데이터 없음)
│       └── helper/
│           ├── polygonOperations.ts    # union/intersection/xor/difference 순수 함수 (TDD 대상)
│           └── polygonSplit.ts         # 분할 순수 함수 (TDD 대상)
├── pages/
│   └── PolygonControlPage.tsx          # 두 PolygonMapPanel을 배치하는 페이지
├── routes/
│   └── polygon.tsx                     # TanStack Router 라우트 등록
└── store/ 대신 features/polygon 내부에 Zustand 스토어 배치 (예: features/polygon/usePolygonStore.ts)

src/test/
└── (helper 함수용 vitest 단위 테스트는 각 helper 파일 옆 *.test.ts로 배치)
```

**Structure Decision**: CLAUDE.md "디렉터리 구조" 컨벤션(`features/<domain>/{api,components,hooks,
queries,helper}`)을 그대로 따르는 단일 프론트엔드 프로젝트 구조다. 지도/그리기 UI는
`components`+`hooks`에, 연산 로직은 부수효과 없는 `helper`에 분리해 TDD 대상과 비대상을
디렉터리 수준에서도 구분한다.

## Complexity Tracking

> Constitution Check에 정당화가 필요한 위반 사항이 없어 이 섹션은 비워둔다.
