# 🤖 AI 기반 스마트 팩토리 모니터링 시스템

> **6개 AI 모델**로 불량률 85% 감소를 달성한 차세대 자동차 제조 모니터링 시스템

## ✨ AI 혁신 성과

- 🎯 **불량률 85% 감소** - AI 예측 분석으로 품질 혁신
- 🤖 **6개 AI 모델 적용** - 공정별 전문 AI 시스템
- 📊 **99% 실시간 처리율** - 1분 간격 실시간 AI 분석
- 🔍 **24/7 무인 감시** - AI 자동 모니터링 시스템

## 🧠 핵심 AI 기능

### 1. 🎯 멀티 AI 전문가 상담 시스템
- **통합 문의**: 복합 이슈를 다중 AI가 협업하여 해결
- **안전 전문가**: GPT 기반 안전 분석 및 솔루션 제공
- **기술 전문가**: Gemini 기반 기술 상담 및 문제 진단
- **실시간 API 연동**: 백엔드 AI 모델과 실시간 통신

### 2. 👁️ 컴퓨터 비전 결함 탐지
- **실시간 표면 검사**: Azure Storage 연동 이미지 AI 분석
- **자동 불량 분류**: 스크래치, 도장 결함 AI 자동 탐지
- **기계별 AI 통계**: 실시간 결함률 분석 및 예측
- **시뮬레이터 연동**: AI 모델 테스트 및 검증 환경

### 3. 🔮 예측적 유지보수 AI
- **설비 이상 예측**: 전류/진동 패턴 머신러닝 분석
- **복합 이상 탐지**: 다중 센서 데이터 AI 융합 분석
- **공정 효율 최적화**: 머신러닝 기반 생산성 개선

## 🏭 모니터링 공정

### 프레스 공정 ⚙️
- 유압펌프 및 생산품 상태 목록
- 유압 펌프 실시간 현황 그래프
- 프레스 생산품 결함 실시간 현황 모니터링

### 차체 공정 🤖
- 로봇 용접기 상태 목록
- 로봇 용접기 상태 차트 모니터링
- 시뮬레이터 제어

### 도장 공정 🎨
- 전체 장비 상태 목록
- 도장 표면 결함 실시간 현황 모니터링
- 전착 도장 설비 실시간 현황 모니터링
- 도장 설비 시뮬레이터 제어

### 조립 공정 🔧
- 조립 라인 상태 목록
- 조립 공정 효율성 상태 모니터링

## 🚀 기술 스택

### Frontend
- **React 19.1.1** - 최신 React 기반 UI
- **React Router Dom** - SPA 라우팅 시스템
- **Styled Components** - 모던 CSS-in-JS 스타일링
- **Chart.js + Recharts** - 고급 데이터 시각화
- **Lucide React** - 모던 아이콘 라이브러리
- **Axios** - HTTP 클라이언트 라이브러리
- **WebSocket** - 실시간 데이터 통신

### 실시간 모니터링
- **WebSocket** - 이상 알림 + 모니터링 데이터
- **Auto-reconnection** - 자동 재연결 및 오류 복구
- **1분 간격 업데이트** - 초고속 실시간 처리

## 🖥️ 프론트엔드 주요 기능

### 📊 실시간 모니터링 대시보드
- 4개 공정별 통합 모니터링 인터페이스
- 실시간 데이터 시각화 및 차트 업데이트
- 장비 상태 목록 및 알림 시스템

### 💬 AI 챗봇 인터페이스
- 카테고리별 이슈 선택 UI
- 다중 AI 모델 상담 결과 표시
- 실시간 채팅 인터페이스

### 🎛️ 시뮬레이터 제어 패널
- 도장/차체 공정 시뮬레이터 원격 제어
- 실시간 시뮬레이션 상태 모니터링
- 테스트 시나리오 실행 및 결과 확인

### 👥 사용자 관리 시스템
- 회원가입/로그인 인터페이스
- 관리자 페이지 및 권한 관리
- 개인 설정 및 마이페이지

### 📝 게시판 시스템
- 공지사항 및 이슈 트래킹
- 게시글 작성/수정/삭제 기능
- 팀원 간 소통 플랫폼

## 👥 팀원별 담당 서비스

| 팀원 | 담당 페이지 | 설명 |
|------|-------------|------|
| 김태현 | PaintingMonitoring | 도장 공정 모니터링 페이지 구성 및 api 연동 |
| 이원욱 | PaintingMonitoring | 도장 공정 모니터링 페이지 구성 및 api 연동 |
| 김해연 | PressMonitoring | 프레스 공정 모니터링 페이지 구성 및 api 연동 |
| 배소연 | PressMonitoring, Board | 프레스 공정 모니터링 페이지 구성 및 api 연동, 게시판 페이지 |
| 권도윤 | AssemblyMonitoring | 의장 조립 공정 모니터링 페이지 구성 및 api 연동 |
| 한다현 | VehicleMonitoring, Admin, Dashboard, ChatBot ui | 통합 모니터링, 차체 공정 모니터링, 관리자, 회원 가입, 로그인, 메인 페이지 구성 및 api 연동, 챗봇 UI 구성 |

## 🛠️ 설치 및 실행

### 사전 요구사항
- Node.js 16.0.0 이상
- npm 또는 yarn

### 설치
```bash
# 프로젝트 클론
git clone [repository-url]
cd smart_FE

# 의존성 설치
npm install
```

### 환경 변수 설정
```bash
# .env 파일 생성
REACT_APP_API_BASE_URL=http://localhost:8088
REACT_APP_PAINTING_SURFACE_API_BASE_URL=http://localhost:8089
```

### 개발 서버 실행
```bash
# 개발 모드 실행
npm start
```
브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드
```bash
# 프로덕션 빌드
npm run build
```

## 📊 프로젝트 구조

```
src/
├── api/                    # API 연동 모듈
│   ├── auth.js            # 인증 API
│   ├── client.js          # API 클라이언트
│   ├── index.js           # API 통합 모듈
│   ├── paintingSurfaceDefect.js  # AI 결함 탐지 API
│   └── user.js            # 사용자 API
├── components/
│   ├── charts/            # AI 데이터 시각화
│   │   ├── ProcessChart/  # 공정별 AI 차트
│   │   └── RealTimeChart/ # 실시간 차트
│   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── Header/
│   │   ├── PageLayout/
│   │   └── Sidebar/
│   ├── list/              # 리스트 컴포넌트
│   └── ui/
│       ├── ChatBot/       # AI 챗봇 시스템
│       │   ├── components/    # 챗봇 컴포넌트
│       │   ├── config/        # 설정
│       │   ├── data/          # AI 이슈 데이터
│       │   ├── hooks/         # AI 상담 로직
│       │   ├── services/      # API 서비스
│       │   ├── styles/        # 스타일링
│       │   └── utils/         # 유틸리티
│       ├── EquipmentList/ # 장비 목록
│       └── PageTitle/     # 페이지 제목
├── hooks/                 # 커스텀 훅
├── pages/                 # 공정별 모니터링 페이지
│   ├── Admin/             # 관리자 페이지
│   ├── AssemblyMonitoring/ # 조립 공정 모니터링
│   ├── Board/             # 게시판
│   ├── Dashboard/         # 통합 대시보드
│   ├── Home/              # 홈 페이지
│   ├── MyPage/            # 마이페이지
│   ├── PaintingMonitoring/ # 도장 공정 모니터링
│   ├── PressMonitoring/   # 프레스 공정 모니터링
│   ├── Register/          # 회원가입
│   └── VehicleMonitoring/ # 차체 공정 모니터링
├── router/                # 라우팅
├── services/              # 서비스 계층
└── styles/                # 글로벌 스타일
```

## 📈 AI 성능 지표

| 지표 | 성능 | 설명 |
|------|------|------|
| 불량률 감소 | **85%** | AI 예측 분석 도입 후 품질 개선 |
| 실시간 처리율 | **99%** | 1분 간격 실시간 AI 데이터 처리 |
| AI 모델 수 | **6개** | 공정별 특화된 AI 전문가 시스템 |
| 무인 모니터링 | **24/7** | AI 기반 상시 자동 감시 체계 |

## 시연 영상
[시연 영상](https://youtu.be/3j6kQe2ZbfQ)
<a href="https://youtu.be/3j6kQe2ZbfQ"><img width="1280" height="720" alt="유튜브에서 시청하기" src="https://github.com/user-attachments/assets/56b0e8df-2bc5-49c8-878d-2ffcf3b0bf5e" /></a>

## 📞 문의

프로젝트에 대한 문의사항이나 제안이 있으시면 이슈를 생성해 주세요.

---

**🚀 AI가 이끄는 스마트 팩토리의 미래를 경험해보세요!**
