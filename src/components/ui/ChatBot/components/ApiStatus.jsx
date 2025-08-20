// ===============================
// ApiStatus.jsx - API 상태 표시 컴포넌트
// src/components/ui/ChatBot/components/ApiStatus.jsx
// ===============================

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// 애니메이션
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 스타일 컴포넌트
const StatusContainer = styled.div`
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideDown} 0.3s ease-out;
`;

const StatusIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['connected', 'loading'].includes(prop),
})`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      if (props.loading) return '#ffc107';
      return props.connected ? '#28a745' : '#dc3545';
    }};
    animation: ${props => props.loading ? pulse : 'none'} 1s infinite;
  }
`;

const ConnectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  opacity: 0.9;
`;

const RefreshButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorDetails = styled.div`
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 11px;
  color: #721c24;
  background-color: #f8d7da;
`;

export const ApiStatus = ({
  apiConnected,
  isLoading,
  lastError,
  onRefreshConnection,
  serverUrl = 'http://localhost:8000'
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [connectionTime, setConnectionTime] = useState(null);

  // 연결 성공 시 시간 기록
  useEffect(() => {
    if (apiConnected && !isLoading) {
      setConnectionTime(new Date());
    }
  }, [apiConnected, isLoading]);

  // 연결 상태에 따른 메시지
  const getStatusMessage = () => {
    if (isLoading) {
      return '서버 연결 확인 중...';
    }
    
    if (apiConnected) {
      return '서버 연결됨';
    }
    
    if (lastError) {
      switch (lastError.type) {
        case 'NETWORK_ERROR':
          return '네트워크 연결 오류';
        case 'TIMEOUT_ERROR':
          return '서버 응답 시간 초과';
        case 'SERVER_ERROR':
          return '서버 내부 오류';
        default:
          return '서버 연결 실패';
      }
    }
    
    return '서버 연결 확인 필요';
  };

  // 연결 정보 포맷팅
  const formatConnectionTime = () => {
    if (!connectionTime) return null;
    
    return connectionTime.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      <StatusContainer>
        <StatusIndicator connected={apiConnected} loading={isLoading}>
          <div className="status-dot"></div>
          <span>{getStatusMessage()}</span>
        </StatusIndicator>

        <ConnectionInfo>
          {apiConnected && connectionTime && (
            <span>연결: {formatConnectionTime()}</span>
          )}
          
          <RefreshButton
            onClick={onRefreshConnection}
            disabled={isLoading}
            title="연결 상태 새로고침"
          >
            🔄
          </RefreshButton>
          
          {lastError && (
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '2px 4px'
              }}
              onClick={() => setShowDetails(!showDetails)}
              title="오류 상세 정보"
            >
              {showDetails ? '▼' : '▶'} 상세
            </button>
          )}
        </ConnectionInfo>
      </StatusContainer>

      {/* 에러 상세 정보 */}
      {showDetails && lastError && (
        <ErrorDetails>
          <div><strong>오류 유형:</strong> {lastError.type}</div>
          <div><strong>오류 메시지:</strong> {lastError.message}</div>
          <div><strong>서버 주소:</strong> {serverUrl}</div>
          <div><strong>발생 시간:</strong> {new Date(lastError.timestamp).toLocaleString('ko-KR')}</div>
          {lastError.statusCode && (
            <div><strong>HTTP 상태:</strong> {lastError.statusCode}</div>
          )}
        </ErrorDetails>
      )}
    </>
  );
};