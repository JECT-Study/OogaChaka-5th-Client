# OogaChaka Client

## 기술 스택

| 구분                 | 기술                      |
| -------------------- | ------------------------- |
| 프레임워크           | Next.js App Router, React |
| 언어                 | TypeScript                |
| 패키지 관리          | Bun                       |
| 스타일링             | Tailwind CSS v4           |
| 서버 상태 관리       | TanStack Query            |
| 클라이언트 상태 관리 | Zustand                   |
| 코드 검사            | Oxlint                    |
| 코드 포맷팅          | Prettier                  |

## 시작하기

Bun과 Node.js가 설치되어 있어야 합니다.

```bash
bun install
bun run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 명령어

아래 명령어는 프로젝트 루트에서 실행합니다.

| 명령어                 | 설명                      |
| ---------------------- | ------------------------- |
| `bun run dev`          | 개발 서버 실행            |
| `bun run lint`         | Oxlint 코드 검사          |
| `bun run format`       | Prettier 코드 자동 포맷팅 |
| `bun run format:check` | Prettier 코드 포맷 검사   |
| `bun run typecheck`    | TypeScript 타입 검사      |
| `bun run build`        | 프로덕션 빌드             |
| `bun run start`        | 빌드된 앱 실행            |

## 폴더 구조

```text
.
├── public/              # 정적 파일
└── src/
    ├── app/             # 라우트, 레이아웃, 전역 스타일 및 Provider
    ├── components/      # 여러 기능에서 재사용하는 공통 UI 컴포넌트
    ├── constants/       # 앱 전역 상수
    ├── features/        # 도메인·기능 단위 모듈
    │   └── <feature>/
    │       ├── api/     # 기능 전용 API 요청
    │       ├── components/
    │       ├── hooks/
    │       └── types.ts
    ├── lib/             # fetch client, Query 설정 등 공통 기반 코드
    ├── stores/          # 여러 기능이 공유하는 Zustand 스토어
    ├── styles/
    │   └── tokens/      # 디자인 토큰
    └── types/           # 여러 기능이 공유하는 타입 정의
```

기능에 종속된 API 요청, 컴포넌트, 훅, 타입은 `features/<feature>` 안에 함께 둡니다. 여러 기능에서 공유될 때만 최상위 공통 폴더로 올립니다. 경로 별칭 `@/*`는 `src/*`를 가리킵니다.
