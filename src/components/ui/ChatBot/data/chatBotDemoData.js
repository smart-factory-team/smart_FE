// ===============================
// chatBotDemoData.js - 수정된 공정별 구조 (이슈 필터링 적용)
// src/components/ui/ChatBot/data/chatBotDemoData.js
// ===============================

// 공정 카테고리
export const processCategories = [
  {
    id: 'press',
    name: '프레스 공정',
    icon: '🔧',
    description: '프레스 장비의 이상 상황 분석',
    color: '#3b82f6'
  },
  {
    id: 'body',
    name: '차체 공정',
    icon: '🚗',
    description: '차체 용접 및 조립 이상 분석',
    color: '#ef4444'
  },
  {
    id: 'painting',
    name: '도장 공정',
    icon: '🎨',
    description: '도장 품질 및 설비 이상 분석',
    color: '#10b981'
  },
  {
    id: 'assembly',
    name: '의장 조립',
    icon: '⚙️',
    description: '의장 조립 라인 이상 분석',
    color: '#f59e0b'
  }
];

// 공정별 이슈 목록 - 차체 공정에서 용접 전류+진동 복합 이상만 표시
export const processIssues = {
  press: [
    {
      id: "PRESS-HYDRAULIC-ANOMALY",
      name: "유압 시스템 이상",
      severity: "높음",
      time: "10분 전"
    },
    {
      id: "PRESS-VIBRATION-HIGH",
      name: "진동 수치 초과",
      severity: "보통",
      time: "15분 전"
    }
  ],
  body: [
    // 🎯 시연용으로 용접 전류+진동 복합 이상만 남김
    {
      id: "WELD-CURRENT_AND_VIBRATION-ANOMALY",
      name: "용접 전류+진동 복합 이상",
      severity: "매우높음",
      time: "방금 전",
      description: "용접 과정에서 전류와 진동이 동시에 비정상적으로 감지되는 복합적 문제상황",
      location: "차체 공정 - 로봇 용접기 #3",
      urgency: "즉시 대응 필요"
    }
    // 다른 이슈들은 제거 (시연용)
  ],
  painting: [
    {
      id: "PAINT-PRESSURE-LOW",
      name: "도장 압력 부족",
      severity: "높음",
      time: "8분 전"
    },
    {
      id: "PAINT-QUALITY-DEFECT",
      name: "도장 품질 불량",
      severity: "보통",
      time: "20분 전"
    }
  ],
  assembly: [
    {
      id: "ASSEMBLY-TORQUE-ERROR",
      name: "체결 토크 오차",
      severity: "높음",
      time: "3분 전"
    },
    {
      id: "ASSEMBLY-PART-MISSING",
      name: "부품 누락 감지",
      severity: "매우높음",
      time: "7분 전"
    }
  ]
};

// 전문가 카테고리
export const expertCategories = [
  {
    id: 'multi-agent',
    name: '통합 문의',
    icon: '🎯',
    description: '여러 AI 전문가가 협업하여 종합적으로 분석합니다.',
    apiEndpoint: '/chat/test',
    color: '#667eea',
    features: ['Multi-Agent 협업', '종합 분석', '즉시 조치사항']
  },
  {
    id: 'safety',
    name: '안전 문의',
    icon: '🛡️',
    description: '작업자 안전과 관련된 가이드라인을 제공합니다.',
    apiEndpoint: '/api/gpt',
    color: '#28a745',
    features: ['안전 가이드라인', '개인보호장비', '작업 절차']
  },
  {
    id: 'technical',
    name: '기술 문의',
    icon: '⚙️',
    description: '기술적 문제를 상세히 분석하고 해결방안을 제시합니다.',
    apiEndpoint: '/api/gemini',
    color: '#dc3545',
    features: ['기술 분석', '설비 매뉴얼', '정비 가이드']
  }
];

// 현재 선택된 이슈 (동적으로 변경될 수 있음)
export const getCurrentIssue = (issueId) => {
  // 모든 공정에서 이슈 찾기
  for (const [processId, issues] of Object.entries(processIssues)) {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      return {
        ...issue,
        process: processCategories.find(p => p.id === processId)?.name || '알 수 없는 공정',
        location: `${processCategories.find(p => p.id === processId)?.name} - 설비 #1`,
        urgency: issue.severity === '매우높음' ? '즉시 대응 필요' : 
                issue.severity === '높음' ? '신속 대응 필요' : '점검 필요',
        detectedTime: new Date().toLocaleString('ko-KR'),
        description: `${issue.name} 문제가 감지되었습니다.`
      };
    }
  }
  
  // 기본값 (WELD-CURRENT_AND_VIBRATION-ANOMALY)
  return {
    id: "WELD-CURRENT_AND_VIBRATION-ANOMALY",
    name: "용접 전류+진동 복합 이상",
    severity: "매우높음",
    process: "차체 공정",
    location: "차체 공정 - 로봇 용접기 #3",
    urgency: "즉시 대응 필요",
    detectedTime: new Date().toLocaleString('ko-KR'),
    description: "용접 과정에서 전류와 진동이 동시에 비정상적으로 감지되는 복합적 문제상황"
  };
};

// 시연 설정
export const demoConfig = {
  apiBaseUrl: 'http://localhost:8000',
  timeout: 90000,
  retryAttempts: 2,
  showTypingEffect: true,
  typingSpeed: 50,
  autoScroll: true,
  enableSoundEffects: false,
  demoMode: true,
  version: '1.0.0-demo'
};

// API 요청 템플릿
export const demoApiRequests = {
  'multi-agent': {
    endpoint: '/chat/test',
    method: 'POST',
    payload: (sessionId, message, issueId) => ({
      user_message: message,
      issue_code: issueId,
      session_id: sessionId,
      user_id: "demo_user_001"
    })
  },
  'safety': {
    endpoint: '/api/gpt',
    method: 'POST', 
    payload: (sessionId, message) => ({
      message: message,
      session_id: sessionId
    })
  },
  'technical': {
    endpoint: '/api/gemini',
    method: 'POST',
    payload: (sessionId, message) => ({
      message: message,
      session_id: sessionId
    })
  }
};

// 기존 호환성을 위한 export들
export const demoCategories = expertCategories; // 기존 코드 호환성
export const demoIssue = getCurrentIssue("WELD-CURRENT_AND_VIBRATION-ANOMALY");

// 기존 export들 (사용되지 않지만 호환성 유지)
export const demoScenarios = {};
export const demoFlow = [];

// default export를 변수로 할당
const demoDataDefault = {
  processCategories,
  processIssues,
  expertCategories,
  getCurrentIssue,
  demoConfig,
  demoApiRequests,
  demoCategories,
  demoIssue,
  demoScenarios,
  demoFlow
};

export default demoDataDefault;