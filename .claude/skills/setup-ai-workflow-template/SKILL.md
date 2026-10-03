---
name: setup-ai-workflow-template
description: ai-workflow-template으로 새 프로젝트를 시작했을 때 1회성으로 실행하는 셋업 스킬. CLAUDE.md/ARCHITECTURE.md의 [placeholder]를 인터뷰로 채우고, 답변에서 파악한 기술 스택에 맞춰 FE/BE 디렉터리 스캐폴딩 적용 여부를 묻고, spec-kit CLI/grill-me/dopeboy0608-skills 같은 외부 의존성 설치를 안내한다. 자동으로 트리거되지 않으며 `/setup-ai-workflow-template` 명시적 호출 시에만 동작한다. React의 CRA처럼 편의 기능일 뿐 필수는 아니다 — 안 쓰고 수동으로 채워도 무방하다.
disable-model-invocation: true
---

# setup-ai-workflow-template

이 템플릿을 복사해 새 프로젝트를 시작한 직후, 한 번 실행해서 "범용 템플릿"을 "이 프로젝트 전용"으로
완성하는 스킬. 세 단계를 순서대로 진행하며, 각 단계 사이 사용자 확인을 받는다(issue-start →
speckit-start와 동일한 패턴). 재실행해도 안전하다 — 이미 채워진 내용이나 이미 있는 디렉터리는
건드리지 않는다.

## 절차

### 1. Placeholder 인터뷰

`CLAUDE.md`, `docs/ARCHITECTURE.md`를 읽어 `[placeholder]` 문자열이 남아있는 섹션만 골라 질문한다.
이미 채워진 섹션은 건너뛴다(재실행 시 중복 질문 방지).

- **프로젝트 목적/현재 범위**: 이 프로젝트가 뭘 하는지, 현재 구현 범위는 어디까지인지
- **명령어**: 개발/빌드/린트/테스트에 쓰는 실제 커맨드
- **기술 스택**: 언어/프레임워크, 패키지 매니저, 상태 관리, 라우팅, 데이터 조회 방식 등
- **디렉터리 구조**: 이미 구상한 구조가 있는지(없으면 2단계 스캐폴딩 제안으로 넘어가서 같이 정함)
- **Out of scope**: 지금 범위에서 의도적으로 제외한 기능

답변을 받을 때마다 해당 `[placeholder]`를 `Edit` 도구로 바로 치환한다. 그릴미 스타일로 한 번에 하나씩
묻고, 애매한 답변은 추천안을 제시해 확인받는다.

### 2. FE/BE 스캐폴딩 제안

1단계에서 파악한 기술 스택 답변을 보고 FE/BE/풀스택 중 무엇인지 판단한다(애매하면 직접 묻는다:
"프론트엔드/백엔드/풀스택 중 어느 쪽인가요?").

- FE라면 [references/fe-scaffold.md](./references/fe-scaffold.md)를, BE라면
  [references/be-scaffold.md](./references/be-scaffold.md)를, 풀스택이면 둘 다 보여주고
  "이 구조로 디렉터리를 만들까요?"라고 확인받는다.
- 승인하면 레퍼런스의 디렉터리만 빈 상태(`.gitkeep` 포함)로 생성한다. 코드 파일은 만들지 않는다 —
  구조만 잡아주는 것이지 보일러플레이트 코드를 심는 게 아니다.
- 거절하거나 "이미 다른 구조가 있다"고 하면 건너뛴다.
- 이미 `src/` 등 디렉터리가 존재하면 먼저 사용자에게 보여주고 "이미 구조가 있는 것 같은데 그대로 둘까요?"라고 확인한다 — 기존 파일을 덮어쓰지 않는다.

### 3. 외부 의존성 안내

- **spec-kit CLI**: `.specify/` 디렉터리 존재 여부와 `command -v specify`로 설치 여부를 확인한다.
  없으면 "`speckit-start` 경로(이슈 작업 시작 워크플로우의 B안)를 쓰려면 필요합니다. 지금
  `specify init --here --integration claude`를 실행할까요?"라고 확인받고, 승인 시에만 실행한다.
- **grill-me 플러그인**: 설치 여부를 프로그래밍적으로 확인할 방법이 없으므로 직접 묻는다 —
  "grill-me 스타일 추천 인터뷰(`issue-start`가 사용)를 쓰는 플러그인이 설치돼 있나요?" 없다고
  하면 마켓플레이스 추가/설치는 `/plugin` 명령으로 사용자가 직접 진행하도록 안내만 한다(이 스킬이
  대신 설치하지 않는다).
- **dopeboy0608-skills 플러그인(code-organizer/fowler-refactor)**: 마찬가지로 직접 묻고, 없으면
  설치 방법만 안내한다. 이 플러그인이 없으면 CLAUDE.md "코드 작성 후 규칙"의 `/code-organizer`,
  `/fowler-refactor` 관련 항목은 적용할 수 없다는 점도 함께 안내한다.

### 4. 완료 보고

채운 placeholder 목록, 적용/건너뛴 스캐폴딩, 설치/건너뛴 의존성을 짧게 요약해 보고한다.

## 하지 않는 것

- 세션 시작 시 자동으로 트리거되지 않는다 — 항상 `/setup-ai-workflow-template` 명시적 호출 시에만
  동작한다(토큰 소비 방지).
- 커밋, PR 생성, 머지를 하지 않는다.
- 플러그인을 대신 설치하지 않는다 — 설치 명령 안내까지만 하고 실행은 사용자가 `/plugin` 명령으로
  직접 한다.
- 이미 채워진 placeholder나 이미 존재하는 디렉터리/파일을 덮어쓰지 않는다.
