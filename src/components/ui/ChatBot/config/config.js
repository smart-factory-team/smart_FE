// ===============================
// config.js - 간소화된 챗봇 설정
// src/components/ui/ChatBot/config/config.js
// ===============================

// 환경 감지
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// API 서버 URL 설정
const CHATBOT_API_URL = 'http://localhost:8000';
const MAIN_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8088';

// 기본 설정
export const config = {
  // 챗봇 API 설정 (로컬)
  chatbotApi: {
    baseUrl: CHATBOT_API_URL,
    timeout: 90000, // 🔧 30초 → 90초로 증가
    retryAttempts: 3,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  // 메인 백엔드 API 설정 (원격)
  mainApi: {
    baseUrl: MAIN_BACKEND_URL,
    timeout: 30000,
    retryAttempts: 3,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  // UI 설정
  ui: {
    messageDisplayDelay: 500,
    maxMessages: 100,
  },
  
  // 에러 처리 설정
  errors: {
    showDetails: isDevelopment,
    logToConsole: true,
  }
};

// 챗봇 엔드포인트
export const CHATBOT_ENDPOINTS = {
  // 카테고리별 챗봇 엔드포인트
  CATEGORIES: {
    'multi-agent': '/chat/test',      // 통합 문의
    'safety': '/api/gpt',             // 안전 문의 (GPT)
    'technical': '/api/gemini'        // 기술 문의 (Gemini)
  },
  
  // 워크플로우 API
  WORKFLOW: {
    START_CHAT: '/api/chatbot-workflow/start-chat',
    CONTINUE_CHAT: '/api/chatbot-workflow/continue-chat',
    COMPLETE_CHAT: '/api/chatbot-workflow/complete-chat',
    SESSION_STATUS: (sessionId) => `/api/chatbot-workflow/session-status/${sessionId}`,
    DOWNLOAD_REPORT: (sessionId) => `/api/chatbot-workflow/download-report/${sessionId}`,
    SKIP_REPORT: (sessionId) => `/api/chatbot-workflow/skip-report/${sessionId}`,
  },
  
  // 세션 관리
  SESSION: {
    CREATE: '/api/session/new',
    GET: (sessionId) => `/api/session/${sessionId}`,
    DELETE: (sessionId) => `/api/session/${sessionId}`,
    HISTORY: (sessionId) => `/api/session/${sessionId}/history`
  },
  
  // 헬스체크
  HEALTH: '/health',
  PING: '/ping'
};

// 유틸리티 함수들
export const utils = {
  isDevelopment: () => isDevelopment,
  isProduction: () => isProduction,
  
  getChatbotApiUrl: (endpoint = '') => {
    const baseUrl = config.chatbotApi.baseUrl.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');
    return cleanEndpoint ? `${baseUrl}/${cleanEndpoint}` : baseUrl;
  },
  
  shouldLogToConsole: () => config.errors.logToConsole,
  
  getChatbotConfig: () => config.chatbotApi
};

// 개발 환경에서 디버그 정보 출력
if (isDevelopment) {
  console.group('🔧 ChatBot Configuration');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Chatbot API:', config.chatbotApi.baseUrl);
  console.log('Main Backend API:', config.mainApi.baseUrl);
  console.groupEnd();
}

// 환경별 기능 플래그
export const features = {
  // API 기능
  enableAdvancedErrorHandling: false, // 간소화
  enableApiRetry: config.chatbotApi.retryAttempts > 0,
  enableHealthCheck: false, // 헬스체크 비활성화
  
  // UI 기능
  enableAutoClose: false, // 자동 닫기 비활성화
  enableTypingIndicator: config.ui.messageDisplayDelay > 0,
  enableMessageLimit: config.ui.maxMessages > 0,
  
  // 성능 기능
  enableDebouncing: false, // 간소화
  enableThrottling: false,
  enableMemoization: true,
  enableVirtualization: false,
  
  // 보안 기능
  enableInputSanitization: false, // 간소화
  enableResponseValidation: false,
  enableCSRFProtection: false,
  
  // 개발자 기능
  enableErrorDetails: isDevelopment,
  enableConsoleLogging: true
};

// 기본 export
export default config;