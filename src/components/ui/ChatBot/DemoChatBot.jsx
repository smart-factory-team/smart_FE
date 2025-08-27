// ===============================
// DemoChatBot.jsx - API 연동 및 대화 종료 기능 통합
// src/components/ui/ChatBot/DemoChatBot.jsx
// ===============================

import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useDemoChatBot } from './hooks/useDemoChatBot';
import { completeSessionWorkflow } from './services/chatApiDemoService';

// ===============================
// 애니메이션 정의
// ===============================
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
`;

const typing = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ===============================
// 스타일드 컴포넌트들
// ===============================
const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const ChatBotButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
  }
  
  ${props => props.isOpen && css`
    background: #dc3545;
  `}
  
  ${props => props.isPulsing && css`
    animation: ${pulse} 2s infinite;
  `}
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.isOpen && css`
    transform: translateY(0);
    opacity: 1;
    animation: ${slideUp} 0.3s ease-out;
  `}
  
  @media (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    bottom: 0;
    right: 0;
    border-radius: 0;
    position: fixed;
  }
`;

const ChatHeader = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, 
      rgba(255,255,255,0.1) 0%, 
      rgba(255,255,255,0.3) 50%, 
      rgba(255,255,255,0.1) 100%
    );
  }
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

// API 연결 상태 표시
const ApiStatusBar = styled.div`
  padding: 8px 20px;
  background: ${props => props.connected ? '#d4edda' : '#f8d7da'};
  color: ${props => props.connected ? '#155724' : '#721c24'};
  font-size: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;
`;

// 🔧 대화 종료 진행상황 표시
const ProgressOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
`;

const ProgressSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const ProgressText = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress || 0}%;
    height: 100%;
    background: white;
    transition: width 0.3s ease;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
  font-weight: 500;
  border: 1px solid #c3e6cb;
`;

// 기존 스타일드 컴포넌트들 (변경 없음)
const CategorySelection = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CategoryHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  flex-shrink: 0;
`;

const CategoryTitle = styled.h2`
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 700;
`;

const CategorySubtitle = styled.p`
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
`;

const ScrollableList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CategoryCard = styled.button`
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.categoryColor || '#667eea'};
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const CategoryIcon = styled.div`
  font-size: 28px;
  margin-bottom: 12px;
`;

const CategoryName = styled.h3`
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
`;

const CategoryDesc = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.4;
`;

const CategoryFeatures = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const FeatureTag = styled.span`
  background: ${props => props.categoryColor || '#667eea'}20;
  color: ${props => props.categoryColor || '#667eea'};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
`;

const IssueCard = styled.button`
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  margin-bottom: 8px;
  
  &:hover {
    border-color: ${props => getSeverityColor(props.severity)};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const IssueName = styled.h4`
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
`;

const IssueTime = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 13px;
`;

const SeverityBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  background: ${props => getSeverityColor(props.severity)}20;
  color: ${props => getSeverityColor(props.severity)};
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-bottom: 15px;
  align-self: flex-start;
  
  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }
`;

const getSeverityColor = (severity) => {
  switch (severity) {
    case '매우높음':
      return '#dc3545';
    case '높음':
      return '#fd7e14';
    case '보통':
      return '#ffc107';
    case '낮음':
      return '#28a745';
    default:
      return '#6c757d';
  }
};

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

const MessageBubble = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
  animation: ${fadeIn} 0.5s ease-out;
  padding: 0 8px;
  
  .message-content {
    max-width: ${props => props.isUser ? '80%' : '85%'};
    padding: 12px 16px;
    border-radius: 18px;
    background: ${props => props.isUser ? 
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
      '#f8f9fa'
    };
    color: ${props => props.isUser ? 'white' : '#2c3e50'};
    font-size: 14px;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
    position: relative;
    
    ${props => props.isUser && css`
      margin-left: auto;
    `}
    
    ${props => props.isWelcome && css`
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      font-weight: 500;
    `}
    
    ${props => props.isError && css`
      background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
      color: white;
    `}
  }
  
  .message-time {
    font-size: 11px;
    color: ${props => props.isUser ? 'rgba(255,255,255,0.7)' : '#95a5a6'};
    margin-top: 4px;
    text-align: ${props => props.isUser ? 'right' : 'left'};
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #7f8c8d;
  font-style: italic;
  
  .typing-dots {
    display: flex;
    gap: 4px;
    
    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #7f8c8d;
      animation: ${typing} 1.4s infinite ease-in-out;
      
      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
    }
  }
`;

const InputArea = styled.div`
  padding: 20px;
  border-top: 1px solid #e1e5e9;
  background: #fafbfc;
  flex-shrink: 0;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: 2px solid #e1e5e9;
  border-radius: 20px;
  padding: 12px 16px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  max-height: 100px;
  min-height: 44px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 18px;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const DemoControlBar = styled.div`
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const DemoButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.danger ? '#dc3545' : '#667eea'};
  border-radius: 20px;
  background: ${props => props.primary ? '#667eea' : props.danger ? '#dc3545' : 'transparent'};
  color: ${props => props.primary ? 'white' : props.danger ? 'white' : props.danger ? '#dc3545' : '#667eea'};
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.danger ? '#c82333' : '#667eea'};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  flex-shrink: 0;
`;

// ===============================
// 메인 컴포넌트
// ===============================
export const DemoChatBot = () => {
  const {
    // 기본 상태
    isOpen,
    currentStep,
    selectedProcess,
    selectedIssue,
    selectedExpert,
    messages,
    inputValue,
    isLoading,
    sessionId,
    
    // 시연 관련
    apiConnected,
    lastError,
    typingEffect,
    
    // 액션 함수들
    toggleChat,
    resetChat,
    handleProcessSelect,
    handleIssueSelect,
    handleExpertSelect,
    handleSendMessage,
    handleKeyPress,
    handleInputChange,
    handleBack,
    
    // 데이터
    processCategories,
    processIssues,
    expertCategories,
    
    // 스크롤 ref
    messagesEndRef
  } = useDemoChatBot();

  // 🔧 대화 종료 관련 상태
  const [isEndingChat, setIsEndingChat] = useState(false);
  const [endProgress, setEndProgress] = useState({ step: 0, message: '', progress: 0 });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 헤더 타이틀 결정
  const getHeaderTitle = () => {
    switch (currentStep) {
      case 'process':
        return '🏭 공정 선택';
      case 'issue':
        return `${selectedProcess?.icon} ${selectedProcess?.name}`;
      case 'expert':
        return '🤖 전문가 선택';
      case 'chat':
        return `${selectedExpert?.icon} ${selectedExpert?.name}`;
      default:
        return '🤖 AI 상담 서비스';
    }
  };

  // 🔧 대화 종료 핸들러 (실제 API 연동)
  const handleEndChat = async () => {
    if (!sessionId) {
      alert('세션 정보가 없습니다.');
      return;
    }

    const confirmEnd = window.confirm('대화를 종료하고 보고서를 다운로드하시겠습니까?');
    if (!confirmEnd) return;

    setIsEndingChat(true);
    setEndProgress({ step: 0, message: '준비 중...', progress: 0 });

    try {
      // 대화 종료부터 보고서 다운로드까지 전체 워크플로우 실행
      await completeSessionWorkflow(
        sessionId,
        `${selectedExpert?.name}를 통한 ${selectedIssue?.name} 문제 상담 완료`,
        (progress) => {
          setEndProgress(progress);
        }
      );

      // 성공 메시지 표시
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsEndingChat(false);
        resetChat(); // 채팅 리셋
      }, 3000);

    } catch (error) {
      console.error('대화 종료 실패:', error);
      setIsEndingChat(false);
      
      let errorMessage = '대화 종료 중 오류가 발생했습니다.';
      if (error.type === 'NETWORK_ERROR') {
        errorMessage = '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.';
      } else if (error.type === 'SESSION_NOT_FOUND') {
        errorMessage = '세션을 찾을 수 없습니다. 새로 시작해주세요.';
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      alert(`오류: ${errorMessage}\n${error.isRetryable ? '다시 시도해주세요.' : ''}`);
    }
  };

  // 1단계: 공정 선택 화면
  const renderProcessSelection = () => (
    <CategorySelection>
      <CategoryHeader>
        <CategoryTitle>🏭 공정 선택</CategoryTitle>
        <CategorySubtitle>
          문제가 발생한 공정을 선택해주세요.
        </CategorySubtitle>
      </CategoryHeader>

      <ScrollableList>
        <CategoryList>
          {processCategories.map((process) => (
            <CategoryCard
              key={process.id}
              onClick={() => handleProcessSelect(process)}
              disabled={isLoading}
              categoryColor={process.color}
            >
              <CategoryIcon>{process.icon}</CategoryIcon>
              <CategoryName>{process.name}</CategoryName>
              <CategoryDesc>{process.description}</CategoryDesc>
            </CategoryCard>
          ))}
        </CategoryList>
      </ScrollableList>
    </CategorySelection>
  );

  // 2단계: 이슈 선택 화면
  const renderIssueSelection = () => (
    <CategorySelection>
      <CategoryHeader>
        <BackButton onClick={handleBack}>
          ← 뒤로
        </BackButton>
        
        <CategoryTitle>{selectedProcess?.icon} 감지된 이슈</CategoryTitle>
        <CategorySubtitle>
          {selectedProcess?.name}에서 감지된 이슈를 선택해주세요.
        </CategorySubtitle>
      </CategoryHeader>

      <ScrollableList>
        <CategoryList>
          {processIssues[selectedProcess?.id]?.map((issue) => (
            <IssueCard
              key={issue.id}
              onClick={() => handleIssueSelect(issue)}
              disabled={isLoading}
              severity={issue.severity}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <IssueName>{issue.name}</IssueName>
                  <IssueTime>{issue.time}</IssueTime>
                </div>
                <SeverityBadge severity={issue.severity}>
                  {issue.severity}
                </SeverityBadge>
              </div>
            </IssueCard>
          )) || []}
        </CategoryList>
      </ScrollableList>
    </CategorySelection>
  );

  // 3단계: 전문가 선택 화면
  const renderExpertSelection = () => (
    <CategorySelection>
      <CategoryHeader>
        <BackButton onClick={handleBack}>
          ← 뒤로
        </BackButton>

        <CategoryTitle>🤖 전문가 선택</CategoryTitle>
        <CategorySubtitle>
          **{selectedIssue?.name}** 문제 해결을 위한<br />
          전문가를 선택해주세요.
        </CategorySubtitle>
      </CategoryHeader>

      <ScrollableList>
        <CategoryList>
          {expertCategories.map((expert) => (
            <CategoryCard
              key={expert.id}
              onClick={() => handleExpertSelect(expert)}
              disabled={isLoading}
              categoryColor={expert.color}
            >
              <CategoryIcon>{expert.icon}</CategoryIcon>
              <CategoryName>{expert.name}</CategoryName>
              <CategoryDesc>{expert.description}</CategoryDesc>
              <CategoryFeatures>
                {expert.features.map((feature, idx) => (
                  <FeatureTag key={idx} categoryColor={expert.color}>
                    {feature}
                  </FeatureTag>
                ))}
              </CategoryFeatures>
            </CategoryCard>
          ))}
        </CategoryList>
      </ScrollableList>

      {isLoading && (
        <LoadingSpinner>
          <div>🔄 AI 전문가와 연결 중...</div>
        </LoadingSpinner>
      )}
    </CategorySelection>
  );

  // 4단계: 채팅 화면
  const renderChatArea = () => (
    <ChatArea>
      <MessagesContainer>
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            isUser={message.isUser}
            isWelcome={message.isWelcome}
            isError={message.isError}
          >
            <div>
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
          </MessageBubble>
        ))}
        
        {(isLoading || typingEffect) && (
          <MessageBubble isUser={false}>
            <div>
              <div className="message-content">
                <TypingIndicator>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  AI 전문가가 분석하고 있습니다...
                </TypingIndicator>
              </div>
            </div>
          </MessageBubble>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputArea>
        <InputContainer>
          <MessageInput
            placeholder="추가 질문을 입력하세요..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isEndingChat}
            rows={1}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim() || isEndingChat}
            title="메시지 전송"
          >
            ➤
          </SendButton>
        </InputContainer>
      </InputArea>

      {/* 🔧 개선된 컨트롤 바 */}
      <DemoControlBar>
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          {selectedExpert && `${selectedExpert.name} 상담 진행 중`}
          {sessionId && ` | 세션: ${sessionId.slice(0, 8)}...`}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <DemoButton 
            onClick={handleBack}
            disabled={isEndingChat}
          >
            ← 전문가 선택
          </DemoButton>
          
          <DemoButton 
            danger 
            onClick={handleEndChat}
            disabled={isEndingChat || !sessionId}
          >
            {isEndingChat ? '처리 중...' : '🔚 대화 종료'}
          </DemoButton>
        </div>
      </DemoControlBar>
    </ChatArea>
  );

  // 현재 단계에 따른 컨텐츠 렌더링
  const renderContent = () => {
    switch (currentStep) {
      case 'process':
        return renderProcessSelection();
      case 'issue':
        return renderIssueSelection();
      case 'expert':
        return renderExpertSelection();
      case 'chat':
        return renderChatArea();
      default:
        return renderProcessSelection();
    }
  };

  return (
    <ChatBotContainer>
      <ChatBotButton 
        onClick={toggleChat}
        title={isOpen ? '상담 종료' : 'AI 상담 시작'}
        isOpen={isOpen}
        isPulsing={!isOpen && !apiConnected}
      >
        {isOpen ? '✕' : '🤖'}
      </ChatBotButton>

      <ChatWindow isOpen={isOpen}>
        <ChatHeader>
          <div>
            <HeaderTitle>{getHeaderTitle()}</HeaderTitle>
          </div>
          <CloseButton 
            onClick={toggleChat}
            title="상담 종료"
            disabled={isEndingChat}
          >
            ✕
          </CloseButton>
        </ChatHeader>

        <ApiStatusBar connected={apiConnected}>
          {apiConnected ? (
            <>🟢 AI 서비스 연결됨</>
          ) : (
            <>🔴 AI 서비스 연결 확인 중...</>
          )}
        </ApiStatusBar>

        {lastError && (
          <div style={{
            padding: '12px 20px',
            background: '#f8d7da',
            color: '#721c24',
            fontSize: '13px',
            borderTop: '1px solid #f5c6cb',
            flexShrink: 0
          }}>
            ❌ {lastError.message}
            {lastError.isRetryable && (
              <button
                style={{
                  marginLeft: '12px',
                  background: 'none',
                  border: '1px solid #721c24',
                  color: '#721c24',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
                onClick={resetChat}
              >
                다시 시도
              </button>
            )}
          </div>
        )}

        {/* 🔧 대화 종료 진행상황 오버레이 */}
        {isEndingChat && (
          <ProgressOverlay>
            <ProgressSpinner />
            <ProgressText>{endProgress.message}</ProgressText>
            <ProgressBar progress={endProgress.progress} />
            <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
              단계 {endProgress.step}/5
            </div>
          </ProgressOverlay>
        )}

        {/* 🔧 성공 메시지 */}
        {showSuccessMessage && (
          <SuccessMessage>
            ✅ 대화가 성공적으로 종료되고 보고서가 다운로드되었습니다!<br />
            잠시 후 새로운 상담을 시작할 수 있습니다.
          </SuccessMessage>
        )}

        {renderContent()}
      </ChatWindow>
    </ChatBotContainer>
  );
};

export default DemoChatBot;