# Research: 폴리곤 제어 데모 화면 이식

## 1. 지도/드로잉 라이브러리

- **Decision**: `react-kakao-maps-sdk`
- **Rationale**: 원본 데모 화면(`dos/.../DeliveryRegionSettingTestManageBoard.jsx`, 이슈 #1 참고)이
  이미 이 라이브러리로 지도·`Polygon`·`DrawingManager`를 구현해 검증된 조합이다. React 컴포넌트
  형태로 카카오맵 JS SDK를 감싸고 있어 선언적으로 Map/Polygon/DrawingManager를 다룰 수 있고, 현재
  프로젝트의 `PUBLIC_KAKAO_MAP_API_KEY` 환경변수와 바로 연결된다.
- **Alternatives considered**:
  - 카카오맵 JS SDK를 직접 로드해 명령형으로 제어 — React 상태와 수동 동기화해야 해 보일러플레이트가
    늘고, 원본과의 연속성도 떨어짐.
  - 다른 지도 공급자(OSM/Leaflet 등) 교체 — 스펙/이슈 모두 "카카오맵"을 전제로 하고 있어 범위 밖.
- **승인 필요**: CLAUDE.md "기술 스택" 원칙상 신규 라이브러리이므로 `/speckit-tasks` 진행 전 사용자
  승인이 필요하다 (plan.md "Constitution Check" 참고).

## 2. 폴리곤 불리언 연산 라이브러리 (union/intersection/xor/difference)

- **Decision**: `polygon-clipping`
- **Rationale**: 원본 데모가 사용한 라이브러리와 동일. GeoJSON 스타일의 좌표 배열을 입력으로 받아
  union/intersection/xor/difference를 모두 지원해 FR-006 요구사항과 1:1로 대응된다. 순수 함수
  형태(부수효과 없음)라 `src/features/polygon/helper/polygonOperations.ts`에서 TDD로 감싸기 쉽다.
- **Alternatives considered**:
  - Turf.js(`@turf/union` 등 개별 패키지 조합) — 기능은 유사하지만 xor/difference를 위해 여러
    패키지를 추가로 설치해야 해 의존성이 늘어남.
  - 직접 구현(Weiler–Atherton 등 다각형 클리핑 알고리즘) — 범위를 크게 벗어나는 과도한 엔지니어링.
- **승인 필요**: 위와 동일하게 사용자 승인 대상.

## 3. 폴리곤 분할 라이브러리 (split)

- **Decision**: `polygon-splitter`
- **Rationale**: 원본 데모와 동일 라이브러리. 분할선(LineString)과 폴리곤을 입력받아 교차 여부를
  판단하고 분할 결과를 반환해, FR-008/엣지케이스("가로지르지 않는 선") 요구사항을 그대로 만족한다.
- **Alternatives considered**:
  - `polygon-clipping`만으로 분할선을 얇은 폴리곤으로 바꿔 difference 연산을 적용 — 기술적으로는
    가능하지만 "분할선이 폴리곤을 가로지르지 않을 때의 오류 처리"를 직접 구현해야 해 복잡도가 늘어남.
- **승인 필요**: 위와 동일하게 사용자 승인 대상.

## 4. 상태 관리 모양

- **Decision**: 지도 패널 2개 각각에 대해 "폴리곤 목록 + 선택된 폴리곤 id 집합 + 그리기 모드 여부"를
  갖는 Zustand 스토어 하나를 둔다(패널 id로 구분).
- **Rationale**: CLAUDE.md 기술 스택에서 전역 상태 관리로 Zustand를 이미 채택했고, 두 지도 패널이
  "동일 기능을 독립적으로 제공"(spec.md Assumptions)하므로 패널 단위로 상태를 키잉하는 것이 자연스럽다.
- **Alternatives considered**: 패널별로 별도 스토어 인스턴스를 생성 — 패널이 2개로 고정돼 있어 과한
  추상화.

## 5. 테스트 전략

- **Decision**: `polygonOperations.ts`/`polygonSplit.ts`는 TDD(실패하는 테스트 먼저 작성 후 구현).
  지도 렌더링/드로잉 인터랙션(`PolygonMapPanel` 등)은 ARCHITECTURE.md "외부 SDK 모킹 전략"에 따라
  `react-kakao-maps-sdk`가 실제로 쓰는 API만 최소로 모킹한 뒤 컴포넌트 테스트로 사후 검증한다.
- **Rationale**: ARCHITECTURE.md "TDD 적용 기준" — 입출력이 명확한 순수 함수만 TDD 대상, SDK 의존
  코드는 비대상.

## 6. 라우팅 등록

- **Decision**: TanStack Router에 `/polygon` 라우트 하나를 추가하고 `PolygonControlPage`를 연결한다.
- **Rationale**: 현재 프로젝트에 라우트가 하나도 없는 초기 상태라, 이 기능이 사실상 첫 라우트 등록
  사례가 된다. 별도 레이아웃/중첩 라우트가 필요할 만큼 복잡하지 않아 단일 라우트로 충분하다.
