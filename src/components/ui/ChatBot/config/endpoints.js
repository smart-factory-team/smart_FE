// ===============================
// endpoints.js - API 엔드포인트 설정
// src/components/ui/ChatBot/config/endpoints.js
// ===============================

// API 기본 설정
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TIMEOUT: 30000, // 30초
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// 카테고리별 챗봇 엔드포인트 매핑
export const CHATBOT_ENDPOINTS = {
  // 통합 문의 (Multi-Agent)
  'multi-agent': '/chat/test',
  
  // 안전 문의 (GPT)
  'safety': '/api/gpt',
  
  // 기술 문의 (Gemini)
  'technical': '/api/gemini'
};

// 챗봇 워크플로우 API 엔드포인트
export const WORKFLOW_ENDPOINTS = {
  // 챗봇 세션 시작
  START_CHAT: '/api/chatbot-workflow/start-chat',
  
  // 대화 진행
  CONTINUE_CHAT: '/api/chatbot-workflow/continue-chat',
  
  // 채팅 완료
  COMPLETE_CHAT: '/api/chatbot-workflow/complete-chat',
  
  // 세션 상태 확인
  SESSION_STATUS: (sessionId) => `/api/chatbot-workflow/session-status/${sessionId}`,
  
  // 보고서 다운로드
  DOWNLOAD_REPORT: (sessionId) => `/api/chatbot-workflow/download-report/${sessionId}`,
  
  // 보고서 건너뛰기
  SKIP_REPORT: (sessionId) => `/api/chatbot-workflow/skip-report/${sessionId}`,
  
  // 이슈별 세션 조회
  ISSUE_SESSIONS: (issueId) => `/api/chatbot-workflow/issues/${issueId}/sessions`
};

// 세션 관리 API 엔드포인트
export const SESSION_ENDPOINTS = {
  // 새 세션 생성
  CREATE_SESSION: '/api/session/new',
  
  // 세션 정보 조회
  GET_SESSION: (sessionId) => `/api/session/${sessionId}`,
  
  // 세션 삭제
  DELETE_SESSION: (sessionId) => `/api/session/${sessionId}`,
  
  // 대화 히스토리 조회
  GET_HISTORY: (sessionId) => `/api/session/${sessionId}/history`
};

// 일반 API 엔드포인트
export const GENERAL_ENDPOINTS = {
  // 헬스 체크
  HEALTH: '/health',
  
  // Ping
  PING: '/ping',
  
  // 메트릭
  METRICS: '/metrics'
};

// Knowledge Base API (필요시 사용)
export const KNOWLEDGE_ENDPOINTS = {
  GET_ISSUES: '/knowledge/issues',
  SEARCH_KNOWLEDGE: '/knowledge/search',
  GET_ANALYTICS: '/knowledge/analytics/summary'
};

// HTTP 메서드별 엔드포인트 분류
export const HTTP_METHODS = {
  GET: [
    'HEALTH',
    'PING', 
    'METRICS',
    'SESSION_STATUS',
    'GET_SESSION',
    'GET_HISTORY',
    'DOWNLOAD_REPORT',
    'ISSUE_SESSIONS'
  ],
  POST: [
    'START_CHAT',
    'CONTINUE_CHAT', 
    'COMPLETE_CHAT',
    'CREATE_SESSION',
    'SKIP_REPORT'
  ],
  DELETE: [
    'DELETE_SESSION'
  ]
};

// API 응답 상태 코드
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// 에러 메시지 템플릿
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  TIMEOUT_ERROR: '요청 시간이 초과되었습니다.',
  INVALID_SESSION: '유효하지 않은 세션입니다.',
  API_NOT_AVAILABLE: 'API 서비스를 사용할 수 없습니다.',
  INVALID_RESPONSE: '잘못된 응답 형식입니다.'
};