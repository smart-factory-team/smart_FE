// ===============================
// errorHandler.js - 에러 처리 유틸
// src/components/ui/ChatBot/utils/errorHandler.js
// ===============================

import { STATUS_CODES, ERROR_MESSAGES } from '../config/endpoints';

// ===============================
// 1. API 에러 처리 함수
// ===============================

/**
 * API 에러를 사용자 친화적인 메시지로 변환
 * @param {Error} error - Axios 에러 객체
 * @returns {Object} 처리된 에러 정보
 */
export const handleApiError = (error) => {
  // 기본 에러 정보
  const errorInfo = {
    type: 'UNKNOWN_ERROR',
    message: ERROR_MESSAGES.SERVER_ERROR,
    originalError: error,
    timestamp: new Date().toISOString()
  };

  // 네트워크 에러
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        ...errorInfo,
        type: 'TIMEOUT_ERROR',
        message: ERROR_MESSAGES.TIMEOUT_ERROR
      };
    }
    
    return {
      ...errorInfo,
      type: 'NETWORK_ERROR',
      message: ERROR_MESSAGES.NETWORK_ERROR
    };
  }

  // HTTP 응답 에러
  const { status, data } = error.response;
  
  switch (status) {
    case STATUS_CODES.BAD_REQUEST:
      return {
        ...errorInfo,
        type: 'BAD_REQUEST',
        message: data?.message || '잘못된 요청입니다.',
        details: data?.details
      };

    case STATUS_CODES.UNAUTHORIZED:
      return {
        ...errorInfo,
        type: 'UNAUTHORIZED',
        message: '인증이 필요합니다.'
      };

    case STATUS_CODES.FORBIDDEN:
      return {
        ...errorInfo,
        type: 'FORBIDDEN',
        message: '접근 권한이 없습니다.'
      };

    case STATUS_CODES.NOT_FOUND:
      return {
        ...errorInfo,
        type: 'NOT_FOUND',
        message: '요청한 리소스를 찾을 수 없습니다.'
      };

    case STATUS_CODES.INTERNAL_SERVER_ERROR:
      return {
        ...errorInfo,
        type: 'SERVER_ERROR',
        message: ERROR_MESSAGES.SERVER_ERROR
      };

    case STATUS_CODES.SERVICE_UNAVAILABLE:
      return {
        ...errorInfo,
        type: 'SERVICE_UNAVAILABLE',
        message: ERROR_MESSAGES.API_NOT_AVAILABLE
      };

    default:
      return {
        ...errorInfo,
        type: 'HTTP_ERROR',
        message: `서버 오류가 발생했습니다. (상태 코드: ${status})`,
        statusCode: status
      };
  }
};

// ===============================
// 2. 챗봇 전용 에러 처리
// ===============================

/**
 * 챗봇 API 에러를 처리하고 사용자 메시지로 변환
 * @param {Error} error - 에러 객체
 * @param {string} context - 에러 발생 컨텍스트
 * @returns {Object} 챗봇용 에러 메시지
 */
export const handleChatbotError = (error, context = '') => {
  const processedError = handleApiError(error);
  
  // 챗봇 컨텍스트별 메시지 커스터마이징
  const contextMessages = {
    'session_create': '챗봇 세션을 생성할 수 없습니다.',
    'message_send': '메시지를 전송할 수 없습니다.',
    'session_end': '세션을 종료할 수 없습니다.',
    'report_download': '보고서를 다운로드할 수 없습니다.'
  };

  const userMessage = contextMessages[context] || processedError.message;

      return {
    ...processedError,
    userMessage,
    context,
    chatbotResponse: {
      id: Date.now(),
      text: `죄송합니다. ${userMessage} 잠시 후 다시 시도해주세요.`,
      isUser: false,
      timestamp: new Date(),
      isError: true
    }
  };
};

// ===============================
// 3. 세션 에러 처리
// ===============================

/**
 * 세션 관련 에러 처리
 * @param {Error} error - 에러 객체
 * @param {string} sessionId - 세션 ID
 * @returns {Object} 세션 에러 정보
 */
export const handleSessionError = (error, sessionId) => {
  const processedError = handleApiError(error);
  
  // 세션 특정 에러 처리
  if (processedError.type === 'NOT_FOUND') {
    return {
      ...processedError,
      type: 'INVALID_SESSION',
      message: ERROR_MESSAGES.INVALID_SESSION,
      sessionId,
      shouldResetSession: true
    };
  }

  return {
    ...processedError,
    sessionId,
    shouldResetSession: false
  };
};

// ===============================
// 4. 파일 다운로드 에러 처리
// ===============================

/**
 * 파일 다운로드 에러 처리
 * @param {Error} error - 에러 객체
 * @param {string} filename - 파일명
 * @returns {Object} 다운로드 에러 정보
 */
export const handleDownloadError = (error, filename = '') => {
  const processedError = handleApiError(error);
  
  // 다운로드 특정 에러 메시지
  const downloadMessages = {
    'NETWORK_ERROR': '파일 다운로드 중 네트워크 오류가 발생했습니다.',
    'TIMEOUT_ERROR': '파일 다운로드 시간이 초과되었습니다.',
    'NOT_FOUND': '다운로드할 파일을 찾을 수 없습니다.',
    'SERVER_ERROR': '파일 생성 중 서버 오류가 발생했습니다.'
  };

  const message = downloadMessages[processedError.type] || processedError.message;

  return {
    ...processedError,
    message,
    filename,
    downloadFailed: true
  };
};

// ===============================
// 5. 에러 로깅 및 리포팅
// ===============================

/**
 * 에러 로그 기록
 * @param {Object} errorInfo - 처리된 에러 정보
 * @param {string} component - 에러 발생 컴포넌트
 */
export const logError = (errorInfo, component = 'ChatBot') => {
  const logData = {
    component,
    timestamp: errorInfo.timestamp,
    type: errorInfo.type,
    message: errorInfo.message,
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...errorInfo
  };

  // 개발 환경에서는 콘솔에 상세 로그
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 ${component} Error`);
    console.error('Error Type:', errorInfo.type);
    console.error('Message:', errorInfo.message);
    console.error('Original Error:', errorInfo.originalError);
    console.error('Full Log Data:', logData);
    console.groupEnd();
  }

  // 프로덕션 환경에서는 에러 리포팅 서비스로 전송
  // 예: Sentry, LogRocket, 자체 로깅 시스템 등
  if (process.env.NODE_ENV === 'production') {
    // reportErrorToService(logData);
  }
};

/**
 * 사용자에게 표시할 에러 토스트 메시지 생성
 * @param {Object} errorInfo - 처리된 에러 정보
 * @returns {Object} 토스트 메시지 정보
 */
export const createErrorToast = (errorInfo) => {
  return {
    type: 'error',
    title: '오류 발생',
    message: errorInfo.userMessage || errorInfo.message,
    duration: 5000,
    timestamp: errorInfo.timestamp
  };
};

// ===============================
// 6. 재시도 로직
// ===============================

/**
 * 재시도 가능한 에러인지 확인
 * @param {Object} errorInfo - 처리된 에러 정보
 * @returns {boolean} 재시도 가능 여부
 */
export const isRetryableError = (errorInfo) => {
  const retryableTypes = [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'SERVER_ERROR',
    'SERVICE_UNAVAILABLE'
  ];

  return retryableTypes.includes(errorInfo.type);
};

/**
 * 지수 백오프를 사용한 재시도 함수
 * @param {Function} apiCall - 재시도할 API 호출 함수
 * @param {number} maxRetries - 최대 재시도 횟수
 * @param {number} baseDelay - 기본 지연 시간 (ms)
 * @returns {Promise} API 호출 결과
 */
export const retryWithBackoff = async (apiCall, maxRetries = 3, baseDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = handleApiError(error);
      
      // 마지막 시도이거나 재시도 불가능한 에러인 경우
      if (attempt === maxRetries || !isRetryableError(lastError)) {
        throw lastError;
      }

      // 지수 백오프 지연
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retrying API call in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// ===============================
// 7. 유틸리티 함수
// ===============================

/**
 * 에러 정보를 사용자 친화적인 문자열로 변환
 * @param {Object} errorInfo - 처리된 에러 정보
 * @returns {string} 사용자용 에러 메시지
 */
export const formatErrorForUser = (errorInfo) => {
  if (errorInfo.userMessage) {
    return errorInfo.userMessage;
  }

  switch (errorInfo.type) {
    case 'NETWORK_ERROR':
      return '인터넷 연결을 확인해주세요.';
    case 'TIMEOUT_ERROR':
      return '응답 시간이 초과되었습니다. 다시 시도해주세요.';
    case 'INVALID_SESSION':
      return '세션이 만료되었습니다. 새로 시작해주세요.';
    default:
      return errorInfo.message || '알 수 없는 오류가 발생했습니다.';
  }
};

// 기본 export
export default {
  handleApiError,
  handleChatbotError,
  handleSessionError,
  handleDownloadError,
  logError,
  createErrorToast,
  isRetryableError,
  retryWithBackoff,
  formatErrorForUser
};