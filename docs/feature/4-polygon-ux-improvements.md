# #4 폴리곤 제어 화면 편의성 개선

관련 이슈: [#4](https://github.com/dopeboy0608/demos/issues/4)
브랜치: `feature/4-polygon-ux-improvements`
참고 구현: `src/pages/PolygonControlPage.tsx`, `src/features/polygon/hooks/usePolygonBoard.ts`,
`src/features/polygon/components/PolygonToolbar.tsx`, `src/features/polygon/components/ResultAreaPanel.tsx`,
`src/features/polygon/polygonBoard.css`

## 로드맵

| #   | 제목                                | 범위                                                                                            | 상태           |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------------- | -------------- |
| 01  | 활성 OverlayType 버튼 강조          | `usePolygonBoard`에 활성 그리기 모드 상태 추가, `PolygonToolbar`에서 해당 버튼 강조 표시        | 완료 (ed3465c) |
| 02  | 그리기/분할선 취소 버튼 추가        | `DrawingManager.cancel()`을 호출하는 버튼을 `PolygonToolbar`에 노출, 활성 모드 상태 초기화      | 완료 (b4eac8e) |
| 03  | 수정모드 전송 폴리곤 중복 표시 개선 | `polygonClickMode === 'edit'`로 그리기 영역에 보낸 결과 폴리곤을 결과 영역에서 제거/흐리게 처리 | 완료           |
| 04  | 반응형 그리드 레이아웃              | `polygonBoard.css`에 768px 이하 브레이크포인트 추가, 좌/우 2단 → 세로 스택 전환                 | 대기           |
| 05  | 원본 포팅 메뉴/페이지 제거          | `/polygon-legacy` 라우트·네비게이션·데모 목록 카드 제거, `src/pages/legacy/` 디렉터리 삭제      | 대기           |

이슈 본문의 체크리스트 4건에 1:1 대응(01~04)하고, 사용자 요청으로 05(원본 포팅 메뉴/파일 제거)를 추가했다.
(결정: GitHub 서브이슈는 생성하지 않고 이 문서로만 추적, PR은 `Closes #4`로 연결)

## 작업 방식

- 각 항목 구현 후 커밋 전에 사용자 확인을 받는다(Phase C 체크포인트).
- 01, 02는 같은 파일(`usePolygonBoard.ts`, `PolygonToolbar.tsx`)을 다루므로 연속 작업해도 되지만,
  검증은 항목별로 따로 받는다.
- 커밋 전 `pnpm lint:fix` / `pnpm format` 실행.

## 진행 로그

### 01. 활성 OverlayType 버튼 강조

- `usePolygonBoard`에 `activeOverlayType` 상태와 `DrawingManager`의 `onSelect`/`onCancle`/`onDrawend`
  이벤트에 연결할 핸들러(`handleDrawingSelect`/`handleDrawingCancel`/`handleDrawingEnd`)를 추가했다.
  그리기 완료 시 DrawingManager가 선택을 자동 해제하므로 `onDrawend`에서도 상태를 초기화한다.
- `PolygonToolbar`의 "폴리곤 그리기"/"분할선 그리기" 버튼이 `activeOverlayType`과 일치할 때
  `type="primary"`로 강조되도록 변경.
- 로컬 dev 서버(`pnpm dev`)에서 카카오맵 JS 키의 허용 도메인이 `localhost:3000`/`3001`로
  등록돼 있는데(`docs/TROUBLE_SHOOTING.md` 2026-10-03 12:50 항목), 처음엔 두 포트 모두 다른
  프로젝트(Drone-OpenSky) dev 서버가 점유 중이라 포트 3002로 떠서 `ERR_BLOCKED_BY_ORB`가
  발생했다. 사용자가 포트 3000 점유 프로세스를 종료해줘서 `pnpm dev --port 3000`으로 재기동 후
  브라우저로 "폴리곤 그리기"/"분할선 그리기" 버튼 강조 및 그리기 완료 시 강조 해제까지 직접
  확인했다. `pnpm lint` / `tsc --noEmit` / `pnpm test` 모두 통과.
- 커밋: `ed3465c`

### 02. 그리기/분할선 취소 버튼 추가

- `usePolygonBoard`의 `cancelDrawing`(01에서 추가한 `handleDrawingCancel`과 연결된
  `manager.cancel()` 래퍼)을 `PolygonToolbar`의 새 "그리기 취소" 버튼에 연결.
- `activeOverlayType`이 없을 때는 버튼을 `disabled`로 비활성화.
- `pnpm dev`(포트 3000)에서 폴리곤 그리기 모드 진입 → 취소 버튼 활성화 → 클릭 시 모드 해제 및
  버튼 비활성화까지 직접 확인.

### 03. 수정모드 전송 폴리곤 중복 표시 개선

- `usePolygonBoard`에 `removeResultPolygon(polygonId)`을 추가. 결과 폴리곤 id는
  `${group}_${index}`(punch만 예외로 `punch_polygon`) 형식이라 id를 파싱해 해당 그룹 배열에서
  제거하고, 선택 목록(`selectedPolygons`)에서도 함께 제거한다.
- `handleResultPolygonClick`의 `edit` 케이스에서 `manager.put()`으로 그리기 영역에 보낸 직후
  `removeResultPolygon`을 호출해 결과 영역 중복 표시를 없앤다.
- `pnpm dev`(포트 3000)에서 폴리곤을 그려 저장 → "폴리곤 수정" 모드로 전환 → 결과 영역의
  폴리곤 클릭 → 결과 영역에서 사라지고 그리기 영역에 반영되는 것을 직접 확인.
