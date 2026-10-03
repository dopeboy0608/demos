---
description: 'Task list template for feature implementation'
---

# Tasks: 폴리곤 제어 데모 화면 이식

**Input**: Design documents from `specs/001-polygon-control/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: 폴리곤 연산(union/intersection/xor/difference)과 분할(split) 순수 함수는
ARCHITECTURE.md "TDD 적용 기준"에 따라 TDD 대상이라 테스트 태스크를 포함한다. 지도
렌더링/드로잉 인터랙션(SDK 의존)은 비대상이라 테스트 태스크 없이 quickstart.md 수동 검증으로
대체한다.

**Organization**: Tasks are grouped by user story (spec.md 우선순위 P1 > P2 > P2 > P3) to enable
independent implementation and testing of each story.

## Path Conventions

CLAUDE.md "디렉터리 구조" 컨벤션을 따르는 단일 프론트엔드 프로젝트: `src/features/polygon/`
(도메인 전용), `src/pages/`, `src/routes/` (공용).

---

## Phase 1: Setup

**Purpose**: 기능 작업을 위한 디렉터리/타입 기반 준비

- [x] T001 `src/features/polygon/{api,components,hooks,queries,helper}` 디렉터리 생성
      (`api`, `queries`는 이번 범위에서 비어 있음 — 백엔드 없음, CLAUDE.md 범위)
- [x] T002 [P] `src/env.d.ts`에 `/// <reference types="kakao.maps.d.ts" />` 추가해 전역
      `kakao.maps` 타입 사용 가능하게 설정

**Checkpoint**: 디렉터리/타입 준비 완료, Foundational 단계 진행 가능

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 User Story가 공유하는 타입/상태/라우팅/가드 — 완료 전까지 어떤 User Story도
시작할 수 없음

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 `src/features/polygon/helper/types.ts`에 data-model.md의 `Polygon`
      (`id: string`, `panelId: 'left' | 'right'`, `path: { lat: number; lng: number }[]`
      — 최소 길이 3, `selected: boolean`, `source: 'drawn' | 'union' | 'intersection' |
    'xor' | 'difference' | 'split'`)와 `MapPanel`(`id: 'left' | 'right'`,
      `drawingMode: boolean`, `polygons: Polygon[]`, `selectedIds: string[]`) 타입 정의
- [x] T004 `src/features/polygon/usePolygonStore.ts`에 Zustand 스토어 구현: `left`/`right`
      두 `MapPanel` 상태를 가지며 `setDrawingMode(panelId, boolean)`,
      `addPolygon(panelId, path)`(`path.length < 3`이면 생성하지 않음 — data-model.md
      검증 규칙), `toggleSelect(panelId, polygonId)`, `removePolygons(panelId,
    polygonIds)`, `replaceWithResult(panelId, removedIds, newPolygon)` 액션 포함
      (depends on T003)
- [x] T005 [P] `src/features/polygon/components/PolygonMapGuard.tsx` 구현: `import.meta
    .env.PUBLIC_KAKAO_MAP_API_KEY`가 비어 있으면 지도 대신 안내 메시지를 렌더링하고,
      값이 있으면 `children`을 그대로 렌더링 (FR-011)
- [x] T006 TanStack Router 설정: `src/routes/polygon.tsx`에 `/polygon` 라우트 정의를
      추가하고, `src/App.tsx`에서 라우터 트리를 생성해 `RouterProvider`로 렌더링하도록
      변경 (현재 `App.tsx`는 기본 템플릿 내용이므로 교체)
- [x] T007 `src/pages/PolygonControlPage.tsx` 뼈대 구현: `PolygonMapGuard`로 감싼 뒤
      `left`/`right` 패널 2개를 나란히 배치할 레이아웃만 작성 (패널 내용은 US1에서 채움)
      (depends on T005, T006)

**Checkpoint**: Foundation ready - `/polygon` 라우트 접속 시 안내 메시지 또는 빈 2단 레이아웃이
보이는 상태. User story 구현 시작 가능.

---

## Phase 3: User Story 1 - 폴리곤 그리기 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 지도 위에서 그리기 모드를 켜고 클릭으로 꼭짓점을 찍어 폴리곤 하나를 완성한다.

**Independent Test**: 빈 지도에서 그리기 버튼 → 3개 이상 클릭 → 완료(더블클릭)하면 폴리곤이
지도에 표시되는지로 독립 검증 (quickstart.md "US1 — 폴리곤 그리기").

### Implementation for User Story 1

- [x] T008 [US1] `src/features/polygon/hooks/usePolygonMapPanel.ts` 구현: 특정
      `panelId`에 대해 스토어의 `drawingMode`/`polygons`를 구독하고 `startDrawing`,
      `finishDrawing(path)`(T004의 `addPolygon` 호출), `cancelDrawing` 핸들러를 제공
- [x] T009 [US1] `src/features/polygon/components/PolygonMapPanel.tsx` 구현:
      `react-kakao-maps-sdk`의 `Map`/`Polygon`/`DrawingManager`로 지도를 렌더링하고,
      `usePolygonMapPanel`의 폴리곤 목록을 `Polygon`으로 그리며, 그리기 완료 콜백을
      `finishDrawing`에 연결 (3개 미만 꼭짓점은 `addPolygon`에서 무시됨 — FR-003)
- [x] T010 [US1] `src/features/polygon/components/PolygonToolbar.tsx` 구현: 그리기
      모드 on/off 토글 버튼 (합치기/분할/삭제 버튼은 이후 스토리에서 추가)
- [x] T011 [US1] `src/pages/PolygonControlPage.tsx`에서 `left`/`right` 각 패널에
      `PolygonMapPanel` + `PolygonToolbar`를 렌더링하도록 완성 (depends on T008–T010)

**Checkpoint**: User Story 1만으로 "지도 2개에서 각각 폴리곤을 그릴 수 있다"는 MVP가 완성되어
독립적으로 데모 가능.

---

## Phase 4: User Story 2 - 폴리곤 선택 (Priority: P2)

**Goal**: 사용자가 그려진 폴리곤을 클릭해 선택/해제할 수 있다.

**Independent Test**: 폴리곤 2개 이상 상태에서 하나를 클릭하면 선택 스타일로 바뀌고, 다시
클릭하면 해제되는지로 독립 검증 (quickstart.md "US2 — 폴리곤 선택").

### Implementation for User Story 2

- [x] T012 [US2] `src/features/polygon/hooks/usePolygonMapPanel.ts`에 `toggleSelect
    (polygonId)` 핸들러 추가 (T004의 `toggleSelect` 액션 연결)
- [x] T013 [US2] `src/features/polygon/components/PolygonMapPanel.tsx`의 `Polygon`
      컴포넌트에 `onClick={() => toggleSelect(polygon.id)}`와 `selected` 여부에 따른
      강조 스타일(`strokeColor`/`fillColor` 변경)을 적용 (depends on T012)

**Checkpoint**: User Story 1 + 2가 함께 독립적으로 동작 — 그리고 선택할 수 있다.

---

## Phase 5: User Story 3 - 폴리곤 합치기 연산 (Priority: P2)

**Goal**: 선택된 폴리곤 2개에 대해 union/intersection/xor/difference 중 하나를 실행해 새
폴리곤을 만든다.

**Independent Test**: 겹치는 폴리곤 2개를 선택하고 연산 버튼을 누르면 결과 폴리곤 하나가
생기고 원본 2개가 사라지는지로, 1개만 선택 시 에러 안내가 뜨는지로 독립 검증 (quickstart.md
"US3 — 합치기 연산").

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T014 [P] [US3] `src/features/polygon/helper/polygonOperations.test.ts`에 실패하는
      단위 테스트 작성: 겹치는 두 폴리곤의 union/intersection/xor/difference 결과 검증,
      intersection 결과가 비어 있을 때(겹치지 않는 폴리곤) 빈 결과를 반환하는지 검증
      (spec.md Edge Cases)

### Implementation for User Story 3

- [x] T015 [US3] `src/features/polygon/helper/polygonOperations.ts`에 `polygon-clipping`
      기반 `union`/`intersection`/`xor`/`difference` 순수 함수 구현해 T014 테스트를
      통과시킴 (depends on T014)
- [x] T016 [US3] `src/features/polygon/components/PolygonToolbar.tsx`에 4개 연산 버튼
      추가 — 선택된 폴리곤이 정확히 2개일 때만 활성화, 아니면 "2개 이상 선택이 필요하다"는
      안내 표시 (FR-006, data-model.md "검증 규칙")
- [x] T017 [US3] `src/features/polygon/usePolygonStore.ts`(또는
      `usePolygonMapPanel.ts`)에 합치기 실행 액션 추가: T015의 연산 함수 호출 →
      결과가 있으면 원본 2개 제거 + 새 `Polygon`(`source`를 연산명으로) 추가(FR-007),
      결과가 비어 있으면(겹치는 영역 없음) 제거 없이 안내만 표시 (depends on T015)

**Checkpoint**: User Story 1~3이 함께 독립적으로 동작 — 그리고, 선택하고, 합칠 수 있다.

---

## Phase 6: User Story 4 - 폴리곤 분할 (Priority: P3)

**Goal**: 선택된 폴리곤 1개를 가로지르는 선으로 2개의 폴리곤으로 나눈다.

**Independent Test**: 폴리곤 1개를 선택하고 가로지르는 분할선을 그으면 폴리곤 2개로 나뉘고,
가로지르지 않는 선을 그으면 오류가 안내되는지로 독립 검증 (quickstart.md "US4 — 폴리곤
분할").

### Tests for User Story 4 ⚠️

- [x] T018 [P] [US4] `src/features/polygon/helper/polygonSplit.test.ts`에 실패하는 단위
      테스트 작성: 폴리곤을 가로지르는 선으로 분할 시 폴리곤 2개 반환, 가로지르지 않는
      선일 때 에러/빈 결과 반환 검증 (spec.md Edge Cases)

### Implementation for User Story 4

- [x] T019 [US4] `src/features/polygon/helper/polygonSplit.ts`에 `polygon-splitter`
      기반 분할 순수 함수 구현해 T018 테스트를 통과시킴 (depends on T018)
- [x] T020 [US4] `src/features/polygon/components/PolygonToolbar.tsx`에 분할 도구 버튼
      추가 — 선택된 폴리곤이 정확히 1개일 때만 활성화
- [x] T021 [US4] `src/features/polygon/components/PolygonMapPanel.tsx`에 분할선 그리기
      인터랙션(폴리라인 그리기 모드) 추가, 완료 시 T019 함수 호출 → 교차하면 원본 폴리곤
      제거 + 새 폴리곤 2개(`source: 'split'`) 추가(FR-008), 교차하지 않으면 제거 없이
      오류 안내 (depends on T019, T020)

**Checkpoint**: spec.md의 모든 User Story가 독립적으로 동작.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 모든 User Story에 걸친 마무리 작업

- [x] T022 [P] `src/features/polygon/components/PolygonToolbar.tsx`와 스토어 액션에
      폴리곤 개별 삭제/전체 초기화 기능 추가 (FR-010)
- [x] T023 `pnpm lint`, `pnpm test`, `pnpm build` 실행해 모두 통과하는지 확인
      (CLAUDE.md "명령어")
- [ ] T024 `quickstart.md`의 모든 수동 시나리오(US1~US4, 환경변수 누락 시나리오)를 브라우저에서
      직접 검증

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 의존성 없음 — 바로 시작 가능
- **Foundational (Phase 2)**: Setup 완료 후 — 모든 User Story를 막는 전제 조건
- **User Story 1 (Phase 3)**: Foundational 완료 후 시작, 다른 스토리에 의존하지 않음 (MVP)
- **User Story 2 (Phase 4)**: Foundational 완료 후 시작 가능하지만, 실제로는 User Story 1이
  만든 `PolygonMapPanel`/폴리곤 목록이 있어야 "선택"을 시연할 수 있어 US1 이후 진행 권장
- **User Story 3 (Phase 5)**: US2(선택)가 만든 선택 상태를 전제로 하므로 US2 이후 진행
- **User Story 4 (Phase 6)**: US2(선택)를 전제로 하므로 US2 이후 진행 (US3과는 서로 독립이라
  순서를 바꿔도 무방)
- **Polish (Phase 7)**: 구현할 User Story가 모두 끝난 뒤 진행

### Parallel Opportunities

- T002(Setup)는 T001과 동시에 진행 가능
- T005(Guard 컴포넌트)는 T003/T004(타입·스토어)와 별개 파일이라 병렬 가능
- T014와 T018(서로 다른 테스트 파일)은 US3/US4를 별도로 맡는다면 병렬 가능

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1(Setup) → Phase 2(Foundational) 완료
2. Phase 3(User Story 1) 완료 후 quickstart.md "US1" 시나리오로 독립 검증
3. 이 상태로 데모 가능 (지도 2개 + 그리기)

### Incremental Delivery

1. Setup + Foundational → 라우트 접속 시 빈 2단 레이아웃 확인
2. US1 추가 → 그리기 가능 → 독립 검증 → 데모(MVP)
3. US2 추가 → 선택 가능 → 독립 검증
4. US3 추가 → 합치기 연산 가능 → 독립 검증 (TDD: T014 red → T015 green)
5. US4 추가 → 분할 가능 → 독립 검증 (TDD: T018 red → T019 green)
6. Polish(Phase 7)로 삭제/초기화 기능과 전체 검증 마무리
