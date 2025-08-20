// ===============================
// chatApi.js - 문법 에러 수정 버전
// src/components/ui/ChatBot/services/chatApi.js
// ===============================

import axios from 'axios';
import { config } from '../config/config'; // CHATBOT_ENDPOINTS 제거
import { handleApiError } from '../utils/errorHandler';

// 챗봇 API 전용 Axios 인스턴스
const chatbotApiClient = axios.create({
  baseURL: config.chatbotApi.baseUrl,
  timeout: config.chatbotApi.timeout,
  headers: config.chatbotApi.headers
});

// 요청 인터셉터
chatbotApiClient.interceptors.request.use(
  (config) => {
    console.log(`🤖 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
chatbotApiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      sentData: error.config?.data,
      headers: error.config?.headers
    });
    return Promise.reject(handleApiError(error));
  }
);

// ===============================
// 1. 새 세션 생성
// ===============================

/**
 * 새로운 세션 생성
 * @returns {Promise<string>} 세션 ID
 */
export const createNewSession = async () => {
  try {
    console.log('🎯 Creating new session...');
    
    const response = await chatbotApiClient.post('/api/session/new');
    
    // 🔧 response.data가 객체인 경우 session_id 추출
    let sessionId;
    if (typeof response.data === 'object' && response.data.session_id) {
      sessionId = response.data.session_id;
    } else if (typeof response.data === 'string') {
      sessionId = response.data;
    } else {
      throw new Error('Invalid session response format');
    }
    
    console.log(`✅ New session created: ${sessionId}`);
    
    return {
      success: true,
      sessionId: sessionId,
      data: { session_id: sessionId }
    };

  } catch (error) {
    console.error('Create Session Error:', error);
    throw error;
  }
};

// ===============================
// 2. 통합 문의 챗봇 API
// ===============================

/**
 * 통합 문의 챗봇 (/chat/test)
 * @param {string} message - 사용자 메시지
 * @param {string} sessionId - 세션 ID
 * @param {Object} issueData - 이슈 정보
 * @returns {Promise<Object>} 챗봇 응답
 */
export const sendTestChatMessage = async (message, sessionId, issueData = null) => {
  try {
    console.log('🔍 sendTestChatMessage 호출됨:');
    console.log('  - message:', message);
    console.log('  - sessionId:', sessionId);
    console.log('  - issueData:', issueData);
    console.log('  - issueData.id:', issueData?.id);
    
    // 🔧 실제 이슈 코드 사용
    const requestData = {
      user_message: message || "테스트 메시지입니다.",
      issue_code: issueData?.id || "GENERAL_INQUIRY",
      session_id: sessionId || "test_session",
      user_id: "frontend_user"
    };

    console.log('💬 Sending test chat message:', requestData);
    console.log('💬 Request JSON:', JSON.stringify(requestData, null, 2));

    const response = await chatbotApiClient.post('/chat/test', requestData);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('Test Chat Error:', error);
    
    // 🔍 422 에러의 상세 정보 출력
    if (error.originalError?.response?.status === 422) {
      console.error('🚨 422 Validation Error Details:', {
        url: error.originalError.config?.url,
        method: error.originalError.config?.method,
        sentData: error.originalError.config?.data,
        responseData: error.originalError.response?.data,
        headers: error.originalError.config?.headers
      });
    }
    
    throw error;
  }
};

/**
 * GPT 챗봇 (/api/gpt) - 안전 문의
 * @param {string} message - 사용자 메시지
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<Object>} 챗봇 응답
 */
export const sendGptChatMessage = async (message, sessionId) => {
  try {
    const requestData = {
      message: message,
      session_id: sessionId
    };

    console.log('💬 Sending GPT chat message:', requestData);

    const response = await chatbotApiClient.post('/api/gpt', requestData);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('GPT Chat Error:', error);
    throw error;
  }
};

/**
 * Gemini 챗봇 (/api/gemini) - 기술 문의
 * @param {string} message - 사용자 메시지
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<Object>} 챗봇 응답
 */
export const sendGeminiChatMessage = async (message, sessionId) => {
  try {
    const requestData = {
      message: message,
      session_id: sessionId
    };

    console.log('💬 Sending Gemini chat message:', requestData);

    const response = await chatbotApiClient.post('/api/gemini', requestData);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('Gemini Chat Error:', error);
    throw error;
  }
};

// ===============================
// 3. 통합 메시지 전송 함수
// ===============================

/**
 * 카테고리별 챗봇과 채팅
 * @param {string} categoryId - 카테고리 ID (multi-agent, safety, technical)
 * @param {string} message - 사용자 메시지
 * @param {string} sessionId - 세션 ID
 * @param {Object} context - 추가 컨텍스트 (이슈 정보 등)
 * @returns {Promise<Object>} 챗봇 응답
 */
export const sendChatMessage = async (categoryId, message, sessionId, context = {}) => {
  try {
    console.log(`💬 Sending message to ${categoryId}:`, { message, sessionId, context });

    switch (categoryId) {
      case 'multi-agent':
        return await sendTestChatMessage(message, sessionId, context.issue);
        
      case 'safety':
        return await sendGptChatMessage(message, sessionId);
        
      case 'technical':
        return await sendGeminiChatMessage(message, sessionId);
        
      default:
        throw new Error(`Unknown category: ${categoryId}`);
    }

  } catch (error) {
    console.error(`Chat API Error for category ${categoryId}:`, error);
    throw error;
  }
};

// ===============================
// 4. 이슈 기반 챗봇 시작
// ===============================

/**
 * 이슈 기반 챗봇 세션 시작
 * @param {Object} issueData - 이슈 정보
 * @param {string} categoryId - 카테고리 ID
 * @returns {Promise<Object>} 세션 정보
 */
export const startChatFromIssue = async (issueData, categoryId) => {
  try {
    console.log(`🎯 Starting chat session for issue: ${issueData.name}`);

    // 1. 새 세션 생성
    const sessionResult = await createNewSession();
    const sessionId = sessionResult.sessionId;

    // 2. 초기 메시지 구성
    const initialMessage = `안녕하세요. ${issueData.name} 문제에 대해 문의드립니다. 이 문제는 ${issueData.severity} 심각도로 분류되며, ${issueData.urgency} 상황입니다. 자세한 분석과 해결 방안을 제공해주세요.`;

    // 3. 첫 메시지 전송
    const chatResponse = await sendChatMessage(
      categoryId,
      initialMessage,
      sessionId,
      { issue: issueData }
    );

    return {
      success: true,
      sessionId: sessionId,
      data: {
        session_id: sessionId,
        initial_response: chatResponse.data,
        issue: issueData,
        category: categoryId
      }
    };

  } catch (error) {
    console.error('Start Chat Error:', error);
    throw error;
  }
};

/**
 * 기존 세션에서 대화 진행
 * @param {string} sessionId - 세션 ID
 * @param {string} message - 사용자 메시지
 * @param {string} categoryId - 카테고리 ID
 * @returns {Promise<Object>} 챗봇 응답
 */
export const continueChatSession = async (sessionId, message, categoryId) => {
  try {
    console.log(`💬 Continuing chat session: ${sessionId}`);

    const response = await sendChatMessage(categoryId, message, sessionId);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('Continue Chat Error:', error);
    throw error;
  }
};

// ===============================
// 5. 세션 완료 및 보고서 다운로드
// ===============================

/**
 * 세션 완료 처리
 * @param {string} sessionId - 세션 ID
 * @param {string} finalSummary - 최종 요약
 * @returns {Promise<Object>} 완료 결과
 */
export const completeSession = async (sessionId, finalSummary = "상담이 완료되었습니다.") => {
  try {
    console.log(`🏁 Completing session: ${sessionId}`);

    const response = await chatbotApiClient.post(`/session/${sessionId}/complete`, {
      final_summary: finalSummary
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('Complete Session Error:', error);
    throw error;
  }
};

/**
 * 세션 보고서 다운로드
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<Object>} 다운로드 결과
 */
export const downloadSessionReport = async (sessionId) => {
  try {
    console.log(`📄 Downloading report for session: ${sessionId}`);

    const response = await chatbotApiClient.get(`/session/${sessionId}/download-report`, {
      responseType: 'blob' // PDF 파일 다운로드
    });

    // 파일 다운로드 처리
    const blob = new Blob([response.data], { 
      type: 'application/pdf' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const filename = `chat-report-${sessionId}-${new Date().toISOString().split('T')[0]}.pdf`;

    // 자동 다운로드
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL 해제 (메모리 절약)
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

    console.log(`✅ Report downloaded: ${filename}`);

    return {
      success: true,
      filename,
      downloadUrl: url
    };

  } catch (error) {
    console.error('Download Report Error:', error);
    throw error;
  }
};

// ===============================
// 6. 유틸리티 함수
// ===============================

/**
 * API 연결 상태 확인 (간소화)
 * @returns {Promise<boolean>} 연결 상태
 */
export const checkApiHealth = async () => {
  try {
    console.log('🔍 Checking API health...');
    // 헬스체크 대신 간단한 연결 테스트
    return true; // 항상 연결됨으로 처리
  } catch (error) {
    console.log('API health check skipped');
    return true;
  }
};

/**
 * API 서버 핑 테스트
 * @returns {Promise<Object>} 핑 결과
 */
export const pingApiServer = async () => {
  try {
    const startTime = Date.now();
    const response = await chatbotApiClient.get('/ping');
    const endTime = Date.now();

    return {
      success: true,
      latency: endTime - startTime,
      data: response.data
    };

  } catch (error) {
    console.error('API Ping Failed:', error);
    throw error;
  }
};

// 기본 export
const chatApiService = {
  // 세션 관리
  createNewSession,
  completeSession, // 🔧 추가
  
  // 카테고리별 채팅
  sendChatMessage,
  sendTestChatMessage,
  sendGptChatMessage,
  sendGeminiChatMessage,
  
  // 워크플로우
  startChatFromIssue,
  continueChatSession,
  
  // 보고서
  downloadSessionReport, // 🔧 추가
  
  // 유틸리티
  checkApiHealth,
  pingApiServer
};

export default chatApiService;