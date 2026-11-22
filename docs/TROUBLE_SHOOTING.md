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

## 2026-11-21 09:19 — spec-kit 전체 파이프라인 폐지, `feature-strategy` 기반으로 AI 워크플로우 재구축

- 증상: spec-kit 풀 파이프라인(`/speckit-specify`→...→`/speckit-implement`)은 `specs/001-polygon-control`
  1회만 쓰였고, 실제로는 `docs/spec/` 경량 스펙과 `docs/feature/` 로드맵 방식이 더 많이
  쓰였다. 그런데 `docs/feature/` 방식은 어떤 규칙 문서에도 문서화되지 않은 채 암묵적으로만
  쓰이고 있었고, CLAUDE.md의 "새 기능마다 `docs/spec` 작성" 규칙은 실제 운영과 어긋났다.
- 원인: 초기 구축 당시 들여온 spec-kit 워크플로우가 이 프로젝트 규모(개인용 데모, 1인 작업)에
  비해 과했다. 전역 플러그인 `dopeboy0608-skills`에 더 가벼운 `ai-workflow-init`/
  `ai-workflow-setup`/`feature-strategy` 스킬이 이미 있어 이를 기준으로 재정의하는 쪽이
  실제 운영 방식과 맞았다.
- 해결/결론: `main-bak` 브랜치로 기존 상태를 백업한 뒤, `CLAUDE.md`/`docs/ARCHITECTURE.md`/
  `AGENTS.md`/spec-kit 관련 스킬 13개/`.specify/`/`docs/spec/TEMPLATE.md`를 제거했다.
  `/ai-workflow-init`→`/ai-workflow-setup`(둘 다 명시 호출 전용 스킬이라 사용자가 직접
  실행)으로 새 `CLAUDE.md`/`docs/ARCHITECTURE.md`/`.claude/skills/issue-start/`를 생성했고,
  큰 작업은 `docs/feature/<이슈번호>-<slug>.md` 로드맵 + GitHub 서브이슈로 관리하는
  `feature-strategy`로 통일했다. 기존 `docs/TROUBLE_SHOOTING.md`, `docs/feature/`, `specs/`,
  개발환경 파일(`package.json`, `src/` 등)은 그대로 보존했고 `pnpm lint`/`test`/`build`로
  무변경을 확인했다. AGENTS.md는 Cursor 등 다른 에이전트용 미러 파일이었으나 유지 비용이
  크다고 판단해 완전히 삭제(CLAUDE.md 단일 출처로 통합)했고, Playwright 브라우저 디버깅
  방침은 새 템플릿 개념과 맞지 않아 복원하지 않기로 했다.
- 관련 이슈/PR: #10

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

## 2026-11-21 11:05 — LG 로보킹 XFL 변환기 PoC(#17): Ruffle 라이브 녹화 비교를 할 수 없음

- 증상: 03(XFL 변환기 PoC) 검증 계획에 "Ruffle로 원본을 녹화해 변환 결과와 비교"가
  있었는데, 로컬에서 원본 Flash 프로젝트 폴더(이 저장소 밖)를 정적 서버로 띄워 Ruffle에
  로드하려 하자 Claude Code 자동 모드의 승인 분류기가 "Undermining Oversight"로 거부함
  (백그라운드로 임의 폴더를 서빙하는 서버 실행이라는 이유). `nohup`/`&`, `run_in_background`
  둘 다 같은 사유로 거부됨.
- 원인: 샌드박스가 백그라운드 서버 실행(특히 작업 디렉터리 밖 임의 폴더를 서빙하는 경우)을
  구조적으로 차단하는 정책. 우회 시도는 거부 의도를 피해가는 행위라 판단해 다른 방법을
  더 찾지 않음.
- 해결/결론: 라이브 Ruffle 비교 대신, XFL에서 추출한 실제 키프레임 값(매트릭스/알파/필터)과
  변환된 GSAP 타임라인 값을 수치로 직접 대조하고, 변환 결과를 `/roboking-poc` 디버그
  화면에서 실제로 재생해 `getComputedStyle`로 보간 궤적을 샘플링하는 방식으로 대체
  검증함. 필요하면 사용자가 직접 권한을 승인해 Ruffle 비교를 추가로 진행할 수 있음.
- 관련 이슈/PR: #12, #17

## 2026-11-21 19:25 — LG 로보킹 거실·침실 적용(#20): 자동화 브라우저 창에서 게임 진행이 실제보다

느려 보임

- 증상: 침실 Dog의 이벤트 먼지 투하 간격(2초마다)과 게임 타이머(TIME HUD)가 실측해보니
  기대보다 훨씬 느리게(최대 수 배) 진행되는 것처럼 보여, 처음엔 `useGameLoop`의 고정
  타임스텝 로직이나 Dog 타이머 로직 자체의 버그로 의심함.
- 원인: `requestAnimationFrame` 콜백 간격을 직접 측정해보니(`performance.now()` 델타)
  실제로 초당 1회 안팎으로만 호출되고 있었다 — Claude 내장 브라우저 패널(자동화용
  Browser pane)이 배경/비활성 렌더링 상황에서 rAF를 강하게 스로틀링하기 때문. 고정
  타임스텝 누적 로직 자체(`useGameLoop`)는 실제 경과 시간(`performance.now()` 델타)을
  기준으로 정확히 캐치업하므로 로직 문제가 아니었음 — 다만 큰 델타를 과도하게 보정하지
  않도록 걸어둔 `MAX_FRAME_DELTA_SECONDS=0.25` 클램프가, rAF가 1초에 한 번만 오는
  이 환경에서는 매번 실제 경과 시간의 상당 부분을 깎아먹어 체감상 더 느려 보이게 만듦.
- 해결/결론: 이 느려짐은 자동화 테스트 환경 특유의 현상이고 실제 사용자 브라우저(rAF가
  디스플레이 주사율대로 동작)에서는 정상 속도로 동작한다고 판단, 클램프 로직은 백그라운드
  탭 복귀 시 타임 스파이크를 막는 정상적인 설계이므로 그대로 둠. 테스트 시에는 이 환경
  특성을 감안해 판정함.
- 관련 이슈/PR: #12, #20

## 2026-11-21 19:26 — LG 로보킹 거실·침실 적용(#20): 침실 Dog가 벽 데이터 공백으로 무대 밖으로

나감

- 증상: 침실 스테이지에서 Dog를 충분히 오래(10초 이상) 돌아다니게 두면 `y` 좌표가 계속
  증가해 무대 높이(1000)를 넘어서도 멈추지 않고 계속 이동함.
- 원인: `stage_bed.fla`에서 실측한 벽 19개 중, 무대 하단 일부 구간(대략 x=760 부근
  y=900~1000)에는 벽이 전혀 없음 — 원본 게임에서는 플레이어가 의도적으로만 그 경로로
  가므로 실무상 드러나지 않았을 가능성이 있는 데이터 공백으로 추정. Dog는 무작위 방향
  전환으로 돌아다니다 이 공백을 만나면 벽 충돌 판정(`findCollidingWall`)에 걸리지 않고
  그대로 직진함.
- 해결/결론: 로봇(플레이어)은 실제 벽 데이터를 그대로 신뢰하되, Dog에 한해 무대 경계
  (810x1000) 자체를 추가 충돌 조건으로 둬 벗어나면 방향을 다시 무작위로 바꾸도록 함
  (`STAGE_WIDTH`/`STAGE_HEIGHT` 클램프). 로봇의 충돌 판정은 변경하지 않음(원본 벽
  데이터만 사용).
- 관련 이슈/PR: #12, #20

## 2026-11-21 19:27 — LG 로보킹 거실·침실 적용(#20): Dog가 떨어뜨린 이벤트 먼지로 React key 중복

- 증상: 브라우저 콘솔에 "Encountered two children with the same key" 경고가 반복
  발생. 좌표 문자열(`event-dust-${x}-${y}`)을 key로 쓰고 있었음.
- 원인: Dog가 벽에 막혀 같은 자리에 머무른 채로 2초 간격 타이머가 두 번 이상 지나가면,
  같은 좌표에 이벤트 먼지를 두 번 떨어뜨리는 경우가 생김 — 좌표 기반 key는 이때 중복됨.
- 해결/결론: 이벤트 먼지(와 일반 먼지)의 key를 좌표 대신, 먹었는지 여부와 무관하게
  계속 안정적인 "원본 배열 인덱스"로 바꿈(수집된 항목은 필터링만 하고 인덱스는 그대로
  유지). 좌표가 겹쳐도 인덱스는 유일하므로 재발하지 않음.
- 관련 이슈/PR: #12, #20

## 2026-11-21 20:10 — 권역조회 지도에서 줌인(확대)이 되지 않음

- 증상: `/region-view` 지도에서 마우스 휠로 줌아웃(축소)은 간헐적으로 동작하지만, 줌인(확대)은
  전혀 동작하지 않음. 더블클릭 줌도 동작하지 않음. 브라우저 자동화로 재현했을 때 줌아웃 폭이
  스크롤 틱 수와 일치하지 않는 등 노이즈가 있어 처음엔 테스트 도구 문제로 의심했음.
- 원인: `react-kakao-maps-sdk@1.2.2`의 `Map.js` 구현 버그. `maxLevel`/`minLevel` prop을 실제
  카카오맵 API에 연결하는 부분에서 이름이 서로 뒤바뀌어 있음.
  ```js
  useKakaoMapsSetEffect(map, 'setMinLevel', maxLevel); // maxLevel prop → setMinLevel로 연결
  useKakaoMapsSetEffect(map, 'setMaxLevel', minLevel); // minLevel prop → setMaxLevel로 연결
  ```
  `RegionViewMap`이 `maxLevel={12}`만 지정했기 때문에 실제로는 `map.setMinLevel(12)`가
  호출되어 레벨 12 미만(더 확대된 상태)으로 줄어들 수 없었음. `minLevel`은 지정하지 않아
  `setMaxLevel(undefined)`가 호출되어 축소 상한이 걸리지 않았고, 이 비대칭 때문에 줄어들
  때만 간헐적으로 동작하는 것처럼 보였음. `map.setLevel()`을 직접 호출해도 레벨이 전혀
  바뀌지 않는 것으로 라이브러리 레벨 제약 버그임을 확정(스크롤 제스처나 브라우저 자동화
  타이밍 문제가 아님).
- 해결/결론: `minLevel`/`maxLevel` prop(라이브러리 버그로 신뢰할 수 없음) 대신 `onCreate`
  콜백에서 생성된 카카오맵 인스턴스에 `map.setMaxLevel(12)`를 직접 호출해 우회함. prop
  바인딩을 거치지 않아 라이브러리가 향후 버그를 고쳐도 영향받지 않음.
- 관련 이슈/PR: #37

## 2026-11-22 10:00 — `gh issue create`/`gh issue edit`가 간헐적으로 샌드박스에 막힘

- 증상: 이슈 #52(xmark) 서브이슈 생성 작업 중 `gh issue create`, `gh issue edit --body-file`
  호출이 Claude Code 자동 모드 승인 분류기에 의해 "[Destructive or Unwanted Actions]"
  이유로 거부됨. 같은 명령을 바로 재시도해도 또 거부되는 경우(서브이슈 생성 1차 시도)와,
  사용자 확인을 받은 뒤 재시도하자 바로 성공하는 경우(이슈 본문 수정)가 혼재함 — 규칙성
  없이 통과/거부가 갈림.
- 원인: 분류기가 이슈 생성·본문 전체 교체처럼 외부에 보이고 되돌리기 어려운 GitHub 쓰기
  작업을 세션/타이밍에 따라 다르게 판단하는 것으로 보임(결정적 규칙이 아닌 것으로 추정).
  "[Undermining Oversight]"로 백그라운드 서버 실행이 막힌 사례(위 참고)와 달리, 이번엔
  같은 호출이 한 번은 막히고 한 번은 통과해 환경 쪽 비결정성으로 판단.
- 해결/결론: 거부 시 같은 호출을 무한 재시도하지 않고, 사용자에게 상황을 설명한 뒤
  (a) 사용자가 직접 터미널에서 실행하거나 (b) 사용자의 명시적 재시도 지시를 받아 다시
  시도하는 방식으로 처리함. CLAUDE.md상 이슈 생성/수정은 원래도 매번 사용자 확인이
  필요한 외부 액션이라, 이 분류기 거부는 그 확인 절차를 한 번 더 강제하는 효과로 수용.
- 관련 이슈/PR: #52

## 2026-11-22 13:00 — xmark GNB/logo/util 등 공통 레이아웃 이미지가 XFL 내부 비트맵 캐시 포맷이라 추출 불가

- 증상: 이슈 #52(xmark) 서브태스크 01 구현 중, `xmark_main.fla`(XFL)를 압축 해제해도
  `main/png/logo.png`, `gnb_img.png`, `util_img.png`, `recruit_img.png`, `footer_img.png` 등
  레이아웃용 이미지의 실제 파일이 `LIBRARY/`에 존재하지 않음. `DOMBitmapItem`의
  `bitmapDataHRef`가 가리키는 `bin/M {id} {timestamp}.dat`를 열어보면 PNG/JPEG 매직 바이트가
  아닌 임의 바이너리(`0305 8802 ...`)이고, 중간에 `78 01`(zlib 헤더로 보이는 바이트)이 있어도
  해당 지점부터 `zlib.decompress`가 실패함.
- 원인: 이슈 #12/#13과 달리, 이 FLA는 이미지들을 "파일로 가져오기"가 아니라 Flash 저작 도구에
  붙여넣기/가져오기 시 내부적으로 저장하는 비공개 비트맵 캐시 포맷(`.dat`)으로 보관하고 있음.
  `LIBRARY/*.png`로 직접 추출되는 다른 에셋(예: `scroll_arrow.png`, `wheel_img.png`)과 달리,
  이 방식으로 저장된 이미지는 공개 디코더가 없어 JPEXS 같은 전용 도구 없이는 복원이 어려움.
- 해결/결론: 디자인 파일이 없는 작업(결정 사항 ⑦: "재현도는 최대한 동일하게, 과한 부분은 설명
  후 결정")이므로, 해당 이미지들은 픽셀 단위로 복원하는 대신 `XmarkMain.as`에서 읽은 실제 좌표
  (`StageInfo` 기반 모서리 고정 값)와 텍스트/CSS로 레이아웃을 재현함. 좌표·동작 로직(모서리 고정,
  GNB 탭 전환, "준비중입니다." 알림)은 코드에서 직접 확인했으므로 실측 그대로이고, 시각 자산만
  대체했음을 feature doc에 기록.
- 관련 이슈/PR: #52, #55

## 2026-11-22 14:25 — xmark 휠 스크롤이 preventDefault 되지 않고 페이지도 같이 스크롤됨

- 증상: 이슈 #52(xmark) 서브태스크 05(리스트 휠 스크롤) 구현 중, 브라우저 콘솔에
  "Unable to preventDefault inside passive event listener invocation." 경고가 반복 발생. 동시에
  갤러리↔리스트 스타일 탭을 전환했다가 갤러리로 되돌아오면 휠 스크롤이 더 이상 페이지 전환을
  일으키지 않는 2차 증상도 있었음.
- 원인:
  1. React 17+는 성능을 위해 JSX `onWheel`(과 `onTouchStart` 등)을 passive 리스너로 등록한다.
     passive 리스너 안에서는 `event.preventDefault()`가 무시되므로, 휠로 페이지/스크롤을 직접
     제어하려는 커스텀 로직과 브라우저 기본 스크롤이 함께 발생함.
  2. 1번을 고치려고 `useRef` + `useEffect(() => { el.addEventListener(...) }, [])`로 네이티브
     리스너를 붙이는 훅을 만들었으나, 갤러리↔리스트 전환처럼 대상 엘리먼트가 조건부 렌더링으로
     언마운트·리마운트되면 `ref.current`는 새 DOM 노드로 바뀌는데 `useEffect`는 컴포넌트가
     한 번도 언마운트되지 않는 한 재실행되지 않아, 리스너가 떨어져 나간 옛 노드에만 붙은 채
     방치됨(React DevTools 없이도 재현 가능, "Hooks 순서가 바뀌었다"는 경고와는 무관한 별개
     버그였음).
- 해결/결론: `useNonPassiveWheel` 훅을 콜백 ref 방식으로 다시 작성함(`src/features/xmark/hooks/useNonPassiveWheel.ts`).
  콜백 ref는 엘리먼트가 마운트/언마운트될 때마다 매번 호출되므로, 이전 리스너를 정리하고 새
  엘리먼트에 다시 붙이는 로직을 그 안에 넣어 리마운트를 놓치지 않게 함. `useRef`로 최신 핸들러를
  보관해 의존성 배열 없이도 항상 최신 클로저를 호출하도록 함.
- 관련 이슈/PR: #52, #59
