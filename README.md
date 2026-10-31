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
| 네이티브 앱 래퍼      | Capacitor 7 (iOS, Android) |
| 코드 검사            | Oxlint                    |
| 코드 포맷팅          | Prettier                  |

## 시작하기

Bun과 Node.js가 설치되어 있어야 합니다. iOS 네이티브 앱을 실행하려면 macOS와 Xcode가 필요하고, Android 앱을 실행하려면 Android Studio와 Android SDK가 필요합니다.

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
| `bun run build:web`    | Capacitor용 정적 웹 빌드  |
| `bun run cap:sync`     | 웹 빌드 후 네이티브 프로젝트 동기화 |
| `bun run ios`          | 웹 빌드, iOS 동기화 및 iOS Simulator 앱 실행 |
| `bun run cap:open:ios` | Xcode에서 iOS 프로젝트 열기 |
| `bun run cap:open:android` | Android Studio에서 Android 프로젝트 열기 |

## Capacitor

웹 앱은 Next.js static export로 `out/`에 생성되며 Capacitor가 해당 결과물을 iOS와 Android WebView에 포함합니다. 앱 ID는 `com.oogachaka.client`입니다.

### iOS 실행

빌드부터 iOS Simulator 앱 실행까지 한 번에 처리하려면 다음 명령어를 사용합니다.

```bash
bun run ios
```

이 명령어는 `next build --webpack`, `bunx cap sync ios`, iOS Simulator 앱 설치·실행을 순서대로 처리합니다. Xcode와 iOS Simulator가 설치되어 있고 iPhone 시뮬레이터가 켜져 있어야 합니다. 여러 기기가 켜져 있으면 iPhone 17을 우선 선택하며, `IOS_SIMULATOR="iPhone 17 Pro" bun run ios`처럼 기기 이름이나 UDID를 지정할 수 있습니다.

수동으로 Xcode에서 실행하려면 다음 명령어를 사용합니다.

```bash
bun run cap:sync
bun run cap:open:ios
```

Xcode에서 `App` scheme과 실행할 시뮬레이터 또는 연결된 기기를 선택한 뒤 Run을 누릅니다. 네이티브 프로젝트를 변경한 뒤에는 `bun run cap:sync`를 다시 실행합니다.

### Android 실행

```bash
bun run cap:sync
bun run cap:open:android
```

Android Studio에서 에뮬레이터 또는 연결된 기기를 선택한 뒤 Run을 누릅니다.

Safe Area는 `src/styles/tokens/effects.css`의 `--safe-area-*` 변수와 `pt-safe`, `pb-safe`, `px-safe`, `py-safe`, `p-safe` 유틸리티를 사용합니다. 모바일 전체 화면 viewport를 위해 `viewportFit: 'cover'`도 설정되어 있습니다.

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
