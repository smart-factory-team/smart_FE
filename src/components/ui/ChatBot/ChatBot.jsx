// ===============================
// ChatBot.jsx - 기존 구조 유지하면서 API 연동만 적용
// src/components/ui/ChatBot/ChatBot.jsx
// ===============================

import React from 'react';
import {
  ChatBotContainer,
  ChatBotButton,
  BotIcon,
  ChatWindow,
  ChatHeader,
  CloseButton
} from './styles/ChatBotStyles';
import { CategorySelection } from './components/CategorySelection';
import { IssueSelection } from './components/IssueSelection';
import { ChatArea } from './components/ChatArea';
import { useChatBot } from './hooks/useChatBot';
import { useIssueFilter } from './hooks/useIssueFilter';

export const ChatBot = () => {
  // 챗봇 메인 훅 (API 연동 버전)
  const {
    // 기본 상태
    isOpen,
    currentStep,
    selectedCategory,
    messages,
    inputValue,
    isLoading,
    
    // API 연동 상태
    apiConnected,
    sessionStatus,
    lastError,
    
    // 액션 함수들
    toggleChat,
    resetChat,
    handleCategorySelect,
    handleIssueSelect,
    handleSendMessage,
    handleKeyPress,
    handleInputChange,
    setCurrentStep
  } = useChatBot();

  // 이슈 필터링 훅
  const {
    filteredIssues,
    issueFilters,
    handleIssueFilter
  } = useIssueFilter(selectedCategory);

  // ✨ 임시 함수들 추가 (오류 해결용)
  const handleSessionCompletion = () => {
    console.log('상담 종료 - 임시 구현');
    // 임시로 세션 완료 처리
  };

  const handleDownloadReport = () => {
    console.log('보고서 다운로드 - 임시 구현');
    // 임시로 보고서 다운로드 처리
    alert('보고서 다운로드 기능은 준비 중입니다.');
  };

  // 뒤로 가기 처리
  const handleBack = () => {
    if (currentStep === 'issue') {
      setCurrentStep('category');
    } else if (currentStep === 'chat' && sessionStatus !== 'active') {
      setCurrentStep('issue');
    }
  };

  // 현재 단계별 컨텐츠 렌더링
  const renderContent = () => {
    // API 연결 실패 시 간단한 연결 화면 표시
    if (!apiConnected && currentStep === 'category') {
      return (
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center',
          color: '#6c757d' 
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
          <h3 style={{ color: '#dc3545', margin: '0 0 12px 0' }}>
            서버 연결 중...
          </h3>
          <p style={{ margin: '0 0 20px 0', lineHeight: 1.5 }}>
            챗봇 서비스에 연결하고 있습니다.<br />
            잠시만 기다려주세요.
          </p>
          {lastError && (
            <p style={{ color: '#dc3545', fontSize: '12px' }}>
              {lastError.message}
            </p>
          )}
        </div>
      );
    }

    switch (currentStep) {
      case 'category':
        return (
          <CategorySelection
            onCategorySelect={handleCategorySelect}
            isLoading={isLoading}
          />
        );

      case 'issue':
        return (
          <IssueSelection
            selectedCategory={selectedCategory}
            filteredIssues={filteredIssues}
            issueFilters={issueFilters}
            isLoading={isLoading}
            onBack={handleBack}
            onIssueFilter={handleIssueFilter}
            onIssueSelect={handleIssueSelect}
          />
        );

      case 'chat':
        return (
          <>
            <ChatArea
              messages={messages}
              inputValue={inputValue}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
            />
            
            {/* 간단한 세션 상태 표시 */}
            {sessionStatus === 'active' && (
              <div style={{
                padding: '16px 20px',
                background: '#fff3cd',
                borderTop: '1px solid #ffeaa7',
                color: '#856404',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>💬 상담 진행 중...</span>
                <button
                  onClick={handleSessionCompletion}
                  style={{
                    padding: '6px 12px',
                    background: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  disabled={isLoading}
                >
                  🏁 상담 종료
                </button>
              </div>
            )}
            
            {sessionStatus === 'completed' && (
              <div style={{
                padding: '16px 20px',
                background: '#d4edda',
                borderTop: '1px solid #c3e6cb',
                color: '#155724',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>✅ 상담이 완료되었습니다!</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleDownloadReport}
                    style={{
                      padding: '6px 12px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    disabled={isLoading}
                  >
                    📄 보고서 다운로드
                  </button>
                  <button
                    onClick={resetChat}
                    style={{
                      padding: '6px 12px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🆕 새 상담 시작
                  </button>
                </div>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // 헤더 타이틀 결정
  const getHeaderTitle = () => {
    switch (currentStep) {
      case 'category':
        return '🤖 AI 상담 서비스';
      case 'issue':
        return `🔍 ${selectedCategory?.name || '이슈 선택'}`;
      case 'chat':
        const statusEmoji = {
          'active': '💬',
          'completing': '⏳',
          'completed': '✅'
        }[sessionStatus] || '💬';
        return `${statusEmoji} ${selectedCategory?.name || '상담 중'}`;
      default:
        return '🤖 AI 상담 서비스';
    }
  };

  return (
    <ChatBotContainer>
      {/* 챗봇 토글 버튼 */}
      <ChatBotButton 
        onClick={toggleChat}
        title={isOpen ? '챗봇 닫기' : '챗봇 열기'}
      >
        <BotIcon>{isOpen ? '✕' : '🤖'}</BotIcon>
      </ChatBotButton>

      {/* 챗봇 창 */}
      <ChatWindow isOpen={isOpen}>
        {/* 헤더 */}
        <ChatHeader>
          <span>{getHeaderTitle()}</span>
          <CloseButton 
            onClick={toggleChat}
            title="챗봇 닫기"
          >
            ✕
          </CloseButton>
        </ChatHeader>

        {/* 간단한 API 상태 표시 */}
        {!apiConnected && (
          <div style={{
            padding: '8px 16px',
            background: '#f8d7da',
            color: '#721c24',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            🔴 API 서버 연결 확인 중...
          </div>
        )}

        {/* 메인 컨텐츠 */}
        {renderContent()}
      </ChatWindow>
    </ChatBotContainer>
  );
};