# 스펙: 라우터 basepath 계산

## 배경/목적

GitHub Pages 프로젝트 페이지는 `/demos/` 서브경로로 배포된다. 빌드(`assetPrefix`, `server.base`)는
`GH_PAGES_BASE_PATH`를 따르지만 TanStack Router는 basepath를 몰라 홈 링크가 `/`로 가고 새로고침 시
라우트 매칭에 실패한다. 빌드 설정과 같은 값을 라우터 basepath로 변환한다.

## 입력

`base: string` — 빌드 설정의 base 값 (예: `'/'`, `'/demos/'`). rsbuild `source.define`으로 주입한다.

## 기대 동작

- [ ] `'/'` → `'/'` (로컬 개발/커스텀 도메인)
- [ ] `'/demos/'` → `'/demos'` (TanStack Router는 끝 슬래시 없는 basepath를 기대)
- [ ] `'/demos'` → `'/demos'`

## 엣지케이스

- [ ] 빈 문자열 → `'/'`
- [ ] 앞 슬래시 없음(`'demos/'`) → `'/demos'`
- [ ] 슬래시가 중복된 값(`'//demos//'`) → `'/demos'`

## 범위 밖

- 404.html 폴백 방식 변경(해시 라우팅 등)

## 관련 이슈

#7
