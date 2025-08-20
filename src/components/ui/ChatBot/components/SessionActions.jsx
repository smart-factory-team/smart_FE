// ===============================
// SessionActions.jsx - 세션 액션 컴포넌트
// src/components/ui/ChatBot/components/SessionActions.jsx
// ===============================

import React, { useState } from 'react';
import styled from 'styled-components';

// 스타일 컴포넌트
const ActionsContainer = styled.div`
  padding: 16px 20px;
  background: #f8f9ff;
  border-top: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'disabled'].includes(prop),
})`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }
        `;
      case 'secondary':
        return `
          background: #6c757d;
          color: white;
          &:hover:not(:disabled) {
            background: #5a6268;
          }
        `;
      case 'success':
        return `
          background: #28a745;
          color: white;
          &:hover:not(:disabled) {
            background: #218838;
          }
        `;
      case 'warning':
        return `
          background: #ffc107;
          color: #212529;
          &:hover:not(:disabled) {
            background: #e0a800;
          }
        `;
      default:
        return `
          background: #e9ecef;
          color: #495057;
          border: 1px solid #ced4da;
          &:hover:not(:disabled) {
            background: #dee2e6;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StatusIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop),
})`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: #d4edda;
          color: #155724;
        `;
      case 'completed':
        return `
          background: #cce5ff;
          color: #004085;
        `;
      case 'error':
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      default:
        return `
          background: #e2e3e5;
          color: #383d41;
        `;
    }
  }}
`;

const ProgressInfo = styled.div`
  font-size: 12px;
  color: #6c757d;
  text-align: center;
  padding: 4px 0;
`;

export const SessionActions = ({
  sessionStatus,
  reportAvailable,
  isLoading,
  sessionId,
  onDownloadReport,
  onNewChat,
  onEndSession,
  apiConnected,
  lastError
}) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // 보고서 다운로드 처리
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // 진행률 시뮬레이션 (실제로는 API에서 진행률을 받아올 수 있음)
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onDownloadReport();
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      setTimeout(() => {
        setDownloadProgress(0);
        setIsDownloading(false);
      }, 1000);

    } catch (error) {
      console.error('Download error:', error);
      setDownloadProgress(0);
      setIsDownloading(false);
    }
  };

  // 세션 상태별 렌더링
  const renderSessionStatus = () => {
    if (!apiConnected) {
      return (
        <StatusIndicator status="error">
          🔴 API 연결 끊김
        </StatusIndicator>
      );
    }

    switch (sessionStatus) {
      case 'active':
        return (
          <StatusIndicator status="active">
            🟢 상담 진행 중
          </StatusIndicator>
        );
      case 'completed':
        return (
          <StatusIndicator status="completed">
            ✅ 상담 완료
          </StatusIndicator>
        );
      case 'completing':
        return (
          <StatusIndicator status="active">
            ⏳ 상담 종료 중...
          </StatusIndicator>
        );
      default:
        return (
          <StatusIndicator status="idle">
            ⚪ 대기 중
          </StatusIndicator>
        );
    }
  };

  // 세션 진행 중 액션들
  const renderActiveSessionActions = () => (
    <ActionRow>
      <ActionButton
        variant="warning"
        onClick={onEndSession}
        disabled={isLoading || sessionStatus === 'completing'}
      >
        🏁 상담 종료
      </ActionButton>
      <ActionButton
        variant="secondary"
        onClick={onNewChat}
        disabled={isLoading}
      >
        🔄 새 상담
      </ActionButton>
    </ActionRow>
  );

  // 세션 완료 후 액션들
  const renderCompletedSessionActions = () => (
    <>
      <ActionRow>
        {reportAvailable && (
          <ActionButton
            variant="primary"
            onClick={handleDownloadReport}
            disabled={isLoading || isDownloading}
          >
            {isDownloading ? (
              <>⏳ 다운로드 중...</>
            ) : (
              <>📄 보고서 다운로드</>
            )}
          </ActionButton>
        )}
        <ActionButton
          variant="success"
          onClick={onNewChat}
          disabled={isLoading}
        >
          ✨ 새 상담 시작
        </ActionButton>
      </ActionRow>
      
      {isDownloading && downloadProgress > 0 && (
        <ProgressInfo>
          다운로드 진행률: {downloadProgress}%
        </ProgressInfo>
      )}
    </>
  );

  // 에러 상태 액션들
  const renderErrorActions = () => (
    <ActionRow>
      <ActionButton
        variant="warning"
        onClick={() => window.location.reload()}
        disabled={isLoading}
      >
        🔄 페이지 새로고침
      </ActionButton>
      <ActionButton
        variant="secondary"
        onClick={onNewChat}
        disabled={isLoading}
      >
        🆕 새로 시작
      </ActionButton>
    </ActionRow>
  );

  return (
    <ActionsContainer>
      {/* 세션 상태 표시 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {renderSessionStatus()}
        {sessionId && (
          <div style={{ fontSize: '11px', color: '#9aa0a6' }}>
            세션: {sessionId.substring(0, 8)}...
          </div>
        )}
      </div>

      {/* 에러 메시지 표시 */}
      {lastError && (
        <StatusIndicator status="error">
          ❌ {lastError.message}
        </StatusIndicator>
      )}

      {/* 상태별 액션 버튼들 */}
      {lastError ? (
        renderErrorActions()
      ) : sessionStatus === 'completed' ? (
        renderCompletedSessionActions()
      ) : (sessionStatus === 'active' || sessionStatus === 'completing') ? (
        renderActiveSessionActions()
      ) : null}
    </ActionsContainer>
  );
};