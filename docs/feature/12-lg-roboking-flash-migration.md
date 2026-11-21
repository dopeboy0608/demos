# 12. flash 컨텐츠 이관 - LG 로보킹

스토리: [dopeboy0608/demos#12](https://github.com/dopeboy0608/demos/issues/12)
원본 소스 위치: `project/flash/lg_roboking_en` (이 저장소 밖, 참고용)
브랜치: `feature/12-lg-roboking-flash-migration` (서브태스크 01 착수 시 생성)

## 로드맵 & 서브이슈 매핑

| #   | 서브이슈                                              | 제목                                      | 상태            |
| --- | ----------------------------------------------------- | ----------------------------------------- | --------------- |
| 01  | [#15](https://github.com/dopeboy0608/demos/issues/15) | 커버 > 메인 화면 정적 레이아웃            | 완료 (8cf7696)  |
| 02  | [#16](https://github.com/dopeboy0608/demos/issues/16) | 주방 > 게임 화면 틀 + 정적 레이아웃       | 완료 (c134928)  |
| 03  | [#17](https://github.com/dopeboy0608/demos/issues/17) | XFL 변환기 PoC                            | 완료 (b88804e)  |
| 04  | [#18](https://github.com/dopeboy0608/demos/issues/18) | 공통 기반 (루프/입력/사운드/일시정지)     | 요약만, 보강 전 |
| 05  | [#19](https://github.com/dopeboy0608/demos/issues/19) | 주방 게임 로직                            | 요약만, 보강 전 |
| 06  | [#20](https://github.com/dopeboy0608/demos/issues/20) | 거실·침실 스테이지 적용                   | 요약만, 보강 전 |
| 07  | [#21](https://github.com/dopeboy0608/demos/issues/21) | 결과 화면 (점수 전송/당첨 분기/추천 화면) | 요약만, 보강 전 |
| 08  | [#22](https://github.com/dopeboy0608/demos/issues/22) | 검수 (Ruffle 비교/성능/정리)              | 요약만, 보강 전 |

## 워크플로우

- 서브태스크마다 브랜치를 만들지 않고, 스토리 브랜치 `feature/12-lg-roboking-flash-migration` 하나에서 작업한다.
- 모든 서브태스크 커밋 메시지에 해당 서브태스크 이슈 번호를 포함한다.
- 첫 서브태스크(01) 커밋 이후 Draft PR을 열기 전에 사용자 확인을 받는다. PR 설명에는 스토리 이슈(#12)에만 `Closes #12`를 적고, 서브이슈는 PR로 닫지 않는다.
- 매 서브태스크 구현 후 커밋 전에 멈추고 사용자 확인을 받는다(검증 시나리오 + 코드 리뷰 포인트 보고).
- 신규 코드는 마무리 시 `/code-organizer`를 적용한다.

## 결정 로그

| 날짜       | 결정                                                             | 근거                                                                                   |
| ---------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 2026-11-21 | 데모용 이관 — 실서버 없이 mock API(`php/*.php` 응답 기준)로 진행 | 개인 데모 프로젝트 범위, ARCHITECTURE.md "백엔드/DB 범위 밖" 원칙과 일치               |
| 2026-11-21 | 친구 추천 화면은 표시만, 실제 전송/이미지 합성 없음              | Facebook/CORS/이미지 합성 2012년 구조라 재사용 불가, 데모 목적상 불필요                |
| 2026-11-21 | 영어만 구현 (다국어 `//fr` 주석 무시)                            | 원본이 `_en` 버전이고 데모 범위에서 다국어 불필요                                      |
| 2026-11-21 | PC 전용, 키보드 조작 유지, 터치/반응형 제외                      | 원본이 키보드 전용 게임이고 810×1000 고정 레이아웃                                     |
| 2026-11-21 | Adobe Animate 사용 불가 → FLA(XFL) XML 직접 파싱해 변환          | Animate 라이선스/환경 없음, XFL이 zip이라 직접 파싱 가능                               |
| 2026-11-21 | 재현도는 Ruffle 녹화본 대비 "가능한 환경에서 최대한 동일하게"    | 완전한 1:1 재현은 비현실적, 레퍼런스 비교로 검수                                       |
| 2026-11-21 | `gsap`, `react-youtube` 신규 라이브러리 도입 승인                | 타임라인 재생(Frame.control 대응)과 YouTube 임베드에 적합한 표준 라이브러리, 대안 없음 |
| 2026-11-21 | 서브태스크 01=커버 메인, 02=주방 정적 레이아웃으로 분할          | 엔트리 플로우(메인)와 레이아웃(주방 스테이지 틀)을 분리해 각각 검증 가능하게           |
| 2026-11-21 | 데모 전용 당첨 강제 확인은 `?forceWin=true` 쿼리 파라미터        | 가장 단순하고 운영 노출 위험 없음                                                      |
| 2026-11-21 | 서브이슈 표시용 `sub-task` 라벨 신규 생성                        | 저장소에 이슈 타입 기능/기존 라벨 없음                                                 |

## 사실 조사 / 발견 사항 (Phase B)

- 이 저장소에 캔버스/게임류 기존 코드 없음 — 참고 구현 없이 신규 작성 (`src/features/polygon` 디렉터리 패턴만 참고)
- "roboking" 관련 네이밍 충돌 없음
- `gsap`, `react-youtube` 저장소에 미설치 상태였음 → 설치 완료
- 다른 브랜치가 이 영역 파일을 건드리지 않음 (`feature/1-polygon-control`, `feature/4-polygon-ux-improvements`, `chore/*`만 존재)
- mock API 응답 실제 확인 (`project/flash/lg_roboking_en/src/fla_en/swf/php/*.php`):
  - `topWinnerList.php`: `top`(TOP10: thumb/id/score) + `hombotWinner`(1건) + `prizeWinner`(13건: thumb/id/date) — XML
  - `friendsList.php`: `myphoto` + `friend`(26건: bigThumb/smallThumb/id/key) — XML
  - `register.php`: `result=ok&msg=&win=false&totalScore=10000` — URL-encoded, 항상 `win=false`
  - `recommend.php`: `result=ok&msg=` — URL-encoded, 항상 성공
- 교차검증 게이트: 디자인 파일 없음(n/a) / 코드 불일치(③) 없음 → **통과** (재검증 불필요)

## 진행 로그

- 2026-11-21: Phase A — 이슈 #12 본문을 5개 섹션 템플릿(화면 구성/FR/데이터·필드/정책·예외/확인 필요 사항)으로 재구성, 기존 기술 분석은 "참고" 섹션으로 보존.
- 2026-11-21: Phase B — 입력 체크/사실 조사/교차검증 게이트 통과, 질문 라운드 1(라이브러리/서브태스크 분할/당첨 강제 수단/라벨) 완료, 로드맵(8개 서브태스크) 및 서브이슈 #15~#22 생성.
- 2026-11-21: 01(#15) 구현·커밋(8cf7696). PR #30 생성(ready for review, 스토리 완료 시 머지 예정).
- 2026-11-21: 02(#16) 구현·커밋(c134928). `stage_kitchen.fla`에서 벽 18개(이슈 본문의 "19개"는 오기로 확인, 실측 18개)/먼지 75개/이벤트 먼지 6개 좌표를 실측해 반영.
- 2026-11-21: 03(#17) 구현·커밋(b88804e). `corner_icon`(클래식 트윈+알파), `aura2`(모션 트윈+GlowFilter) 변환 PoC 성공. 마스크는 이 FLA에 작은 분리 예시가 없어 미검증(향후 마스크 필요 시점에 추가 검증 필요). Ruffle 라이브 녹화 비교는 샌드박스 제약(백그라운드 정적 서버 차단)으로 생략, 수치 대조 + 브라우저 재생 샘플링으로 대체.
