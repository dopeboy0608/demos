# TROUBLE SHOOTING

> 디버깅, 원인 조사, 기술적 의사결정(예: 특정 방식이 왜 안 되는지 검토) 기록. 기록 규칙은
> [CLAUDE.md "트러블슈팅 로그"](../CLAUDE.md#트러블슈팅-로그) 참고. 아래 포맷으로 누적 기록한다.

```
## YYYY-MM-DD HH:MM — <문제/주제>
- 증상: <무엇이 문제였는지>
- 원인: <근본 원인 또는 검토 결과>
- 해결/결론: <어떻게 해결했는지 또는 어떤 판단을 내렸는지>
- 관련 이슈/PR: <있는 경우>
```

## 2026-10-03 12:15 — TypeScript 7에서 `tsconfig.json`의 `baseUrl`이 제거됨

- 증상: `pnpm exec tsc --noEmit` 실행 시 `tsconfig.json(17,5): error TS5102: Option 'baseUrl' has
been removed.`과 `Non-relative paths are not allowed.` 에러로 `@/*` 경로 별칭이 깨짐.
- 원인: 프로젝트가 쓰는 TypeScript 7.0.2(Drond-OpenSky와 버전 통일을 위해 고정)에서 `baseUrl`
  컴파일러 옵션이 제거됨 — `paths`의 값이 `baseUrl` 기준 상대 경로가 아니라 `tsconfig.json`
  파일 위치 기준 상대 경로여야 함.
- 해결/결론: `"baseUrl": "."`을 제거하고 `"paths": { "@/*": ["./src/*"] }`로 수정. `./` 접두사를
  명시해야 `TS5090`(Non-relative paths are not allowed) 에러도 피할 수 있었다.
- 관련 이슈/PR: #1

## 2026-10-03 12:40 — `/polygon-legacy` 포팅 직후 지도가 전혀 렌더링되지 않음

- 증상: 원본 코드를 그대로 포팅한 `PolygonLegacyPage`에서 지도 영역이 비어 있고 아무 것도
  표시되지 않음.
- 원인: 원본 프로젝트는 카카오맵 JS SDK를 `index.html`의 전역 `<script>` 태그로 미리
  로드해뒀을 것으로 추정되는데, 이 프로젝트엔 그런 전역 스크립트가 없어 `window.kakao`가
  아예 정의되지 않은 상태였다. 포팅 과정에서 SDK를 로드하는 코드(`useKakaoLoader`) 자체를
  옮기지 않은 게 직접 원인.
- 해결/결론: `react-kakao-maps-sdk`의 `useKakaoLoader({ appkey, libraries: ['drawing'] })`를
  추가하고, 키 미설정/로딩/에러 상태에 따라 안내 메시지를 분기하도록 구현.
- 관련 이슈/PR: #1

## 2026-10-03 12:50 — 카카오맵 SDK 스크립트 요청이 `ERR_BLOCKED_BY_ORB`로 실패

- 증상: `useKakaoLoader` 추가 후에도 브라우저 콘솔에
  `net::ERR_BLOCKED_BY_ORB`가 반복 출력되며 지도가 로드되지 않음. Playwright로 열어봐도
  동일 증상 재현.
- 원인: `ERR_BLOCKED_BY_ORB`만으로는 원인이 불명확해 `curl`로 카카오맵 스크립트 URL을 직접
  호출해보니 실제 응답은 `401 AccessDeniedError` —
  `"domain mismatched! caller=http://localhost:3001. check out registered web domains."`.
  즉 코드 문제가 아니라 카카오 디벨로퍼스 콘솔의 해당 JS 키에 `http://localhost:3000`/`3001`이
  허용 도메인(플랫폼 설정 → Web)으로 등록돼 있지 않아 카카오 서버가 요청 자체를 거부한 것.
- 해결/결론: 브라우저의 네트워크 에러 메시지(`ERR_BLOCKED_BY_ORB`)만 보고 판단하지 않고,
  `curl`로 실제 HTTP 응답 바디를 직접 확인해 정확한 원인을 찾음. 사용자가 카카오
  디벨로퍼스 콘솔에 로컬 개발 도메인을 등록한 뒤 정상 동작 확인. 배포 환경(GitHub Pages
  도메인)도 별도로 등록이 필요함.
- 관련 이슈/PR: #1

## 2026-10-03 13:10 — `/polygon`과 `/polygon-legacy`를 오가면 먼저 로드된 페이지의 그리기가 깨짐

- 증상: 카카오맵 도메인 등록 후에도, `/polygon`을 먼저 연 다음 `/polygon-legacy`로 이동하면
  (또는 그 반대 순서) 나중에 연 페이지가 아니라 **먼저** 열었던 페이지의 지도/그리기
  인터랙션이 동작하지 않게 됨 — 재현이 간헐적으로 보여 처음엔 원인을 특정하기 어려웠음.
- 원인: `/polygon`(`PolygonMapGuard`)과 `/polygon-legacy`(`PolygonLegacyPage`)가
  `useKakaoLoader`를 서로 다른 옵션(`libraries: ['drawing']` 유무)으로 호출하고 있었다.
  `react-kakao-maps-sdk`의 `Loader`는 앱 전체에서 싱글턴으로 동작하는데, 소스 코드
  (`kakaoMapApiLoader.js`의 `Loader.equalOptions` 체크)를 확인해보니 두 번째 호출의 옵션이
  첫 번째와 다르면 이미 로드된 SDK를 리셋하고 스크립트를 다시 주입한다 — 이 리셋이 먼저
  로드했던 페이지가 여전히 마운트돼 있는 상태(같은 탭에서 라우터로 이동만 한 경우)에서
  일어나면서 `window.kakao`를 참조하던 기존 지도/DrawingManager가 깨짐.
- 해결/결론: 두 호출부의 `useKakaoLoader` 옵션을 `libraries: ['drawing']`로 통일해 옵션
  불일치로 인한 리셋이 아예 일어나지 않도록 함. Playwright로 `/polygon` → `/polygon-legacy`
  이동 후 그리기→저장까지 정상 동작하는 것을 재검증.
- 관련 이슈/PR: #1
