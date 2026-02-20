# PostKit — CLAUDE.md

## 프로젝트 개요

**PostKit**은 HR 담당자를 위한 채용 자동화 플랫폼입니다.

```
핵심 가치:
  채용공고 1번 작성 → 전 플랫폼 자동 게시 (크롬 익스텐션)
  이력서 AI 자동 채점 → 상위 후보 자동 추천 (GPT API)
  채용 파이프라인 통합 관리 (웹 대시보드)
```

---

## 기술 스택

### 웹 (Next.js)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: shadcn/ui + Tailwind CSS
- **Auth**: Supabase Auth
- **DB**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (이력서 PDF)
- **AI**: OpenAI GPT-4o API
- **배포**: Vercel (무료 플랜)
- **패키지 매니저**: pnpm

### 크롬 익스텐션
- **Language**: TypeScript
- **번들러**: Vite + CRXJS
- **스타일**: Tailwind CSS
- **통신**: chrome.storage.local, chrome.tabs API
- **AI**: 사용자 자체 OpenAI/Claude API Key 사용
  (익스텐션 내에서 직접 API 호출 — 서버 미경유)

---

## MCP (Model Context Protocol) 활용 가이드

> **중요**: 개발 시 MCP를 적극 활용하여 효율성을 극대화하세요.

### 필수 사용 MCP

#### 1. context7 — 최신 기술 문서 조회
```
라이브러리 문서가 필요할 때 반드시 context7을 사용하세요.
최신 버전의 공식 문서와 예제 코드를 실시간으로 가져옵니다.

사용 예시:
- Next.js 15 App Router 문법 확인
- shadcn/ui 컴포넌트 사용법
- Tailwind CSS v4 클래스
- Supabase Auth 최신 API
- OpenAI API 최신 스펙
```

#### 2. github — GitHub 연동
```
- PR 생성/리뷰
- 이슈 관리
- 코드 검색
- 파일 커밋
```

#### 3. playwright / playwright-ea — 브라우저 테스트
```
- E2E 테스트 작성 및 실행
- 스크린샷 캡처
- DOM 조작 테스트
- 크롬 익스텐션 테스트
```

#### 4. sequential-thinking — 복잡한 문제 해결
```
- 아키텍처 설계
- 버그 디버깅
- 복잡한 비즈니스 로직 설계
```

#### 5. memory — 프로젝트 컨텍스트 저장
```
- 중요한 결정사항 저장
- 프로젝트 히스토리 관리
- 반복 질문 방지
```

### MCP 사용 원칙

```
1. 라이브러리 문법이 불확실하면 → context7로 최신 문서 확인
2. 코드 작성 전 → context7로 best practice 확인
3. 복잡한 설계 필요 시 → sequential-thinking 활용
4. GitHub 작업 시 → github MCP 사용
5. UI 테스트 필요 시 → playwright 활용
```

---

## UI 개발 가이드라인

### 디자인 원칙

```
[금지 사항]
- 이모지 사용 금지 (코드, UI, 문서 모두)
- 과도한 애니메이션 금지
- 화려한 그라데이션 금지
- 둥근 모서리 과용 금지 (rounded-lg 이상 사용 자제)

[클래식 디자인 방향]
- 전문적이고 신뢰감 있는 B2B SaaS 느낌
- LinkedIn, Workday, Greenhouse 등 HR 솔루션 참고
- 깔끔한 테이블 중심 레이아웃
- 명확한 시각적 계층 구조
- 절제된 색상 사용 (Primary 색상 최소화)
- 충분한 여백 (padding, margin)
- 가독성 높은 타이포그래피

[색상 가이드]
- 배경: 화이트 / 라이트 그레이 (#F9FAFB)
- 텍스트: 다크 그레이 (#111827, #374151, #6B7280)
- Primary: 네이비 블루 또는 딥 블루 (#1E40AF, #1D4ED8)
- Accent: 최소한으로 사용
- Border: 라이트 그레이 (#E5E7EB)

[타이포그래피]
- 제목: font-semibold, 적절한 크기 계층
- 본문: font-normal, text-gray-600
- 레이블: font-medium, text-sm, text-gray-700
- 숫자/데이터: tabular-nums (고정폭 숫자)
```

### shadcn/ui 필수 사용

```
모든 UI 컴포넌트는 shadcn/ui를 기반으로 구현합니다.
직접 HTML 요소를 스타일링하지 마세요.

설치: npx shadcn@latest add [component]

필수 컴포넌트:
- Button, Input, Label, Textarea
- Card, Dialog, Sheet
- Table, Badge, Avatar
- Form (react-hook-form 연동)
- Toast (sonner)
- Dropdown, Select, Tabs
```

### Tailwind CSS 규칙

```
1. 인라인 스타일 금지 → Tailwind 클래스만 사용
2. 커스텀 CSS 최소화 → Tailwind 유틸리티 우선
3. 다크모드 대응 → dark: 접두사 사용
4. 반응형 필수 → sm:, md:, lg: 접두사 사용

색상 팔레트 (CSS Variables):
- --background, --foreground
- --primary, --secondary
- --muted, --accent
- --destructive

cn() 유틸리티 사용:
import { cn } from "@/lib/utils"
<div className={cn("base-class", conditional && "conditional-class")} />
```

### 컴포넌트 작성 패턴

```typescript
// apps/web/features/posting/components/PostingCard.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Posting } from "@postkit/shared-types"

interface PostingCardProps {
  posting: Posting
  className?: string
}

export function PostingCard({ posting, className }: PostingCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <CardTitle>{posting.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant={posting.status === "active" ? "default" : "secondary"}>
          {posting.status}
        </Badge>
      </CardContent>
    </Card>
  )
}
```

---

## 폴더 구조

```
postkit/
├── apps/
│   ├── web/                          # Next.js 웹 앱
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── dashboard/        # 메인 대시보드
│   │   │   │   ├── postings/         # 공고 관리
│   │   │   │   │   ├── new/          # 공고 작성
│   │   │   │   │   └── [id]/         # 공고 상세
│   │   │   │   ├── applicants/       # 지원자 관리
│   │   │   │   │   └── [postingId]/
│   │   │   │   └── settings/         # 설정 (API Key 등)
│   │   │   ├── api/
│   │   │   │   ├── postings/
│   │   │   │   │   ├── route.ts      # GET, POST
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts  # GET, PUT, DELETE
│   │   │   │   ├── applicants/
│   │   │   │   │   └── route.ts      # POST (채점결과 저장)
│   │   │   │   ├── ai/
│   │   │   │   │   ├── generate-jd/  # JD 자동완성
│   │   │   │   │   └── score-resume/ # 이력서 채점 (데모용)
│   │   │   │   └── auth/
│   │   │   │       └── callback/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # 랜딩페이지
│   │   ├── features/
│   │   │   ├── posting/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PostingForm.tsx
│   │   │   │   │   ├── JdAutoComplete.tsx
│   │   │   │   │   └── PostingCard.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── usePosting.ts
│   │   │   │   └── types/
│   │   │   │       └── posting.ts
│   │   │   ├── applicant/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ApplicantTable.tsx
│   │   │   │   │   ├── ScoreCard.tsx
│   │   │   │   │   ├── PipelineBoard.tsx
│   │   │   │   │   └── InterviewQuestions.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useApplicant.ts
│   │   │   │   └── types/
│   │   │   │       └── applicant.ts
│   │   │   ├── ai/
│   │   │   │   ├── services/
│   │   │   │   │   ├── jdGenerator.ts
│   │   │   │   │   └── resumeScorer.ts
│   │   │   │   └── prompts/
│   │   │   │       ├── jdGenPrompt.ts
│   │   │   │       └── scoringPrompt.ts
│   │   │   └── auth/
│   │   │       ├── components/
│   │   │       └── hooks/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── common/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts         # 브라우저 클라이언트
│   │   │   │   ├── server.ts         # 서버 클라이언트
│   │   │   │   └── middleware.ts
│   │   │   ├── openai/
│   │   │   │   └── client.ts
│   │   │   └── utils/
│   │   │       ├── cn.ts
│   │   │       └── format.ts
│   │   ├── types/
│   │   │   ├── database.ts           # Supabase 자동생성 타입
│   │   │   └── index.ts
│   │   ├── middleware.ts
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── extension/                    # 크롬 익스텐션
│       ├── src/
│       │   ├── background/
│       │   │   └── index.ts          # Service Worker
│       │   ├── content/
│       │   │   ├── index.ts          # Content Script 진입점
│       │   │   ├── platforms/
│       │   │   │   ├── jobkorea.ts   # 잡코리아 DOM 조작
│       │   │   │   ├── saramin.ts    # 사람인 DOM 조작
│       │   │   │   ├── wanted.ts     # 원티드 DOM 조작
│       │   │   │   └── jumpit.ts     # 점핏 DOM 조작
│       │   │   └── parser/
│       │   │       └── resumeParser.ts # 이력서 텍스트 추출
│       │   ├── popup/
│       │   │   ├── index.html
│       │   │   ├── main.tsx
│       │   │   ├── App.tsx
│       │   │   └── pages/
│       │   │       ├── Home.tsx      # 메인 팝업
│       │   │       ├── Settings.tsx  # API Key 설정
│       │   │       └── Scoring.tsx   # 채점 결과
│       │   ├── services/
│       │   │   ├── apiClient.ts      # OpenAI/Claude API 직접 호출
│       │   │   ├── postkitApi.ts     # PostKit 서버 통신
│       │   │   └── storage.ts        # chrome.storage 래퍼
│       │   └── types/
│       │       └── index.ts
│       ├── manifest.json
│       ├── vite.config.ts
│       └── package.json
│
├── packages/
│   ├── shared-types/                 # 웹+익스텐션 공유 타입
│   │   ├── src/
│   │   │   ├── posting.ts
│   │   │   ├── applicant.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── scoring-prompts/              # 채점 프롬프트 (공유)
│       ├── src/
│       │   ├── resumeScoring.ts
│       │   └── jdGeneration.ts
│       └── package.json
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
│
├── pnpm-workspace.yaml
├── turbo.json
└── CLAUDE.md                         # 현재 파일
```

---

## 데이터베이스 스키마 (Supabase)

```sql
-- 기업
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  size text,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- 채용공고
create table postings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  title text not null,
  description text,
  requirements text,
  tech_stack text[],
  salary_min int,
  salary_max int,
  location text,
  employment_type text, -- full-time, part-time, contract
  status text default 'draft', -- draft, active, closed
  platform_post_ids jsonb default '{}', -- {jobkorea: "xxx", saramin: "yyy"}
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 지원자 (채점결과만 저장, 이력서 원문 저장 안 함)
create table applicants (
  id uuid primary key default gen_random_uuid(),
  posting_id uuid references postings(id) on delete cascade,
  name text not null,
  apply_platform text, -- jobkorea, saramin, wanted, jumpit, direct
  total_score int,      -- 0~100
  skill_score int,
  culture_score int,
  career_score int,
  strengths text[],
  risks text[],
  recommended_questions text[],
  stage text default 'applied', -- applied, screening, interview1, interview2, final, hired, rejected
  memo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 파이프라인 로그
create table pipeline_logs (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid references applicants(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  memo text,
  created_at timestamptz default now()
);
```

---

## 환경변수

### 웹 (`apps/web/.env.local`)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI (서버사이드 JD 자동완성 + 웹 데모 채점용)
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 익스텐션 (`apps/extension/.env`)
```env
# PostKit API
VITE_POSTKIT_API_URL=http://localhost:3000

# 익스텐션에서는 API Key를 서버에 저장하지 않음
# 사용자가 Settings 페이지에서 직접 입력
# chrome.storage.local에 암호화 저장
```

---

## AI 기능 설계

### 1. JD 자동완성 (웹 서버사이드)
```
입력: 직무명, 경력, 기술스택 키워드
출력: 완성된 채용공고 (역할, 자격요건, 우대사항, 혜택)
모델: gpt-4o
위치: apps/web/features/ai/services/jdGenerator.ts
```

### 2. 이력서 AI 채점

**웹 데모용** (서버사이드, 우리 API Key 사용):
```
입력: 이력서 PDF, JD 텍스트
출력: 총점 + 항목별 점수 + 강점/리스크 + 면접질문
모델: gpt-4o
위치: apps/web/api/ai/score-resume/route.ts
용도: 해커톤 데모, 비로그인 체험
```

**실서비스** (익스텐션, 사용자 API Key 사용):
```
입력: 각 플랫폼에서 파싱한 이력서 텍스트, JD
출력: 동일
모델: 사용자 선택 (GPT-4o / Claude)
위치: apps/extension/src/services/apiClient.ts
특징: 서버 미경유, 브라우저→AI API 직접 호출
      → 개인정보 서버 저장 없음
```

### 채점 프롬프트 구조
```
System: 당신은 채용 전문가입니다. JD와 이력서를 분석하여
        아래 JSON 형식으로만 응답하세요.

Output Format:
{
  "total_score": 0-100,
  "skill_score": 0-100,
  "culture_score": 0-100,
  "career_score": 0-100,
  "strengths": ["string"],
  "risks": ["string"],
  "recommended_questions": ["string"],
  "summary": "string"
}
```

---

## 익스텐션 핵심 로직

### 멀티포스팅 (공고 자동 게시)
```
1. PostKit 웹에서 작성한 공고 데이터를 posting_id로 fetch
2. 각 플랫폼 탭을 순차적으로 열기
3. content script가 각 플랫폼 폼에 자동 입력
4. 게시 완료 후 platform_post_ids를 우리 서버에 업데이트
```

### 이력서 채점 (AI 스코어링)
```
1. HR 담당자가 플랫폼 지원자 목록 페이지에서 익스텐션 실행
2. content script가 이력서 텍스트 DOM 파싱
3. 브라우저에서 직접 OpenAI/Claude API 호출 (사용자 API Key)
4. 채점 결과를 팝업 UI에 표시
5. 결과 요약(점수+강점+리스크)만 PostKit 서버에 저장
   → 이력서 원문은 서버에 저장 안 함
```

### 보안 처리
```typescript
// API Key 저장 (chrome.storage.local — 우리 서버에 절대 전송 안 함)
await chrome.storage.local.set({
  apiKeys: {
    openai: encrypt(openaiKey),
    claude: encrypt(claudeKey)
  }
})

// 이력서 데이터 — 메모리에서만 처리, 세션 종료 시 자동 삭제
```

---

## 개발 명령어

```bash
# 루트에서 전체 설치
pnpm install

# 웹 개발 서버
pnpm --filter web dev

# 익스텐션 빌드 (watch 모드)
pnpm --filter extension dev

# 익스텐션 프로덕션 빌드
pnpm --filter extension build

# 타입 체크
pnpm typecheck

# Supabase 로컬 실행
supabase start
supabase db push
```

---

## 코드 컨벤션

### 공통
- TypeScript strict mode 필수
- 파일 최상단에 파일 경로 주석 필수
  ```typescript
  // apps/web/features/posting/components/PostingForm.tsx
  ```
- 함수형 컴포넌트 + React Hooks
- named export 우선 (default export는 page.tsx만)

### 에러 처리
```typescript
// API Route에서
try {
  const result = await service.doSomething()
  return NextResponse.json({ data: result })
} catch (error) {
  console.error('[PostingAPI]', error)
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  )
}
```

### 타입 정의
```typescript
// 공유 타입은 packages/shared-types에서 import
import type { Posting, Applicant } from '@postkit/shared-types'
```

---

## 해커톤 MVP 우선순위

### Phase 1 — 웹 핵심 (Day 1)
```
✅ 랜딩페이지 (서비스 소개)
✅ Supabase Auth (로그인/회원가입)
✅ 공고 작성 폼 + GPT JD 자동완성
✅ 공고 목록/상세 페이지
```

### Phase 2 — AI 채점 데모 (Day 2)
```
✅ 이력서 PDF 업로드
✅ GPT-4o 채점 엔진
✅ 채점 결과 UI (점수, 강점, 리스크, 면접질문)
✅ 지원자 대시보드 (점수 순 정렬)
```

### Phase 3 — 완성도 (Day 3)
```
✅ 파이프라인 보드 (칸반)
✅ 익스텐션 데모 영상
✅ Vercel 배포
✅ 발표 준비
```

### Phase 4 — 익스텐션 (해커톤 이후)
```
⬜ 크롬 익스텐션 멀티포스팅
⬜ 플랫폼별 이력서 파싱
⬜ 사용자 API Key 기반 채점
⬜ 크롬 웹스토어 배포
```

---

## 배포

### Vercel (웹)
```
- 무료 플랜 사용
- 자동 배포: main 브랜치 push 시
- 환경변수: Vercel 대시보드에서 설정
```

### Supabase (DB)
```
- 무료 플랜 사용 (500MB, 2 프로젝트)
- 프로젝트 URL과 anon key를 Vercel 환경변수에 등록
```

---

## 발표 데모 시나리오

```
1. 랜딩페이지 접속 (30초)
   → "이게 뭔지" 바로 이해

2. 공고 작성 라이브 (30초)
   → 직무명 입력 → GPT가 JD 자동완성

3. AI 채점 라이브 (60초)
   → 이력서 PDF 업로드
   → 채점 결과 실시간 출력
   → 점수, 강점, 리스크, 면접질문

4. 익스텐션 영상 (30초)
   → 잡코리아 자동 게시 장면
   → 이력서 자동 채점 장면

5. 비즈니스 (30초)
   → 요금제, 시장 규모
```
