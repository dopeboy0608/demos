# BE 스캐폴딩 레퍼런스

요청 처리(routes) → 비즈니스 로직(services) → 데이터 접근(repositories)을 계층으로 분리하는 구조.
프레임워크(Express/Nest/FastAPI 등)에 따라 폴더명은 관례가 다를 수 있으니, 아래는 역할 기준의 뼈대로
참고한다.

```
src/
  routes/           # 또는 controllers/ — 요청/응답 매핑, 입력 검증만 담당
  services/         # 비즈니스 로직. 여러 repository를 조합해 유스케이스를 구현
  repositories/     # 데이터 접근 계층(DB, 외부 API). 쿼리/호출 로직을 여기에 가둔다
  models/           # 도메인 모델, DTO, 스키마 타입
  middlewares/       # 인증, 에러 핸들링, 로깅 등 횡단 관심사
  config/           # 환경 변수, 외부 서비스 클라이언트 초기화
  utils/            # 여러 계층이 공유하는 순수 유틸
test/               # 또는 각 계층 폴더 옆에 __tests__/
```

## 적용 시 참고

- routes/controllers는 얇게 유지한다 — 비즈니스 로직을 여기에 직접 쓰지 않고 services로 위임한다.
- repositories는 ORM/쿼리 빌더/외부 API 클라이언트 호출을 캡슐화해, services가 "어떻게 가져오는지"를
  몰라도 되게 한다.
- 도메인이 커지면(여러 리소스가 서로 거의 안 섞이는 경우) `features/<domain>/{routes,services,repositories}`
  처럼 도메인 우선 구조로 바꾸는 것도 고려한다 — 이 레퍼런스는 작은~중간 규모 단일 서비스를 기준으로 한다.
