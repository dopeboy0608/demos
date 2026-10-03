# FE 스캐폴딩 레퍼런스

도메인 단위로 기능을 묶고, 여러 도메인이 공유하는 것만 바깥으로 빼는 구조. 도메인이 하나뿐인 작은
프로젝트라도 이 구조를 유지하면 도메인이 늘어날 때 리팩토링 비용이 적다.

```
src/
  pages/                    # 라우트가 렌더링하는 화면 컴포넌트
  features/
    <domain>/               # 도메인 단위 (예: auth, map, payment)
      components/
      hooks/
      queries/              # 도메인 전용 데이터 조회 훅 (필요 시)
      store/                # 도메인 전용 상태 관리 (필요 시)
      types.ts              # 도메인 전용 타입 (필요 시)
      constants.ts          # 도메인 전용 상수 (필요 시)
  components/               # 여러 feature가 공유하는 순수 공용 UI 컴포넌트
  routes/                   # 라우터 정의(경로/loader). pages/를 얇게 렌더링만 한다
  api/                      # API 클라이언트 등 공통 네트워크 레이어 (도메인 전용 조회 훅은 features/*/queries)
  store/                    # 전역 상태 관리 (도메인 전용 상태는 features/*/store)
  types/                    # 여러 도메인이 공유하는 타입
  constants/                # 여러 도메인이 공유하는 상수
  assets/                   # svg/이미지 등 정적 에셋
```

## 적용 시 참고

- 도메인 전용 하위 폴더(`queries/`, `store/`, `types.ts`, `constants.ts`)는 필요해질 때 만든다 — 처음부터
  빈 폴더로 다 만들지 않는다.
- `components/`(공용)과 `features/<domain>/components/`(도메인 전용)를 혼동하지 않는다. 두 개 이상의
  feature에서 쓰기 시작하면 공용으로 끌어올린다.
- API 호출 로직은 컴포넌트/훅에 인라인으로 두지 않고 `api/` 아래 유틸 함수로 분리한다.
