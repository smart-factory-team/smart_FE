// 카테고리 정보
export const categories = [
  {
    id: 'multi-agent',
    name: '통합 문의',
    icon: '🎯',
    description: '복합적인 설비 이슈를 다양한 AI 전문가가 협업하여 해결합니다.',
    endpoint: '/chat',
    requiresApiKey: true
  },
  {
    id: 'safety',
    name: '안전 문의',
    icon: '🛡️',
    description: '안전 관련 문의사항을 GPT 기반 전문가가 답변해드립니다.',
    endpoint: '/api/gpt',
    requiresApiKey: false
  },
  {
    id: 'technical',
    name: '기술 문의',
    icon: '⚙️',
    description: '기술적 문제를 Gemini 기반 전문가가 상세히 분석해드립니다.',
    endpoint: '/api/gemini',
    requiresApiKey: false
  }
];

// 용접 관련 이슈 데이터 (데모용)
export const weldingIssues = [
  {
    id: "WELD-CURRENT_AND_VIBRATION-ANOMALY",
    name: "용접 전류+진동 복합 이상",
    category: "복합 이상",
    severity: "매우높음",
    process: "용접 공정",
    detectionType: "전류+진동",
    description: "용접 과정에서 전류와 진동이 동시에 비정상적으로 감지되는 복합적 문제",
    causes: [
      "기계적/전기적 복합 원인",
      "전극 마모와 접촉 불량 동시 발생", 
      "진동으로 인한 불완전한 접합",
      "전극 시스템 전체 정렬 불량"
    ],
    urgency: "즉시 대응 필요",
    icon: "⚡🔧"
  }
];

// API 설정
export const API_CONFIG = {
  baseUrl: 'http://localhost:8000',
  apiKey: 'user-key-456',
  userId: 'demo_user_001'
};