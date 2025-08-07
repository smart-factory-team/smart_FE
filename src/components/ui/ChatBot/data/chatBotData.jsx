// ===============================
// 2. chatBotData.jsx (API 설정 제거 버전)
// src/components/ui/ChatBot/data/chatBotData.jsx
// ===============================

// 카테고리 정보 (API 엔드포인트 제거)
export const categories = [
  {
    id: 'multi-agent',
    name: '통합 문의',
    icon: '🎯',
    description: '복합적인 설비 이슈를 다양한 AI 전문가가 협업하여 해결합니다.',
    type: 'demo' // API 대신 demo 타입으로 변경
  },
  {
    id: 'safety',
    name: '안전 문의',
    icon: '🛡️',
    description: '안전 관련 문의사항을 GPT 기반 전문가가 답변해드립니다.',
    type: 'demo'
  },
  {
    id: 'technical',
    name: '기술 문의',
    icon: '⚙️',
    description: '기술적 문제를 Gemini 기반 전문가가 상세히 분석해드립니다.',
    type: 'demo'
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
  },
  {
    id: "WELD-CURRENT-HIGH",
    name: "용접 전류 과다",
    category: "전류 이상",
    severity: "높음",
    process: "용접 공정",
    detectionType: "전류",
    description: "설정값 대비 용접 전류가 비정상적으로 높게 측정되는 문제",
    causes: [
      "전극 간격 과다 근접",
      "재료 두께 변화",
      "전원 공급 불안정"
    ],
    urgency: "신속 대응 필요",
    icon: "⚡"
  },
  {
    id: "WELD-VIBRATION-ABNORMAL",
    name: "용접기 비정상 진동",
    category: "진동 이상", 
    severity: "높음",
    process: "용접 공정",
    detectionType: "진동",
    description: "용접 장비에서 발생하는 진동이 정상 범위를 벗어나는 문제",
    causes: [
      "기계 부품 마모",
      "불균형 하중",
      "고정부 느슨함"
    ],
    urgency: "점검 필요",
    icon: "🔧"
  }
];

// Demo 설정 (API 설정 대신)
export const DEMO_CONFIG = {
  mode: 'demonstration',
  version: '1.0.0',
  lastUpdated: '2024-08-07'
};