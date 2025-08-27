// ===============================
// ChatBotErrorBoundary.jsx - 챗봇 에러 바운더리
// src/components/ui/ChatBot/components/ChatBotErrorBoundary.jsx
// ===============================

import React from 'react';
import styled from 'styled-components';

// 에러 화면 스타일
const ErrorContainer = styled.div`
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px;
  border: 1px solid #e9ecef;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h3`
  color: #dc3545;
  margin: 0 0 12px 0;
  font-size: 18px;
`;

const ErrorMessage = styled.p`
  color: #6c757d;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ErrorButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #6c757d;
  border-radius: 4px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #6c757d;
    color: white;
  }
  
  &.primary {
    background: #667eea;
    border-color: #667eea;
    color: white;
    
    &:hover {
      background: #5a67d8;
      border-color: #5a67d8;
    }
  }
`;

const ErrorDetails = styled.details`
  margin-top: 16px;
  text-align: left;
  background: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  
  summary {
    cursor: pointer;
    font-weight: 500;
    color: #495057;
    margin-bottom: 8px;
  }
  
  pre {
    background: #f8f9fa;
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    color: #6c757d;
    margin: 0;
    white-space: pre-wrap;
  }
`;

class ChatBotErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
    return {
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 정보를 상태에 저장
    this.setState({
      error,
      errorInfo
    });

    // 개발 환경에서 에러 로깅
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 ChatBot Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // 프로덕션 환경에서 에러 리포팅
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  reportError = (error, errorInfo) => {
    // 에러 리포팅 서비스로 전송
    // 예: Sentry, LogRocket, 자체 로깅 시스템 등
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId
    };

    // TODO: 실제 에러 리포팅 서비스 연동
    console.log('Error Report:', errorReport);
  };

  handleRestart = () => {
    // 챗봇 전체 재시작
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
    
    // 부모 컴포넌트의 재시작 콜백 호출
    if (this.props.onRestart) {
      this.props.onRestart();
    }
  };

  handleRefresh = () => {
    // 페이지 새로고침
    window.location.reload();
  };

  handleReportBug = () => {
    // 버그 리포트 생성
    const bugReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // 클립보드에 복사
    navigator.clipboard.writeText(JSON.stringify(bugReport, null, 2))
      .then(() => {
        alert('버그 리포트가 클립보드에 복사되었습니다.');
      })
      .catch(() => {
        console.log('Bug Report:', bugReport);
        alert('버그 리포트를 콘솔에서 확인해주세요.');
      });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>🤖💥</ErrorIcon>
          <ErrorTitle>챗봇에 문제가 발생했습니다</ErrorTitle>
          <ErrorMessage>
            죄송합니다. 챗봇 서비스에 예상치 못한 오류가 발생했습니다.<br />
            아래 버튼을 통해 다시 시도하거나 페이지를 새로고침해주세요.
          </ErrorMessage>

          <ErrorActions>
            <ErrorButton 
              className="primary" 
              onClick={this.handleRestart}
            >
              🔄 챗봇 다시 시작
            </ErrorButton>
            <ErrorButton onClick={this.handleRefresh}>
              🌐 페이지 새로고침
            </ErrorButton>
            <ErrorButton onClick={this.handleReportBug}>
              🐛 버그 리포트
            </ErrorButton>
          </ErrorActions>

          {/* 개발 환경에서만 에러 상세 정보 표시 */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>개발자 정보 (상세 에러)</summary>
              <div>
                <strong>에러 메시지:</strong>
                <pre>{this.state.error.message}</pre>
              </div>
              <div>
                <strong>스택 트레이스:</strong>
                <pre>{this.state.error.stack}</pre>
              </div>
              {this.state.errorInfo && (
                <div>
                  <strong>컴포넌트 스택:</strong>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              )}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ChatBotErrorBoundary;