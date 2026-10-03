# demos

개인용 데모/실험 프로젝트. 프론트엔드 UI만 구현하며 백엔드/DB는 두지 않는다.

## 시작하기

```bash
pnpm install
pnpm dev
```

개발 서버가 뜨면 안내되는 주소(기본 http://localhost:3000)에서 확인할 수 있다.

## 명령어

- `pnpm dev` — 개발 서버 실행
- `pnpm build` — 프로덕션 빌드
- `pnpm preview` — 빌드 결과 미리보기
- `pnpm lint` / `pnpm lint:fix` — biome 린트 검사/자동 수정
- `pnpm format` — prettier 포맷
- `pnpm test` — vitest 테스트 실행

## 기술 스택

React 19 + TypeScript, rsbuild, TanStack Router/Query, axios, Zustand, Tailwind CSS + antd,
biome + prettier (husky + lint-staged로 커밋 시 자동 적용), vitest + @testing-library/react + msw.

## 디렉터리 구조

도메인 전용 코드는 `src/features/<domain>/{api,components,hooks,queries,helper}`에, 공용 코드는
`src/{api,pages,routes}`에 둔다. 자세한 작업 규칙과 범위는 [CLAUDE.md](./CLAUDE.md),
[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) 참고.
