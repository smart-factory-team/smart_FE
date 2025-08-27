// ===============================
// useChatBot.jsx - 수정된 API 형식 적용
// src/components/ui/ChatBot/hooks/useChatBot.jsx
// ===============================

import { useState, useCallback, useRef, useEffect } from 'react';
import chatApi from '../services/chatApi';
import { handleChatbotError, logError } from '../utils/errorHandler';

export const useChatBot = () => {
  // ===============================
  // 1. 기본 상태 관리
  // ===============================
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // ===============================
  // 2. API 연동 상태 관리
  // ===============================
  const [apiConnected, setApiConnected] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('idle');
  const [reportAvailable, setReportAvailable] = useState(false);
  const [lastError, setLastError] = useState(null);
  
  // ===============================
  // 3. 성능 최적화를 위한 ref들
  // ===============================
  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const isComponentMountedRef = useRef(true);

  // ===============================
  // 4. 컴포넌트 언마운트 시 정리
  // ===============================
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    return () => {
      isComponentMountedRef.current = false;
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ===============================
  // 5. 상태 업데이트 안전 함수
  // ===============================
  const safeSetState = useCallback((setter) => {
    if (isComponentMountedRef.current) {
      setter();
    }
  }, []);

  // ===============================
  // 6. API 연결 확인 (먼저 정의)
  // ===============================
  const checkApiConnection = useCallback(async () => {
    try {
      const isHealthy = await chatApi.checkApiHealth();
      
      safeSetState(() => {
        setApiConnected(isHealthy);
        
        if (!isHealthy) {
          setLastError({
            type: 'API_CONNECTION_ERROR',
            message: 'API 서버에 연결할 수 없습니다.',
            timestamp: new Date().toISOString()
          });
        } else {
          setLastError(null);
          console.log('✅ API Health Check OK');
        }
      });

    } catch (error) {
      console.error('API connection check failed:', error);
      
      safeSetState(() => {
        setApiConnected(false);
        setLastError({
          type: 'API_CONNECTION_ERROR',
          message: 'API 서버 연결 확인 중 오류가 발생했습니다.',
          timestamp: new Date().toISOString()
        });
      });
    }
  }, [safeSetState]);

  // ===============================
  // 7. 기본 챗봇 제어 함수
  // ===============================
  const resetChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    safeSetState(() => {
      setCurrentStep('category');
      setSelectedCategory(null);
      setSelectedIssue(null);
      setSessionId(null);
      setMessages([]);
      setInputValue('');
      setIsLoading(false);
      setSessionStatus('idle');
      setReportAvailable(false);
      setLastError(null);
      isProcessingRef.current = false;
    });
  }, [safeSetState]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      const newIsOpen = !prev;
      if (newIsOpen) {
        resetChat();
        setTimeout(() => {
          if (isComponentMountedRef.current) {
            checkApiConnection();
          }
        }, 100);
      }
      return newIsOpen;
    });
  }, [checkApiConnection, resetChat]); // 🔧 의존성 추가

  // ===============================
  // 8. 카테고리 선택 처리
  // ===============================
  const handleCategorySelect = useCallback(async (category) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setLastError(null);
    
    try {
      if (!apiConnected) {
        await checkApiConnection();
      }

      safeSetState(() => {
        setSelectedCategory(category);
        setCurrentStep('issue');
      });

      console.log(`📂 Category selected: ${category.name} (${category.id})`);
      
    } catch (error) {
      const processedError = handleChatbotError(error, 'category_select');
      safeSetState(() => {
        setLastError(processedError);
      });
      logError(processedError, 'useChatBot.handleCategorySelect');
    } finally {
      safeSetState(() => {
        setIsLoading(false);
      });
    }
  }, [isLoading, apiConnected, checkApiConnection, safeSetState]);

  // ===============================
  // 9. 이슈 선택 및 챗봇 세션 시작
  // ===============================
  const handleIssueSelect = useCallback(async (issue) => {
    if (isProcessingRef.current || isLoading) return;
    isProcessingRef.current = true;
    
    setIsLoading(true);
    setLastError(null);

    try {
      console.log(`🎯 Starting chat session for issue: ${issue.name}`);
      
      // 이슈 기반 챗봇 세션 시작
      const sessionResult = await chatApi.startChatFromIssue(issue, selectedCategory.id);

      if (!sessionResult.success) {
        throw new Error('Failed to start chat session');
      }

      const newSessionId = sessionResult.sessionId;
      const initialResponse = sessionResult.data.initial_response;
      
      safeSetState(() => {
        setSessionId(newSessionId);
        setSelectedIssue(issue);
        setSessionStatus('active');
        setCurrentStep('chat');

        // 초기 메시지들 설정
        const messages = [
          {
            id: Date.now(),
            text: `안녕하세요. ${issue.name} 문제에 대해 문의드립니다.`,
            isUser: true,
            timestamp: new Date()
          }
        ];

        // API 응답에 따라 봇 메시지 추가
        if (initialResponse) {
          let botMessageText = '';
          
          // /chat/test 응답 형식 처리
          if (initialResponse.executive_summary) {
            botMessageText = `📋 **요약**\n${initialResponse.executive_summary}\n\n`;
            
            if (initialResponse.immediate_actions && initialResponse.immediate_actions.length > 0) {
              botMessageText += `🚨 **즉시 조치사항**\n`;
              initialResponse.immediate_actions.forEach(action => {
                botMessageText += `${action.step}. ${action.action} [${action.priority}]\n`;
              });
            }
            
            if (initialResponse.cost_estimation) {
              botMessageText += `\n💰 **예상 비용**\n• 총 비용: ${initialResponse.cost_estimation.total}`;
            }
            
            if (initialResponse.confidence_level) {
              botMessageText += `\n\n🎯 **신뢰도**: ${initialResponse.confidence_level}%`;
            }
          } else if (initialResponse.response) {
            // GPT/Gemini 응답 형식
            botMessageText = initialResponse.response;
          } else {
            botMessageText = '응답을 받았습니다. 추가 문의사항이 있으시면 말씀해주세요.';
          }

          messages.push({
            id: Date.now() + 1,
            text: botMessageText,
            isUser: false,
            timestamp: new Date(),
            metadata: initialResponse
          });
        }

        setMessages(messages);
      });

      console.log(`✅ Chat session started: ${newSessionId}`);

    } catch (error) {
      const processedError = handleChatbotError(error, 'session_create');
      safeSetState(() => {
        setLastError(processedError);
        
        if (processedError.chatbotResponse) {
          setMessages([processedError.chatbotResponse]);
          setCurrentStep('chat');
        }
      });
      
      logError(processedError, 'useChatBot.handleIssueSelect');
    } finally {
      isProcessingRef.current = false;
      safeSetState(() => {
        setIsLoading(false);
      });
    }
  }, [isLoading, selectedCategory, safeSetState]);

  // ===============================
  // 10. 메시지 전송 처리
  // ===============================
  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading || !sessionId || !selectedCategory) return;
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    const userMessage = {
      id: Date.now(),
      text: trimmedInput,
      isUser: true,
      timestamp: new Date()
    };

    // UI 즉시 업데이트
    safeSetState(() => {
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      setLastError(null);
    });

    try {
      console.log(`💬 Sending message to session: ${sessionId}`);
      
      // 🔧 더 구체적인 로딩 메시지
      const loadingMessage = {
        id: Date.now() + 0.5,
        text: '🤖 AI 전문가들이 분석 중입니다... (최대 2분 소요)',
        isUser: false,
        timestamp: new Date(),
        isLoading: true
      };
      
      safeSetState(() => {
        setMessages(prev => [...prev, loadingMessage]);
      });
      
      const response = await chatApi.continueChatSession(sessionId, userMessage.text, selectedCategory.id);

      if (!response.success) {
        throw new Error('Failed to send message');
      }

      // 응답 메시지 처리
      let botMessageText = '';
      const responseData = response.data;

      // 📋 /chat/test 응답의 풍부한 데이터 활용
      if (responseData.executive_summary) {
        botMessageText = `📋 **요약**\n${responseData.executive_summary}\n\n`;
        
        // 🚨 즉시 조치사항
        if (responseData.immediate_actions && responseData.immediate_actions.length > 0) {
          botMessageText += `🚨 **즉시 조치사항**\n`;
          responseData.immediate_actions.forEach((action, index) => {
            botMessageText += `${index + 1}. ${action.action} [${action.priority}]\n`;
          });
          botMessageText += '\n';
        }
        
        // 🛡️ 안전 주의사항
        if (responseData.safety_precautions && responseData.safety_precautions.length > 0) {
          botMessageText += `🛡️ **안전 주의사항**\n`;
          responseData.safety_precautions.forEach(precaution => {
            botMessageText += `• ${precaution}\n`;
          });
          botMessageText += '\n';
        }
        
        // 💰 비용 정보
        if (responseData.cost_estimation) {
          botMessageText += `💰 **예상 비용**\n`;
          if (responseData.cost_estimation.parts) {
            botMessageText += `• 부품비: ${responseData.cost_estimation.parts}\n`;
          }
          if (responseData.cost_estimation.labor) {
            botMessageText += `• 인건비: ${responseData.cost_estimation.labor}\n`;
          }
          if (responseData.cost_estimation.total) {
            botMessageText += `• 총 비용: ${responseData.cost_estimation.total}\n`;
          }
          botMessageText += '\n';
        }
        
        // 🎯 신뢰도 및 전문가 정보
        if (responseData.confidence_level) {
          const confidencePercent = Math.round(responseData.confidence_level * 100);
          botMessageText += `🎯 **신뢰도**: ${confidencePercent}%\n`;
        }
        
        if (responseData.participating_agents && responseData.participating_agents.length > 0) {
          botMessageText += `👥 **참여 전문가**: ${responseData.participating_agents.join(', ')}\n`;
        }
        
        if (responseData.processing_time) {
          botMessageText += `⏱️ **분석 시간**: ${responseData.processing_time.toFixed(1)}초`;
        }
        
      } else if (responseData.response) {
        // GPT/Gemini 단순 응답 형식
        botMessageText = responseData.response;
      } else {
        botMessageText = '응답을 받았습니다.';
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botMessageText,
        isUser: false,
        timestamp: new Date(),
        metadata: responseData
      };

      safeSetState(() => {
        // 🔧 로딩 메시지 제거 후 실제 응답 추가
        setMessages(prev => {
          const filteredMessages = prev.filter(msg => !msg.isLoading);
          return [...filteredMessages, botMessage];
        });
      });

      console.log(`✅ Message sent and response received`);

    } catch (error) {
      const processedError = handleChatbotError(error, 'message_send');
      safeSetState(() => {
        setLastError(processedError);

        // 🔧 로딩 메시지 제거
        setMessages(prev => {
          const filteredMessages = prev.filter(msg => !msg.isLoading);
          if (processedError.chatbotResponse) {
            return [...filteredMessages, processedError.chatbotResponse];
          }
          return filteredMessages;
        });
      });
      
      logError(processedError, 'useChatBot.handleSendMessage');
    } finally {
      isProcessingRef.current = false;
      safeSetState(() => {
        setIsLoading(false);
      });
    }
  }, [inputValue, sessionId, selectedCategory, isLoading, safeSetState]);

  // ===============================
  // 11. 보고서 다운로드 처리 (간단 버전)
  // ===============================
  const handleDownloadReport = useCallback(async () => {
    if (!sessionId) return;

    try {
      console.log('📄 보고서 다운로드 시도:', sessionId);
      
      // 임시: 보고서 다운로드 시뮬레이션
      alert(`세션 ${sessionId}의 보고서 다운로드를 시작합니다.\n(실제 구현은 준비 중입니다.)`);
      
      // 실제 구현 시:
      // const result = await reportApi.downloadAndSaveReport(sessionId);
      
    } catch (error) {
      console.error('보고서 다운로드 에러:', error);
      alert('보고서 다운로드 중 오류가 발생했습니다.');
    }
  }, [sessionId]);

  // ===============================
  // 12. 세션 완료 처리 (간단 버전)
  // ===============================
  const handleSessionCompletion = useCallback(async () => {
    if (!sessionId) return;

    safeSetState(() => {
      setSessionStatus('completed');
      setReportAvailable(true);
      
      const completionMessage = {
        id: Date.now(),
        text: '상담이 완료되었습니다. 새로운 상담을 시작하거나 다른 문의를 하실 수 있습니다.',
        isUser: false,
        timestamp: new Date(),
        isCompletion: true
      };
      
      setMessages(prev => [...prev, completionMessage]);
    });
  }, [sessionId, safeSetState]);

  // Enter 키 처리
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  // ===============================
  // 14. Return Values
  // ===============================
  return {
    // 기본 상태
    isOpen,
    currentStep,
    selectedCategory,
    selectedIssue,
    sessionId,
    messages,
    inputValue,
    isLoading,
    
    // API 연동 상태
    apiConnected,
    sessionStatus,
    reportAvailable,
    lastError,
    
    // 액션 함수들
    toggleChat,
    resetChat,
    handleCategorySelect,
    handleIssueSelect,
    handleSendMessage,
    handleKeyPress,
    handleInputChange,
    handleSessionCompletion, // 🔧 추가
    handleDownloadReport, // 🔧 추가
    setCurrentStep,
    
    // 유틸리티
    checkApiConnection
  };
};