// ===============================
// reportApi.js - 보고서 API 서비스  
// src/components/ui/ChatBot/services/reportApi.js
// ===============================

import axios from 'axios';
import { 
  config,
  CHATBOT_ENDPOINTS
} from '../config/config';
import { handleApiError } from '../utils/errorHandler';

// 📄 보고서 전용 Axios 인스턴스 (챗봇 서버)
const reportClient = axios.create({
  baseURL: config.chatbotApi.baseUrl,
  timeout: 60000, // 보고서는 시간이 더 걸릴 수 있으므로 60초
  headers: config.chatbotApi.headers
});

// 응답 인터셉터
reportClient.interceptors.response.use(
  (response) => {
    console.log(`📄 Report API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Report API Error:', error);
    return Promise.reject(handleApiError(error));
  }
);

// ===============================
// 1. 보고서 다운로드 API
// ===============================

/**
 * 세션 보고서 다운로드
 * @param {string} sessionId - 세션 ID
 * @param {Object} options - 다운로드 옵션
 * @returns {Promise<Object>} 다운로드 결과
 */
export const downloadChatReport = async (sessionId, options = {}) => {
  try {
    console.log(`📥 Downloading report for session: ${sessionId}`);

    const response = await reportClient.get(
      CHATBOT_ENDPOINTS.WORKFLOW.DOWNLOAD_REPORT(sessionId),
      {
        responseType: 'blob', // 파일 다운로드를 위한 blob 타입
        ...options
      }
    );

    // 파일 다운로드 처리
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/pdf' 
    });
    
    const url = window.URL.createObjectURL(blob);
    
    // 파일명 추출 (Content-Disposition 헤더에서)
    const contentDisposition = response.headers['content-disposition'];
    let filename = `chat-report-${sessionId}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    return {
      success: true,
      downloadUrl: url,
      filename,
      size: blob.size,
      type: blob.type,
      sessionId
    };

  } catch (error) {
    console.error('Download Report Error:', error);
    throw error;
  }
};

/**
 * 브라우저에서 파일 다운로드 실행
 * @param {string} downloadUrl - 다운로드 URL
 * @param {string} filename - 파일명
 */
export const triggerFileDownload = (downloadUrl, filename) => {
  try {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL 해제 (메모리 절약)
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);

    console.log(`✅ File download triggered: ${filename}`);

  } catch (error) {
    console.error('File Download Error:', error);
    throw error;
  }
};

/**
 * 세션 보고서 다운로드 및 자동 저장
 * @param {string} sessionId - 세션 ID
 * @param {Object} options - 다운로드 옵션
 * @returns {Promise<Object>} 다운로드 결과
 */
export const downloadAndSaveReport = async (sessionId, options = {}) => {
  try {
    // 1. 보고서 다운로드
    const downloadResult = await downloadChatReport(sessionId, options);
    
    // 2. 자동으로 파일 저장 트리거
    triggerFileDownload(downloadResult.downloadUrl, downloadResult.filename);
    
    return {
      ...downloadResult,
      downloaded: true,
      downloadedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Download and Save Report Error:', error);
    throw error;
  }
};

// ===============================
// 2. 보고서 건너뛰기 API
// ===============================

/**
 * 보고서 다운로드 건너뛰기
 * @param {string} sessionId - 세션 ID
 * @param {string} reason - 건너뛰는 이유 (선택사항)
 * @returns {Promise<Object>} 건너뛰기 결과
 */
export const skipReportDownload = async (sessionId, reason = '') => {
  try {
    console.log(`⏭️ Skipping report download for session: ${sessionId}`);

    const response = await reportClient.post(
      CHATBOT_ENDPOINTS.WORKFLOW.SKIP_REPORT(sessionId),
      {
        reason,
        timestamp: new Date().toISOString()
      }
    );

    return {
      success: true,
      data: response.data,
      sessionId,
      skippedAt: new Date().toISOString(),
      reason
    };

  } catch (error) {
    console.error('Skip Report Error:', error);
    throw error;
  }
};

// ===============================
// 3. 보고서 상태 확인 API
// ===============================

/**
 * 보고서 생성 상태 확인
 * @param {string} sessionId - 세션 ID
 * @returns {Promise<Object>} 보고서 상태
 */
export const checkReportStatus = async (sessionId) => {
  try {
    const response = await reportClient.get(
      CHATBOT_ENDPOINTS.WORKFLOW.SESSION_STATUS(sessionId)
    );

    const reportStatus = {
      available: false,
      generating: false,
      error: false,
      ...response.data.report_status
    };

    return {
      success: true,
      reportStatus,
      sessionId
    };

  } catch (error) {
    console.error('Check Report Status Error:', error);
    throw error;
  }
};

// ===============================
// 4. 유틸리티 함수
// ===============================

/**
 * 보고서 파일 크기를 사람이 읽기 쉬운 형태로 변환
 * @param {number} bytes - 바이트 크기
 * @returns {string} 읽기 쉬운 크기
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 보고서 다운로드 진행률 추적
 * @param {string} sessionId - 세션 ID
 * @param {Function} onProgress - 진행률 콜백
 * @returns {Promise<Object>} 다운로드 결과
 */
export const downloadReportWithProgress = async (sessionId, onProgress) => {
  try {
    const response = await reportClient.get(
      CHATBOT_ENDPOINTS.WORKFLOW.DOWNLOAD_REPORT(sessionId),
      {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable && onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted, progressEvent.loaded, progressEvent.total);
          }
        }
      }
    );

    // 나머지는 기본 다운로드와 동일
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/pdf' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const contentDisposition = response.headers['content-disposition'];
    let filename = `chat-report-${sessionId}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    return {
      success: true,
      downloadUrl: url,
      filename,
      size: blob.size,
      type: blob.type,
      sessionId
    };

  } catch (error) {
    console.error('Download Report with Progress Error:', error);
    throw error;
  }
};

// 기본 export
const reportApiService = {
  downloadChatReport,
  triggerFileDownload,
  downloadAndSaveReport,
  skipReportDownload,
  checkReportStatus,
  formatFileSize,
  downloadReportWithProgress
};

export default reportApiService;