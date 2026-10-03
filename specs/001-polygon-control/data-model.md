# Data Model: 폴리곤 제어 데모 화면 이식

이 기능은 백엔드/DB가 없으므로(CLAUDE.md 범위) 아래 엔티티는 모두 프론트엔드 메모리 상태
(Zustand 스토어)에만 존재하며, 영속화되지 않는다.

## Polygon

폴리곤 하나(직접 그린 것이거나 합치기/분할 연산의 결과)를 나타낸다.

| 필드       | 타입                                                                       | 설명                                                       |
| ---------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `id`       | `string`                                                                   | 폴리곤 고유 id (생성 시 `crypto.randomUUID()` 등으로 발급) |
| `panelId`  | `'left' \| 'right'`                                                        | 소속 Map Panel                                             |
| `path`     | `{ lat: number; lng: number }[]`                                           | 꼭짓점 좌표 목록 (최소 3개)                                |
| `selected` | `boolean`                                                                  | 현재 선택 여부 (FR-005)                                    |
| `source`   | `'drawn' \| 'union' \| 'intersection' \| 'xor' \| 'difference' \| 'split'` | 생성 방식 — 직접 그리기 또는 각 연산의 결과                |

**검증 규칙**:

- `path.length >= 3` (FR-003) — 3개 미만이면 폴리곤을 생성하지 않는다.
- `source`가 연산 결과(`union` 등)인 경우, 연산에 사용된 원본 폴리곤은 같은 트랜잭션에서 제거된다
  (FR-007).

**상태 전이**:

- `drawn` → (선택 후 합치기 연산) → 원본 2개 삭제 + 새 `Polygon`(`source`가 연산명) 생성
- 임의 폴리곤 → (선택 후 분할) → 원본 1개 삭제 + 새 `Polygon` 2개(`source: 'split'`) 생성
- 임의 폴리곤 → (삭제) → 제거 (FR-010)

## Map Panel

지도 인스턴스 하나와 그 위에서 진행 중인 작업 상태를 나타낸다. 화면에는 이 패널이 2개
(`left`, `right`) 고정 존재한다(spec.md User Scenarios, FR-001).

| 필드          | 타입                | 설명                                                                   |
| ------------- | ------------------- | ---------------------------------------------------------------------- |
| `id`          | `'left' \| 'right'` | 패널 식별자                                                            |
| `drawingMode` | `boolean`           | 그리기 모드 on/off (FR-002)                                            |
| `polygons`    | `Polygon[]`         | 이 패널에 속한 폴리곤 목록 (FR-004)                                    |
| `selectedIds` | `string[]`          | 현재 선택된 폴리곤 id 목록 (FR-005, FR-006의 "정확히 2개" 검증에 사용) |

**검증 규칙**:

- 합치기 연산 실행 시 `selectedIds.length === 2`가 아니면 실행하지 않고 안내를 표시한다(FR-006,
  Edge Cases).
- 분할 실행 시 `selectedIds.length === 1`이 아니면 실행하지 않는다.

## 관계

- 하나의 `Map Panel`은 0개 이상의 `Polygon`을 가진다 (1:N).
- `Polygon`은 정확히 하나의 `Map Panel`에 속한다 — 두 패널 간 폴리곤 이동/공유는 범위 밖
  (spec.md Assumptions).
