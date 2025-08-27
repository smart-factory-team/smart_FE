// ===============================
// chatBotData.jsx - 실제 이슈 코드 적용 버전
// src/components/ui/ChatBot/data/chatBotData.jsx
// ===============================

// 카테고리 정보
export const categories = [
  {
    id: 'multi-agent',
    name: '통합 문의',
    icon: '🎯',
    description: '복합적인 설비 이슈를 다양한 AI 전문가가 협업하여 해결합니다.',
    type: 'api' // 실제 API 사용
  },
  {
    id: 'safety',
    name: '안전 문의',
    icon: '🛡️',
    description: '안전 관련 문의사항을 GPT 기반 전문가가 답변해드립니다.',
    type: 'api'
  },
  {
    id: 'technical',
    name: '기술 문의',
    icon: '⚙️',
    description: '기술적 문제를 Gemini 기반 전문가가 상세히 분석해드립니다.',
    type: 'api'
  }
];

// 🔧 실제 백엔드 이슈 코드로 업데이트된 데이터
export const weldingIssues = [
  {
    id: "WELD-CURRENT_AND_VIBRATION-ANOMALY-2025-08-19T14:00:00",
    name: "용접 전류+진동 복합 이상",
    category: "복합 이상",
    severity: "매우높음",
    process: "용접 공정",
    detectionType: "전류+진동",
    description: "전류와 진동 이상이 동시에 발생하는 경우는 주로 기계적 이상(예: 느슨한 전극/기구 결합)과 전기적 이상이 함께 존재하는 경우",
    causes: [
      "전극 마모로 접촉 불안정 + 진동으로 로봇 흔들림",
      "기계적 이상과 전기적 이상 복합 발생",
      "전극/기구 결합 느슨함",
      "접합 불량률 급증"
    ],
    solutions: [
      "전기 및 기계 계통을 모두 점검",
      "로봇 위치 정밀도 보정",
      "전극 시스템 전체 재정렬",
      "진동 분석 기반 예방정비 주기 조정"
    ],
    urgency: "즉시 대응 필요",
    icon: "⚡🔧"
  },
  {
    id: "WELD-CURRENT-ANOMALY-2025-08-19T14:00:00",
    name: "용접 전류 이상",
    category: "전류 이상",
    severity: "높음",
    process: "용접 공정",
    detectionType: "전류",
    description: "용접 공정 중 전류 파형이 정상 범위 이탈. 전극과 소재 간 접촉 불량, 전원 공급장치 불안정, 또는 전극 팁의 심한 마모로 인해 발생",
    causes: [
      "전극과 소재 간 접촉 불량",
      "전원 공급장치 불안정",
      "전극 팁의 심한 마모"
    ],
    solutions: [
      "전극 팁 마모 상태 확인 및 교체",
      "접촉면 이물질 제거 및 접촉력 조정",
      "전원 공급 시스템 점검"
    ],
    urgency: "신속 대응 필요",
    icon: "⚡"
  },
  {
    id: "WELD-VIBRATION-ANOMALY-2025-08-19T14:00:00",
    name: "용접 진동 이상",
    category: "진동 이상", 
    severity: "높음",
    process: "용접 공정",
    detectionType: "진동",
    description: "용접 암, 전극 건 등 기계 부위에서의 이상 진동이 발생. 주요 원인은 베어링 마모, 암 구조물 느슨함, 구조 공진 현상",
    causes: [
      "베어링 마모",
      "암 구조물 느슨함", 
      "구조 공진 현상"
    ],
    solutions: [
      "정기적인 베어링 및 구동부 점검",
      "구조물 체결부 토크 확인 및 재고정",
      "공진 영역 회피용 속도 조정"
    ],
    urgency: "점검 필요",
    icon: "🔧"
  }
];

// 프레스 관련 이슈들
export const pressIssues = [
  {
    id: "PRESS-VIB1-ANOMALY-2025-08-19T14:00:00",
    name: "프레스 상부진동 이상",
    category: "진동 이상",
    severity: "높음",
    process: "프레스 공정",
    detectionType: "진동",
    description: "프레스 상부에서 비정상적인 진동이 감지됨",
    causes: [
      "축 정렬 불량, 축 휨, 회전체 불균형",
      "베어링/임펠러 등 부품 마모",
      "캐비테이션, 에어레이션, 유압 불균형",
      "기초 불량, 공진"
    ],
    solutions: [
      "회전체 밸런싱, 축 정밀 조정",
      "마모 부품 교체, 축 교정/교체",
      "흡입 압력 점검, 오일 관리",
      "기초 볼트 점검, 방진 장치 설치"
    ],
    urgency: "즉시 점검 필요",
    icon: "🔧"
  },
  {
    id: "PRESS-CUR-ANOMALY-2025-08-19T14:00:00",
    name: "프레스 전류 이상",
    category: "전류 이상",
    severity: "높음",
    process: "프레스 공정", 
    detectionType: "전류",
    description: "프레스 모터에서 비정상적인 전류 패턴이 감지됨",
    causes: [
      "과부하, 동력전달 이상",
      "내부 누유, 유량 부족",
      "모터 제어 문제"
    ],
    solutions: [
      "유압유 청정/점도/온도 관리 및 교체",
      "필터 점검, 부품 마모/손상 여부 점검",
      "축/모터 정렬 정밀 조정",
      "모터 전원/제어 계통 점검"
    ],
    urgency: "신속 대응 필요",
    icon: "⚡"
  }
];

// 도장 관련 이슈들
export const paintingIssues = [
  {
    id: "PAINT-EQ-VOL-HIGH-2025-08-19T14:00:00",
    name: "도장 전압 높음",
    category: "전압 이상",
    severity: "보통",
    process: "도장 공정",
    detectionType: "전압",
    description: "도장 장비에서 설정 범위를 초과하는 높은 전압이 감지됨",
    causes: [
      "전압 설정 값이 과도하게 높음",
      "전원 공급 장치의 제어 오류",
      "센서 오차로 과대 계측"
    ],
    solutions: [
      "전원공급장치(DC Rectifier) 점검",
      "제어계 전압 기준 재조정",
      "센서 교체 또는 보정 수행"
    ],
    urgency: "점검 필요",
    icon: "⚡"
  },
  {
    id: "PAINT-VIS-SCRATCH-2025-08-19T14:00:00",
    name: "도장면 스크래치",
    category: "품질 불량",
    severity: "보통",
    process: "도장 공정",
    detectionType: "시각검사",
    description: "도장 표면에 스크래치가 발견됨",
    causes: [
      "건조 전 조립 간섭",
      "로봇팔 충돌"
    ],
    solutions: [
      "공정 간 간섭 방지 설계",
      "로봇 동선 최적화"
    ],
    urgency: "품질 개선 필요",
    icon: "🎨"
  }
];

// 전체 이슈 목록 (통합)
export const allIssues = [
  ...weldingIssues,
  ...pressIssues,
  ...paintingIssues
];

// Demo 설정
export const DEMO_CONFIG = {
  mode: 'api_connected',
  version: '2.0.0',
  lastUpdated: '2024-08-19'
};