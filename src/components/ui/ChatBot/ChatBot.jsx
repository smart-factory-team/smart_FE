import React from 'react';
import {
  ChatBotContainer,
  ChatBotButton,
  BotIcon,
  ChatWindow,
  ChatHeader,
  CloseButton,
  SessionInfo
} from './styles/ChatBotStyles';

// 컴포넌트 imports
import { CategorySelection } from './components/CategorySelection';
import { IssueSelection } from './components/IssueSelection';
import { ChatArea } from './components/ChatArea';

// 커스텀 훅 imports
import { useChatBot } from './hooks/useChatBot';
import { useIssueFilter } from './hooks/useIssueFilter';

export const ChatBot = () => {
  // 커스텀 훅 사용
  const {
    isOpen,
    currentStep,
    selectedCategory,
    selectedIssue,
    sessionId,
    messages,
    inputValue,
    isLoading,
    toggleChat,
    handleCategorySelect,
    handleIssueSelect,
    handleSendMessage,
    handleKeyPress,
    handleInputChange,
    setCurrentStep
  } = useChatBot();

  const {
    filteredIssues,
    issueFilters,
    handleIssueFilter
  } = useIssueFilter();

  return (
    <ChatBotContainer>
      <ChatWindow isOpen={isOpen}>
        <ChatHeader>
          <span>
            🤖 {currentStep === 'chat' && selectedCategory 
              ? `${selectedCategory.name} 상담` 
              : 'AI 어시스턴트'}
          </span>
          <CloseButton onClick={toggleChat}>×</CloseButton>
        </ChatHeader>

        {/* 세션 정보 표시 */}
        {currentStep === 'chat' && sessionId && (
          <SessionInfo>
            <span>세션: {sessionId.slice(0, 12)}...</span>
            <span>{selectedCategory?.name} | {selectedIssue?.name}</span>
          </SessionInfo>
        )}

        {/* 카테고리 선택 화면 */}
        {currentStep === 'category' && (
          <CategorySelection 
            onCategorySelect={handleCategorySelect}
            isLoading={isLoading}
          />
        )}

        {/* 이슈 선택 화면 */}
        {currentStep === 'issue' && (
          <IssueSelection 
            selectedCategory={selectedCategory}
            filteredIssues={filteredIssues}
            issueFilters={issueFilters}
            isLoading={isLoading}
            onBack={() => setCurrentStep('category')}
            onIssueFilter={handleIssueFilter}
            onIssueSelect={handleIssueSelect}
          />
        )}

        {/* 채팅 화면 */}
        {currentStep === 'chat' && (
          <ChatArea 
            messages={messages}
            inputValue={inputValue}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
          />
        )}
      </ChatWindow>
      
      <ChatBotButton onClick={toggleChat}>
        <BotIcon>🤖</BotIcon>
      </ChatBotButton>
    </ChatBotContainer>
  );
};