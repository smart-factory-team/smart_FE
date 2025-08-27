// ===============================
// chatApiDemoService.js - 시연용 챗봇 API 서비스 (대화 종료 기능 추가)
// src/components/ui/ChatBot/services/chatApiDemoService.js
// ===============================

import axios from 'axios';
import { demoConfig, demoApiRequests, demoIssue } from '../data/chatBotDemoData';

// 시연용 API 클라이언트
const demoApiClient = axios.create({
  baseURL: demoConfig.apiBaseUrl,
  timeout: demoConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 요청 인터셉터 (시연용 로깅)
demoApiClient.interceptors.request.use(
  (config) => {
    console.group('🎬 Demo API Request');
    console.log('🎯 Endpoint:', `${config.baseURL}${config.url}`);
    console.log('📤 Method:', config.method?.toUpperCase());
    console.log('📊 Payload:', config.data);
    console.log('⏰ Timestamp:', new Date().toLocaleTimeString());
    console.groupEnd();
    return config;
  },
  (error) => {
    console.error('❌ Demo Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (시연용 로깅)
demoApiClient.interceptors.response.use(
  (response) => {
    console.group('🎬 Demo API Response');
    console.log('✅ Status:', response.status);
    console.log('📥 Data:', response.data);
    console.log('⏱️ Duration:', Date.now() - response.config.metadata?.startTime || 'N/A');
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group('🎬 Demo API Error');
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Message:', error.response?.data || error.message);
    console.error('🔍 URL:', error.config?.url);
    console.groupEnd();
    return Promise.reject(error);
  }
);

// ===============================
// 1. 세션 관리
// ===============================

/**
 * 시연용 새 세션 생성
 * @returns {Promise<string>} 세션 ID
 */
export const createDemoSession = async () => {
  try {
    console.log('🎬 Creating demo session...');
    
    const response = await demoApiClient.post('/api/session/new');
    
    let sessionId;
    if (typeof response.data === 'object' && response.data.session_id) {
      sessionId = response.data.session_id;
    } else if (typeof response.data === 'string') {
      sessionId = response.data;
    } else {
      throw new Error('Invalid session response format');
    }
    
    console.log('✅ Demo session created:', sessionId);
    
    return {
      success: true,
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Demo session creation failed:', error);
    throw {
      success: false,
      error: error.message,
      type: 'SESSION_CREATE_ERROR'
    };
  }
};

// ===============================
// 2. 카테고리별 API 호출
// ===============================

/**
 * 통합 문의 API 호출 (Multi-Agent)
 * @param {string} sessionId - 세션 ID
 * @param {string} message - 사용자 메시지
 * @returns {Promise<Object>} API 응답
 */
export const callMultiAgentApi = async (sessionId, message = null) => {
  try {
    console.log('🎯 Calling Multi-Agent API for demo...');
    
    const payload = demoApiRequests['multi-agent'].payload(sessionId, message);
    const response = await demoApiClient.post('/chat/test', payload);
    
    return {
      success: true,
      data: response.data,
      category: 'multi-agent',
      endpoint: '/chat/test',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Multi-Agent API call failed:', error);
    throw {
      success: false,
      error: error.message,
      category: 'multi-agent',
      type: 'API_CALL_ERROR'
    };
  }
};

/**
 * 안전 문의 API 호출 (GPT)
 * @param {string} sessionId - 세션 ID  
 * @param {string} message - 사용자 메시지
 * @returns {Promise<Object>} API 응답
 */
export const callSafetyApi = async (sessionId, message = null) => {
  try {
    console.log('🛡️ Calling Safety API for demo...');
    
    const payload = demoApiRequests['safety'].payload(sessionId, message);
    const response = await demoApiClient.post('/api/gpt', payload);
    
    return {
      success: true,
      data: response.data,
      category: 'safety',
      endpoint: '/api/gpt',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Safety API call failed:', error);
    throw {
      success: false,
      error: error.message,
      category: 'safety',
      type: 'API_CALL_ERROR'
    };
  }
};

/**
 * 기술 문의 API 호출 (Gemini)
 * @param {string} sessionId - 세션 ID
 * @param {string} message - 사용자 메시지  
 * @returns {Promise<Object>} API 응답
 */
export const callTechnicalApi = async (sessionId, message = null) => {
  try {
    console.log('⚙️ Calling Technical API for demo...');
    
    const payload = demoApiRequests['technical'].payload(sessionId, message);
    const response = await demoApiClient.post('/api/gemini', payload);
    
    return {
      success: true,
      data: response.data,
      category: 'technical',
      endpoint: '/api/gemini',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Technical API call failed:', error);
    throw {
      success: false,
      error: error.message,
      category: 'technical',
      type: 'API_CALL_ERROR'
    };
  }
};

// ===============================
// 3. 통합 API 호출 함수
// ===============================

/**
 * 카테고리별 API 호출 (통합)
 * @param {string} categoryId - 카테고리 ID
 * @param {string} sessionId - 세션 ID
 * @param {string} message - 사용자 메시지
 * @returns {Promise<Object>} API 응답
 */
export const callDemoChatApi = async (categoryId, sessionId, message = null) => {
  try {
    console.log(`🎬 Demo API Call: ${categoryId}`);
    
    switch (categoryId) {
      case 'multi-agent':
        return await callMultiAgentApi(sessionId, message);
        
      case 'safety':
        return await callSafetyApi(sessionId, message);
        
      case 'technical':
        return await callTechnicalApi(sessionId, message);
        
      default:
        throw new Error(`Unknown category: ${categoryId}`);
    }

  } catch (error) {
    console.error(`❌ Demo API call failed for ${categoryId}:`, error);
    throw error;
  }
};

// ===============================
// 🔧 4. 대화 종료 및 보고서 다운로드 기능 (NEW)
// ===============================

/**
 * 챗봇 대화 완료 처리
 * @param {string} sessionId - 세션 ID
 * @param {string} finalSummary - 최종 요약 (선택사항)
 * @returns {Promise<Object>} API 응답
 */
export const completeChatSession = async (sessionId, finalSummary = null) => {
  try {
    console.log('🔚 Completing chat session:', sessionId);
    
    const payload = {
      session_id: sessionId,
      final_summary: finalSummary || "사용자가 대화를 정상 종료함"
    };
    
    const response = await demoApiClient.post('/api/chatbot-workflow/complete-chat', payload);
    
    return {
      success: true,
      data: response.data,
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Chat completion failed:', error);
    
    // 에러 타입별 처리
    if (error.code === 'ECONNABORTED') {
      throw {
        success: false,
        error: '요청 시간이 초과되었습니다.',
        type: 'TIMEOUT_ERROR',
        isRetryable: true
      };
    }
    
    if (!error.response) {
      throw {
        success: false,
        error: '서버에 연결할 수 없습니다.',
        type: 'NETWORK_ERROR',
        isRetryable: true
      };
    }
    
    const status = error.response.status;
    switch (status) {
      case 400:
        throw {
          success: false,
          error: '잘못된 요청입니다. 세션 정보를 확인해주세요.',
          type: 'BAD_REQUEST',
          isRetryable: false,
          details: error.response.data
        };
      case 404:
        throw {
          success: false,
          error: '세션을 찾을 수 없습니다.',
          type: 'SESSION_NOT_FOUND',
          isRetryable: false
        };
      case 500:
        throw {
          success: false,
          error: '서버 내부 오류가 발생했습니다.',
          type: 'SERVER_ERROR',
          isRetryable: true
        };
      default:
        throw {
          success: false,
          error: `알 수 없는 오류가 발생했습니다 (${status}).`,
          type: 'UNKNOWN_ERROR',
          isRetryable: true
        };
    }
  }
};

/**
 * 세션 보고서 다운로드
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<Object>} 다운로드 정보
 */
export const downloadSessionReport = async (sessionId) => {
  try {
    console.log('📄 Downloading report for session:', sessionId);
    
    const response = await demoApiClient.get(`/api/chatbot-workflow/download-report/${sessionId}`, {
      responseType: 'blob', // 파일 다운로드를 위한 blob 타입
      timeout: 60000 // 보고서 생성 시간 고려하여 타임아웃 연장
    });
    
    // Blob URL 생성
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/pdf' 
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // 파일명 추출 (Content-Disposition 헤더에서)
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `session_${sessionId}_report.pdf`;
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/['"]/g, '');
      }
    }
    
    return {
      success: true,
      downloadUrl: downloadUrl,
      fileName: fileName,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      fileSize: blob.size
    };

  } catch (error) {
    console.error('❌ Report download failed:', error);
    
    // 에러 타입별 처리
    if (error.code === 'ECONNABORTED') {
      throw {
        success: false,
        error: '보고서 다운로드 시간이 초과되었습니다.',
        type: 'DOWNLOAD_TIMEOUT',
        isRetryable: true
      };
    }
    
    if (!error.response) {
      throw {
        success: false,
        error: '서버에 연결할 수 없습니다.',
        type: 'NETWORK_ERROR',
        isRetryable: true
      };
    }
    
    const status = error.response.status;
    switch (status) {
      case 404:
        throw {
          success: false,
          error: '보고서를 찾을 수 없습니다. 세션이 완료되었는지 확인해주세요.',
          type: 'REPORT_NOT_FOUND',
          isRetryable: false
        };
      case 400:
        throw {
          success: false,
          error: '잘못된 세션 ID입니다.',
          type: 'INVALID_SESSION',
          isRetryable: false
        };
      case 500:
        throw {
          success: false,
          error: '보고서 생성 중 오류가 발생했습니다.',
          type: 'REPORT_GENERATION_ERROR',
          isRetryable: true
        };
      default:
        throw {
          success: false,
          error: `보고서 다운로드 실패 (${status}).`,
          type: 'DOWNLOAD_ERROR',
          isRetryable: true
        };
    }
  }
};

/**
 * 브라우저에서 파일 다운로드 실행
 * @param {string} downloadUrl - 다운로드 URL
 * @param {string} fileName - 파일명
 */
export const triggerFileDownload = (downloadUrl, fileName) => {
  try {
    // 임시 링크 엘리먼트 생성
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    // DOM에 추가하고 클릭 트리거
    document.body.appendChild(link);
    link.click();
    
    // 정리
    document.body.removeChild(link);
    
    // Blob URL 해제 (메모리 정리)
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);
    
    console.log('✅ File download triggered:', fileName);
    return true;
    
  } catch (error) {
    console.error('❌ File download trigger failed:', error);
    return false;
  }
};

/**
 * 대화 종료부터 보고서 다운로드까지 전체 워크플로우
 * @param {string} sessionId - 세션 ID
 * @param {string} finalSummary - 최종 요약 (선택사항)
 * @param {Function} onProgress - 진행상황 콜백
 * @returns {Promise<Object>} 워크플로우 결과
 */
export const completeSessionWorkflow = async (sessionId, finalSummary = null, onProgress = null) => {
  try {
    // 1단계: 대화 종료
    onProgress?.({ step: 1, message: '대화를 종료하고 있습니다...', progress: 20 });
    const completionResult = await completeChatSession(sessionId, finalSummary);
    
    if (!completionResult.success) {
      throw completionResult;
    }
    
    // 2단계: 보고서 생성 대기 (서버에서 처리 시간 필요)
    onProgress?.({ step: 2, message: '보고서를 생성하고 있습니다...', progress: 50 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
    
    // 3단계: 보고서 다운로드
    onProgress?.({ step: 3, message: '보고서를 다운로드하고 있습니다...', progress: 80 });
    const downloadResult = await downloadSessionReport(sessionId);
    
    if (!downloadResult.success) {
      throw downloadResult;
    }
    
    // 4단계: 파일 다운로드 실행
    onProgress?.({ step: 4, message: '파일을 저장하고 있습니다...', progress: 90 });
    const downloadTriggered = triggerFileDownload(downloadResult.downloadUrl, downloadResult.fileName);
    
    if (!downloadTriggered) {
      throw {
        success: false,
        error: '파일 다운로드를 실행할 수 없습니다.',
        type: 'DOWNLOAD_TRIGGER_ERROR'
      };
    }
    
    // 완료
    onProgress?.({ step: 5, message: '완료되었습니다!', progress: 100 });
    
    return {
      success: true,
      completionResult,
      downloadResult,
      message: '대화가 성공적으로 종료되고 보고서가 다운로드되었습니다.'
    };
    
  } catch (error) {
    console.error('❌ Session workflow failed:', error);
    throw error;
  }
};

// ===============================
// 5. 시연용 헬퍼 함수들 (기존)
// ===============================

/**
 * API 연결 상태 확인 (시연용)
 * @returns {Promise<boolean>} 연결 상태
 */
export const checkDemoApiHealth = async () => {
  try {
    console.log('🔍 Checking demo API health...');
    
    // 간단한 헬스체크 - 세션 생성으로 대체
    const sessionResult = await createDemoSession();
    return sessionResult.success;
    
  } catch (error) {
    console.error('❌ Demo API health check failed:', error);
    return false;
  }
};

/**
 * 시연용 응답 포맷팅
 * @param {Object} apiResponse - API 응답 데이터
 * @param {string} categoryId - 카테고리 ID
 * @returns {Object} 포맷팅된 응답
 */
export const formatDemoResponse = (apiResponse, categoryId) => {
  try {
    const data = apiResponse.data;
    
    // Multi-Agent 응답 포맷팅
    if (categoryId === 'multi-agent' && data.executive_summary) {
      return {
        type: 'multi-agent',
        summary: data.executive_summary,
        immediateActions: data.immediate_actions || [],
        detailedSolution: data.detailed_solution || [],
        safetyPrecautions: data.safety_precautions || [],
        costEstimation: data.cost_estimation || {},
        confidenceLevel: data.confidence_level,
        participatingAgents: data.participating_agents || [],
        processingTime: data.processing_time,
        timestamp: data.timestamp
      };
    }
    
    // GPT/Gemini 응답 포맷팅
    if (data.response) {
      return {
        type: categoryId,
        response: data.response,
        agentName: data.agent_name,
        timestamp: data.timestamp
      };
    }
    
    return {
      type: 'raw',
      data: data
    };
    
  } catch (error) {
    console.error('❌ Response formatting failed:', error);
    return {
      type: 'error',
      message: 'Response formatting failed',
      originalData: apiResponse
    };
  }
};

/**
 * 시연용 에러 핸들링
 * @param {Error} error - 에러 객체
 * @param {string} context - 에러 발생 컨텍스트
 * @returns {Object} 처리된 에러 정보
 */
export const handleDemoApiError = (error, context) => {
  console.group('🚨 Demo API Error Handler');
  console.error('Context:', context);
  console.error('Error:', error);
  console.groupEnd();
  
  // 네트워크 에러
  if (!error.response) {
    return {
      type: 'NETWORK_ERROR',
      message: '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.',
      isRetryable: true,
      context
    };
  }
  
  // HTTP 상태 에러
  const status = error.response?.status;
  switch (status) {
    case 400:
      return {
        type: 'BAD_REQUEST',
        message: '잘못된 요청입니다. 입력 데이터를 확인해주세요.',
        isRetryable: false,
        context
      };
    case 422:
      return {
        type: 'VALIDATION_ERROR',
        message: '입력 데이터 검증에 실패했습니다.',
        details: error.response?.data,
        isRetryable: false,
        context
      };
    case 500:
      return {
        type: 'SERVER_ERROR',
        message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        isRetryable: true,
        context
      };
    default:
      return {
        type: 'UNKNOWN_ERROR',
        message: `알 수 없는 오류가 발생했습니다 (${status}).`,
        isRetryable: true,
        context
      };
  }
};

// 기본 export
const demoApiService = {
  createDemoSession,
  callMultiAgentApi,
  callSafetyApi,
  callTechnicalApi,
  callDemoChatApi,
  checkDemoApiHealth,
  formatDemoResponse,
  handleDemoApiError,
  // 🔧 새로 추가된 대화 종료 관련 함수들
  completeChatSession,
  downloadSessionReport,
  triggerFileDownload,
  completeSessionWorkflow
};

export default demoApiService;