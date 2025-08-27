// ===============================
// index.js - 깨끗한 챗봇 통합 파일
// src/components/ui/ChatBot/index.js
// ===============================

// 메인 컴포넌트 export
export { default as DemoChatBot } from './DemoChatBot';

// 기존 ChatBot도 DemoChatBot으로 alias (다른 페이지 호환성)
export { default as ChatBot } from './DemoChatBot';

// 훅 export
export { useDemoChatBot } from './hooks/useDemoChatBot';

// 데이터 export (새 구조)
export { 
  processCategories, 
  processIssues,
  expertCategories,
  getCurrentIssue,
  demoConfig,
  demoApiRequests
} from './data/chatBotDemoData';

// 기본값들
export const DEFAULT_CONFIG = {
  apiBaseUrl: 'http://localhost:8000',
  timeout: 90000,
  demoMode: true
};

export const DEMO_ISSUE_CODE = 'WELD-CURRENT_AND_VIBRATION-ANOMALY';

// 유틸리티 함수들
export const utils = {
  stepToCategoryId: (step) => {
    const mapping = {
      1: 'multi-agent',
      2: 'safety', 
      3: 'technical'
    };
    return mapping[step] || 'multi-agent';
  },

  categoryIdToStep: (categoryId) => {
    const mapping = {
      'multi-agent': 1,
      'safety': 2,
      'technical': 3
    };
    return mapping[categoryId] || 1;
  },
  
  getSeverityColor: (severity) => {
    switch (severity) {
      case '매우높음': return '#dc3545';
      case '높음': return '#fd7e14';
      case '보통': return '#ffc107';
      case '낮음': return '#28a745';
      default: return '#6c757d';
    }
  }
};

// 개발 모드에서 디버그 정보 출력
if (process.env.NODE_ENV === 'development') {
  console.group('🎬 Demo ChatBot Module Loaded');
  console.log('📦 Components:', ['DemoChatBot', 'ChatBot (alias)']);
  console.log('🔧 Hooks:', ['useDemoChatBot']);  
  console.log('📊 Data:', ['processCategories', 'processIssues', 'expertCategories']);
  console.log('🎯 Target Issue:', DEMO_ISSUE_CODE);
  console.log('🔗 API URL:', DEFAULT_CONFIG.apiBaseUrl);
  console.log('🏭 Flow:', 'Process → Issue → Expert → Chat');
  console.groupEnd();
}