import { useState } from 'react';
import { API_CONFIG } from '../data/chatBotData';

export const useChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  };

  // 세션 생성 API 호출
  const createSession = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/api/session/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('세션 생성 실패');
      }

      const data = await response.json();
      return data.session_id;
    } catch (error) {
      console.error('세션 생성 오류:', error);
      return null;
    }
  };

  // 🔧 Multi-Agent API 응답을 포맷팅하는 함수
  const formatMultiAgentResponse = (data) => {
    let formattedResponse = '';

    // 1. 요약 정보
    if (data.executive_summary) {
      formattedResponse += `📋 **요약**\n${data.executive_summary}\n\n`;
    }

    // 2. 즉시 조치사항
    if (data.immediate_actions && data.immediate_actions.length > 0) {
      formattedResponse += `🚨 **즉시 조치사항**\n`;
      data.immediate_actions.forEach((action, index) => {
        formattedResponse += `${index + 1}. ${action.action}`;
        if (action.time) formattedResponse += ` (소요시간: ${action.time})`;
        if (action.priority) formattedResponse += ` [${action.priority}]`;
        formattedResponse += '\n';
      });
      formattedResponse += '\n';
    }

    // 3. 상세 해결방안
    if (data.detailed_solution && data.detailed_solution.length > 0) {
      formattedResponse += `🔧 **상세 해결방안**\n`;
      data.detailed_solution.forEach((phase, index) => {
        formattedResponse += `**${phase.phase}**`;
        if (phase.estimated_time) formattedResponse += ` (예상시간: ${phase.estimated_time})`;
        formattedResponse += '\n';
        
        if (phase.actions && phase.actions.length > 0) {
          phase.actions.forEach(action => {
            formattedResponse += `  • ${action}\n`;
          });
        }
        formattedResponse += '\n';
      });
    }

    // 4. 안전 주의사항
    if (data.safety_precautions && data.safety_precautions.length > 0) {
      formattedResponse += `⚠️ **안전 주의사항**\n`;
      data.safety_precautions.forEach(precaution => {
        formattedResponse += `• ${precaution}\n`;
      });
      formattedResponse += '\n';
    }

    // 5. 비용 추정
    if (data.cost_estimation) {
      formattedResponse += `💰 **예상 비용**\n`;
      if (data.cost_estimation.parts) formattedResponse += `• 부품비: ${data.cost_estimation.parts}\n`;
      if (data.cost_estimation.labor) formattedResponse += `• 인건비: ${data.cost_estimation.labor}\n`;
      if (data.cost_estimation.total) formattedResponse += `• 총 비용: ${data.cost_estimation.total}\n`;
      formattedResponse += '\n';
    }

    // 6. 추가 정보
    if (data.confidence_level) {
      formattedResponse += `🎯 **신뢰도**: ${data.confidence_level}%\n`;
    }

    if (data.participating_agents && data.participating_agents.length > 0) {
      formattedResponse += `👥 **참여 전문가**: ${data.participating_agents.join(', ')}\n`;
    }

    if (data.processing_time) {
      formattedResponse += `⏱️ **분석 시간**: ${data.processing_time}초\n`;
    }

    // 7. 실패한 에이전트가 있다면 알림
    if (data.failed_agents && data.failed_agents.length > 0) {
      formattedResponse += `\n⚠️ **일부 전문가 응답 실패**\n`;
      data.failed_agents.forEach(agent => {
        formattedResponse += `• ${agent.agent_name} (${agent.specialty}): ${agent.error_message}\n`;
      });
    }

    return formattedResponse || '응답을 받을 수 없습니다.';
  };

  // 카테고리 선택 처리
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentStep('issue');
  };

  // 이슈 선택 처리
  const handleIssueSelect = async (issue) => {
    setIsLoading(true);
    
    try {
      const newSessionId = await createSession();
      
      if (!newSessionId) {
        alert('세션 생성에 실패했습니다. 다시 시도해주세요.');
        setIsLoading(false);
        return;
      }

      setSelectedIssue(issue);
      setSessionId(newSessionId);
      setCurrentStep('chat');
      
      // 이슈 기반 환영 메시지 생성
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

  // 메시지 전송 처리
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !sessionId || !selectedCategory) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      let requestBody;
      let headers = {
        'Content-Type': 'application/json',
      };

      // API 엔드포인트별 요청 데이터 구성
      if (selectedCategory.id === 'multi-agent') {
        // 통합 문의 (Multi-Agent)
        headers['x-api-key'] = API_CONFIG.apiKey;
        requestBody = {
          user_message: currentInput,
          issue_code: selectedIssue?.id || "WELD-CURRENT_AND_VIBRATION-ANOMALY",
          session_id: sessionId,
          user_id: API_CONFIG.userId
        };
      } else {
        // GPT/Gemini Agent
        requestBody = {
          message: currentInput,
          session_id: sessionId
        };
      }

      console.log('🔧 API 요청:', {
        url: `${API_CONFIG.baseUrl}${selectedCategory.endpoint}`,
        headers,
        body: requestBody
      });

      const response = await fetch(`${API_CONFIG.baseUrl}${selectedCategory.endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📡 API 응답:', data);

      let botResponseText;

      // 🔧 API 응답 형태에 따라 다르게 처리
      if (selectedCategory.id === 'multi-agent') {
        // Multi-Agent API 응답 포맷팅
        botResponseText = formatMultiAgentResponse(data);
      } else {
        // 기존 GPT/Gemini API 응답
        botResponseText = data.response || data.message || '응답을 받을 수 없습니다.';
      }
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ 메시지 전송 오류:', error);
      
      // 🔧 더 상세한 에러 메시지
      let errorText = '죄송합니다. 오류가 발생했습니다.';
      if (error.message.includes('HTTP 4')) {
        errorText += ' 인증 또는 요청 형식을 확인해주세요.';
      } else if (error.message.includes('HTTP 5')) {
        errorText += ' 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.';
      } else {
        errorText += ' 네트워크 연결을 확인해주세요.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
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