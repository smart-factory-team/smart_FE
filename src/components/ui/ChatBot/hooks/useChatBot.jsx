// ===============================
// 1. useChatBot.jsx (API 제거 버전)
// src/components/ui/ChatBot/hooks/useChatBot.jsx
// ===============================

import { useState } from 'react';

// Mock 응답 데이터
const MOCK_RESPONSES = {
  'multi-agent': [
    `📋 **요약**
용접 전류+진동 복합 이상이 감지되었습니다. 즉시 대응이 필요한 상황입니다.

🚨 **즉시 조치사항**
1. 용접 작업 즉시 중단 [긴급]
2. 전극 상태 점검 (소요시간: 15분) [높음]
3. 진동 측정 및 원인 파악 (소요시간: 30분) [높음]

🔧 **상세 해결방안**
**1차 점검** (예상시간: 1시간)
  • 전극 마모 상태 확인
  • 접촉부 청소 및 정렬
  • 진동 센서 캘리브레이션

**2차 수리** (예상시간: 2-3시간)  
  • 필요시 전극 교체
  • 기계적 고정부 점검
  • 전기 연결부 재정비

⚠️ **안전 주의사항**
• 작업 전 전원 완전 차단 필수
• 개인보호장비 착용
• 2인 1조 작업 진행

💰 **예상 비용**
• 부품비: 50,000 - 150,000원
• 인건비: 200,000원
• 총 비용: 250,000 - 350,000원

🎯 **신뢰도**: 94%
👥 **참여 전문가**: 용접전문가, 진동분석전문가, 전기전문가
⏱️ **분석 시간**: 2.3초`,
    
    "네, 추가로 궁금한 점이 있으시면 언제든 문의해주세요. 정기 점검 주기나 예방 방법에 대해서도 안내해드릴 수 있습니다.",
    
    "예방을 위해서는 주 1회 전극 상태 점검과 월 1회 진동 측정을 권장합니다. 조기 발견 시 비용을 80% 절약할 수 있습니다."
  ],
  'safety': [
    "안전 관련 문의에 대해 GPT 전문가가 답변드리겠습니다. 작업자의 안전이 최우선입니다.",
    "개인보호장비 착용과 안전 절차 준수가 중요합니다.",
    "추가 안전 문의사항이 있으시면 언제든 말씀해주세요."
  ],
  'technical': [
    "기술적 문제에 대해 Gemini 전문가가 상세히 분석해드리겠습니다.",
    "설비의 기술적 사양과 작동 원리를 바탕으로 해결책을 제시합니다.",
    "기술 문서나 매뉴얼이 필요하시면 안내해드릴 수 있습니다."
  ]
};

export const useChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      resetChat();
    }
  };

  const resetChat = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
    setSelectedIssue(null);
    setSessionId(null);
    setMessages([]);
    setInputValue('');
    setIsLoading(false);
    setResponseIndex(0);
  };

  // Mock 세션 생성
  const createSession = async () => {
    // 가짜 지연시간
    await new Promise(resolve => setTimeout(resolve, 500));
    return `mock_session_${Date.now()}`;
  };

  // 카테고리 선택 처리
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep('issue');
  };

  // 이슈 선택 처리 (Mock 버전)
  const handleIssueSelect = async (issue) => {
    setIsLoading(true);
    
    try {
      const newSessionId = await createSession();
      
      setSelectedIssue(issue);
      setSessionId(newSessionId);
      setCurrentStep('chat');
      
      // Mock 환영 메시지
      setMessages([
        {
          id: 1,
          text: `안녕하세요! ${selectedCategory.name} 전문가입니다. 

현재 감지된 이슈: ${issue.name}
심각도: ${issue.severity}
상태: ${issue.urgency}

이 문제에 대해 상세한 분석과 해결 방안을 제공해드리겠습니다. 추가적으로 궁금한 사항이 있으시면 언제든 문의해주세요.`,
          isUser: false,
          timestamp: new Date()
        }
      ]);

    } catch (error) {
      console.error('이슈 선택 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock 메시지 전송 처리
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !sessionId || !selectedCategory) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Mock API 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock 응답 선택
      const responses = MOCK_RESPONSES[selectedCategory.id] || ['Mock 응답입니다.'];
      const currentResponse = responses[responseIndex % responses.length];
      
      const botMessage = {
        id: Date.now() + 1,
        text: currentResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setResponseIndex(prev => prev + 1);

    } catch (error) {
      console.error('메시지 전송 오류:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return {
    // States
    isOpen,
    currentStep,
    selectedCategory,
    selectedIssue,
    sessionId,
    messages,
    inputValue,
    isLoading,
    
    // Actions
    toggleChat,
    resetChat,
    handleCategorySelect,
    handleIssueSelect,
    handleSendMessage,
    handleKeyPress,
    handleInputChange,
    setCurrentStep
  };
};