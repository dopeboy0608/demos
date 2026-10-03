# ai-workflow-template

[한국어](#한국어) | [English](#english)

## 한국어

Claude Code와 함께 일하는 방식(작업 규칙, 이슈/브랜치 컨벤션, 테스트 하네스 적용 기준, 일별 히스토리/트러블슈팅
로그, 이슈 작업 시작 워크플로우)을 새 프로젝트에 그대로 이식하기 위한 템플릿 레포다. [Drond-OpenSky](https://github.com/)
프로젝트에서 실제로 운용하며 다듬은 CLAUDE.md 규칙을 범용화했다.

기술 스택(React/pnpm/rsbuild 등)이나 도메인 로직은 포함하지 않는다 — 이 레포는 "어떻게 작업할지"에 대한
템플릿이지 보일러플레이트 코드가 아니다.

### 쓰는 법

1. 이 레포를 새 프로젝트의 출발점으로 복사한다(GitHub "Use this template" 또는 `degit`/`git clone` 후
   `.git` 재초기화).
2. Claude Code에서 `/setup-ai-workflow-template`을 실행한다 — `CLAUDE.md`/`docs/ARCHITECTURE.md`의
   `[placeholder]`를 인터뷰로 채우고, FE/BE 스캐폴딩 적용 여부를 묻고, 외부 의존성 설치를 안내해준다.
   React의 CRA처럼 편의 기능일 뿐 필수는 아니다 — 원하면 이 단계 없이 `[placeholder]`를 직접 수동으로
   채워도 된다.
3. 커밋 전 포맷/린트를 자동 실행하고 싶다면 pre-commit 훅(husky + lint-staged 등)을 프로젝트 스택에
   맞게 추가한다. 이 템플릿 자체에는 포함돼 있지 않다.

### 포함된 것 / 포함되지 않은 것

**포함:**
- `CLAUDE.md` — 코드 작성 규칙, 테스트 하네스 적용 기준, GitHub 이슈 관리, 이슈 작업 시작 워크플로우,
  일별 히스토리/트러블슈팅 로그 포맷
- `docs/ARCHITECTURE.md` — TDD 적용 기준, spec-kit 적용 기준, 외부 SDK 모킹 전략의 범용 틀
- `docs/spec/TEMPLATE.md` — 기능 스펙 템플릿
- `docs/TROUBLE_SHOOTING.md`, `docs/history/` — 로그 포맷 틀
- `.claude/skills/issue-start`, `.claude/skills/speckit-start` — 이슈 착수 시 "바로 구현"과 "spec-kit
  경로" 중 추천해주는 스킬 (아래 "외부 의존성" 참고)
- `.claude/skills/setup-ai-workflow-template` — 템플릿을 새 프로젝트에 맞게 완성해주는 1회성 셋업 스킬.
  `/setup-ai-workflow-template` 명시적 호출 시에만 동작하고 자동으로 트리거되지 않는다.

**포함하지 않음:**
- 빌드 도구/린터/테스트 러너 설정, package.json 등 스택 종속 파일
- 도메인 로드맵, API 레퍼런스 등 프로젝트 전용 문서

### 외부 의존성 (트라이얼 단계)

`issue-start`, `speckit-start` 스킬은 다음이 있어야 제대로 동작한다:

- [spec-kit](https://github.com/github/spec-kit) CLI — `specify init --here --integration claude`로
  초기화해야 `/speckit-specify` 등 하위 커맨드가 생긴다.
- grill-me 스타일 추천 흐름을 쓰는 다른 플러그인/스킬(선택) — 없어도 스킬 자체는 동작하지만, 추천 멘트
  스타일이 다를 수 있다.
- `/code-organizer`, `/fowler-refactor` — 코드 정리/리팩토링 제안 스킬. CLAUDE.md "코드 작성 후 규칙"에서
  참조한다. 없다면 해당 규칙을 프로젝트 사정에 맞게 수정하거나 제거한다.

두 스킬은 아직 트라이얼 단계로 들여온 것이라, 프로젝트마다 "spec-kit 경로로 가야 하는 신호"의 기준
(`docs/ARCHITECTURE.md` "spec-kit 적용 기준")을 실제로 몇 번 써보면서 다듬는 걸 권장한다.

위 의존성들의 설치 여부 확인/안내는 `/setup-ai-workflow-template`이 도와준다(설치 자체는 항상 사용자
확인 후 진행하며, 플러그인은 안내만 하고 대신 설치하지 않는다).

### 참고

`CLAUDE.md`, `docs/ARCHITECTURE.md`, `.claude/skills/*`는 한국어로만 제공된다. 번역본을 따로 두지 않는
이유는 두 가지다: (1) Claude Code는 `CLAUDE.md`/`SKILL.md`라는 정확한 파일명만 자동으로 읽으므로 `.en.md`
변형은 실제로 실행되는 내용과 무관한 죽은 사본이 되고, (2) 두 언어본을 따로 유지하면 규칙이 바뀔 때 한쪽만
갱신되는 drift가 반드시 생긴다. Claude는 한국어 지시를 실행하는 데 아무 문제가 없으니, 영어로 운영하고
싶다면 `/setup-ai-workflow-template`으로 프로젝트에 맞게 채우는 과정에서 팀 언어로 다시 작성하는 걸
권장한다.

---

## English

A template repo for porting the way of working with Claude Code (coding rules, issue/branch
conventions, test-harness adoption criteria, daily history/troubleshooting logs, issue-start
workflow) into a new project as-is. It generalizes the CLAUDE.md rules refined while actually
running the [Drond-OpenSky](https://github.com/) project.

It does not include a tech stack (React/pnpm/rsbuild, etc.) or domain logic — this repo is a
template for "how to work," not boilerplate code.

### How to use

1. Copy this repo as the starting point for a new project (GitHub "Use this template", or
   `degit`/`git clone` followed by re-initializing `.git`).
2. Run `/setup-ai-workflow-template` in Claude Code — it fills in the `[placeholder]`s in
   `CLAUDE.md`/`docs/ARCHITECTURE.md` through an interview, asks whether to apply FE/BE
   scaffolding, and guides you through installing external dependencies. It's a convenience,
   like React's CRA, not a requirement — you can skip it and fill in the `[placeholder]`s by
   hand instead.
3. If you want format/lint to run automatically before commits, add a pre-commit hook (husky +
   lint-staged, etc.) suited to your project's stack. This template does not include one.

### What's included / not included

**Included:**
- `CLAUDE.md` — coding rules, test-harness adoption criteria, GitHub issue management, issue-start
  workflow, daily history/troubleshooting log formats
- `docs/ARCHITECTURE.md` — generic framing for TDD adoption criteria, spec-kit adoption criteria,
  and an external-SDK mocking strategy
- `docs/spec/TEMPLATE.md` — feature spec template
- `docs/TROUBLE_SHOOTING.md`, `docs/history/` — log format skeletons
- `.claude/skills/issue-start`, `.claude/skills/speckit-start` — skills that recommend "implement
  directly" vs. "spec-kit path" when starting an issue (see "External dependencies" below)
- `.claude/skills/setup-ai-workflow-template` — a one-time setup skill that finishes adapting the
  template to a new project. It only runs on an explicit `/setup-ai-workflow-template` call and is
  never auto-triggered.

**Not included:**
- Build tool/linter/test runner configs, package.json, or other stack-specific files
- Domain roadmap, API reference, or other project-specific docs

### External dependencies (trial stage)

The `issue-start` and `speckit-start` skills need the following to work properly:

- [spec-kit](https://github.com/github/spec-kit) CLI — must be initialized with
  `specify init --here --integration claude` to get the `/speckit-specify` subcommands, etc.
- A plugin/skill that provides a grill-me-style recommendation flow (optional) — the skills still
  work without it, but the recommendation phrasing may differ.
- `/code-organizer`, `/fowler-refactor` — code-organizing/refactoring-proposal skills referenced by
  CLAUDE.md's "post-coding rules". If you don't have them, adjust or remove that rule to fit your
  project.

Both skills were brought in as a trial, so it's worth refining the criteria for "when to go the
spec-kit route" (`docs/ARCHITECTURE.md` "spec-kit adoption criteria") per project as you actually
use them a few times.

`/setup-ai-workflow-template` helps check/guide installation of the dependencies above (actual
installs always happen after user confirmation, and plugins are only guided, never installed on
your behalf).

### Note

`CLAUDE.md`, `docs/ARCHITECTURE.md`, and `.claude/skills/*` are only provided in Korean. We
deliberately don't keep a translated copy, for two reasons: (1) Claude Code only auto-loads files
named exactly `CLAUDE.md`/`SKILL.md`, so an `.en.md` variant would be a dead copy disconnected from
what actually runs, and (2) maintaining two language versions of operative rules will inevitably
drift when one gets updated and the other doesn't. Claude has no trouble executing Korean
instructions, so if you want to operate in English, we recommend rewriting these files in your
team's language as part of filling them in via `/setup-ai-workflow-template`.
