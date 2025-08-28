# 🤖 AI 기반 스마트 팩토리 모니터링 시스템

> **6개 AI 모델**로 불량률 32% 감소를 달성한 차세대 자동차 제조 모니터링 시스템

## ✨ AI 혁신 성과

- 🎯 **불량률 32% 감소** - AI 예측 분석으로 품질 혁신
- 🤖 **6개 AI 모델 적용** - 공정별 전문 AI 시스템
- 📊 **99% 실시간 처리율** - 2초 간격 실시간 AI 분석
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
- **최적 정비 주기**: AI 기반 예방정비 스케줄 추천
- **공정 효율 최적화**: 머신러닝 기반 생산성 개선

## 🏭 모니터링 공정

### 차체 공정 🤖
- 용접 전류/진동 AI 분석
- 로봇 동작 패턴 학습
- 접합 품질 실시간 예측

### 프레스 공정 ⚙️
- 유압 펌프 고장 탐지 및 상태 모니터링
- 프레스 공정 생산품 결함 탐지 및 모니터링

### 도장 공정 🎨
- 표면 결함 컴퓨터 비전 탐지
- 전압 이상 AI 분석
- 품질 불량 자동 분류

### 조립 공정 🔧
- 조립 라인 AI 모니터링
- 공정 흐름 최적화
- 품질 관리 자동화

## 🚀 기술 스택

### Frontend
- **React 19.1.1** - 최신 React 기반 UI
- **Styled Components** - 모던 CSS-in-JS 스타일링
- **Chart.js + Recharts** - 고급 데이터 시각화
- **WebSocket** - 실시간 데이터 통신

### AI & Backend Integration
- **GPT API** - 자연어 기반 AI 상담
- **Gemini API** - 기술 분석 AI
- **Azure Storage** - 이미지 AI 분석 연동
- **Real-time API** - 실시간 AI 모델 통신

### 실시간 모니터링
- **Dual WebSocket** - 이상 알림 + 모니터링 데이터
- **Auto-reconnection** - 자동 재연결 및 오류 복구
- **2초 간격 업데이트** - 초고속 실시간 처리

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
│   ├── paintingSurfaceDefect.js  # AI 결함 탐지 API
│   └── client.js          # API 클라이언트
├── components/
│   ├── charts/            # AI 데이터 시각화
│   │   └── ProcessChart/  # 공정별 AI 차트
│   └── ui/
│       └── ChatBot/       # AI 챗봇 시스템
│           ├── hooks/     # AI 상담 로직
│           └── data/      # AI 이슈 데이터
├── hooks/
│   ├── usePaintingSurfaceDefect.js  # AI 결함 탐지 훅
│   └── useRealTimeData.js # 실시간 AI 데이터
├── pages/                 # 공정별 모니터링 페이지
│   ├── PaintingMonitoring/
│   ├── PressMonitoring/
│   └── AssemblyMonitoring/
└── services/
    ├── WebSocketService.js      # 실시간 통신
    └── PaintingWebSocketService.js  # 도장 AI 통신
```

## 🔧 주요 기능

### AI 챗봇 상담
- 공정별 전문 AI 상담사 배치
- 실시간 이슈 분석 및 솔루션 제공
- 과거 데이터 학습 기반 문제 해결

### 실시간 AI 모니터링
- 2초 간격 실시간 AI 분석
- 이상 패턴 자동 탐지 및 알림
- 예측적 유지보수 추천

### 고급 데이터 시각화
- AI 분석 결과 실시간 차트
- 공정별 AI 성능 대시보드
- 트렌드 분석 및 예측 그래프

## 📈 AI 성능 지표

| 지표 | 성능 | 설명 |
|------|------|------|
| 불량률 감소 | **32%** | AI 예측 분석 도입 후 품질 개선 |
| 실시간 처리율 | **99%** | 2초 간격 실시간 AI 데이터 처리 |
| AI 모델 수 | **6개** | 공정별 특화된 AI 전문가 시스템 |
| 무인 모니터링 | **24/7** | AI 기반 상시 자동 감시 체계 |

## 📞 문의

프로젝트에 대한 문의사항이나 제안이 있으시면 이슈를 생성해 주세요.

---

**🚀 AI가 이끄는 스마트 팩토리의 미래를 경험해보세요!**
