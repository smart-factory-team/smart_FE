// ===============================
// ApiTestComponent.jsx - API 연결 테스트 컴포넌트
// src/components/ui/ChatBot/test/ApiTestComponent.jsx
// ===============================

import React, { useState } from 'react';
import styled from 'styled-components';
import chatApi from '../services/chatApi';
import reportApi from '../services/reportApi';

// 테스트 컴포넌트 스타일
const TestContainer = styled.div`
  padding: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  margin: 20px;
  background: white;
`;

const TestButton = styled.button`
  padding: 8px 16px;
  margin: 5px;
  border: 1px solid #667eea;
  border-radius: 4px;
  background: #667eea;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: #5a67d8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const TestResult = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  background: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  white-space: pre-wrap;
`;

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (name, success, data, error = null) => {
    const result = {
      id: Date.now(),
      name,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // 최근 10개만 유지
  };

  // 1. API 헬스 체크 테스트
  const testApiHealth = async () => {
    setIsLoading(true);
    try {
      const isHealthy = await chatApi.checkApiHealth();
      addResult('API Health Check', isHealthy, { healthy: isHealthy });
    } catch (error) {
      addResult('API Health Check', false, null, error.message);
    }
    setIsLoading(false);
  };

  // 2. API 핑 테스트
  const testApiPing = async () => {
    setIsLoading(true);
    try {
      const result = await chatApi.pingApiServer();
      addResult('API Ping Test', result.success, result);
    } catch (error) {
      addResult('API Ping Test', false, null, error.message);
    }
    setIsLoading(false);
  };

  // 3. 세션 생성 테스트
  const testSessionCreate = async () => {
    setIsLoading(true);
    try {
      const result = await chatApi.createNewSession({
        test: true,
        category: 'multi-agent'
      });
      addResult('Session Create', result.success, result);
    } catch (error) {
      addResult('Session Create', false, null, error.message);
    }
    setIsLoading(false);
  };

  // 4. 챗봇 메시지 테스트 (통합 문의)
  const testChatMessage = async () => {
    setIsLoading(true);
    try {
      const result = await chatApi.sendChatMessage(
        'multi-agent', 
        '안녕하세요, 테스트 메시지입니다.',
        { test: true }
      );
      addResult('Chat Message Test', result.success, result);
    } catch (error) {
      addResult('Chat Message Test', false, null, error.message);
    }
    setIsLoading(false);
  };

  // 5. 이슈 기반 챗봇 시작 테스트
  const testIssueChat = async () => {
    setIsLoading(true);
    try {
      const mockIssue = {
        id: "WELD-CURRENT_AND_VIBRATION-ANOMALY",
        name: "용접 전류+진동 복합 이상",
        category: "복합 이상",
        severity: "매우높음"
      };
      
      const result = await chatApi.startChatFromIssue(mockIssue, 'multi-agent');
      addResult('Issue Chat Start', result.success, result);
    } catch (error) {
      addResult('Issue Chat Start', false, null, error.message);
    }
    setIsLoading(false);
  };

  // 6. GPT API 테스트 (안전 문의)
  const testGptApi = async () => {
    setIsLoading(true);
    try {
      const result = await chatApi.sendChatMessage(
        'safety', 
        '안전 관련 테스트 메시지입니다.',
        { test: true }
      );
      addResult('GPT API Test', result.success, result);
    } catch (error) {
      addResult('GPT API Test', false, null, error.message);
    }
    setIsLoading(false);
  };

  // 7. Gemini API 테스트 (기술 문의)
  const testGeminiApi = async () => {
    setIsLoading(true);
    try {
      const result = await chatApi.sendChatMessage(
        'technical', 
        '기술 관련 테스트 메시지입니다.',
        { test: true }
      );
      addResult('Gemini API Test', result.success, result);
    } catch (error) {
      addResult('Gemini API Test', false, null, error.message);
    }
    setIsLoading(false);
  };

  // 8. 모든 테스트 실행
  const runAllTests = async () => {
    await testApiHealth();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testApiPing();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testSessionCreate();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testChatMessage();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testGptApi();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testGeminiApi();
  };

  // 결과 초기화
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <TestContainer>
      <h3>🧪 챗봇 API 연결 테스트</h3>
      <p>API 서버: <code>http://localhost:8000</code></p>
      
      <div style={{ marginBottom: '20px' }}>
        <TestButton onClick={testApiHealth} disabled={isLoading}>
          1. Health Check
        </TestButton>
        <TestButton onClick={testApiPing} disabled={isLoading}>
          2. Ping Test
        </TestButton>
        <TestButton onClick={testSessionCreate} disabled={isLoading}>
          3. Session Create
        </TestButton>
        <TestButton onClick={testChatMessage} disabled={isLoading}>
          4. Chat Test (/chat/test)
        </TestButton>
        <TestButton onClick={testGptApi} disabled={isLoading}>
          5. GPT API (/api/gpt)
        </TestButton>
        <TestButton onClick={testGeminiApi} disabled={isLoading}>
          6. Gemini API (/api/gemini)
        </TestButton>
        <TestButton onClick={testIssueChat} disabled={isLoading}>
          7. Issue Chat Start
        </TestButton>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <TestButton onClick={runAllTests} disabled={isLoading}>
          🚀 모든 테스트 실행
        </TestButton>
        <TestButton onClick={clearResults} disabled={isLoading}>
          🗑️ 결과 초기화
        </TestButton>
      </div>

      {isLoading && (
        <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
          ⏳ 테스트 실행 중...
        </div>
      )}

      <div>
        <h4>📋 테스트 결과</h4>
        {testResults.length === 0 ? (
          <p style={{ color: '#666' }}>아직 테스트 결과가 없습니다.</p>
        ) : (
          testResults.map(result => (
            <TestResult key={result.id} success={result.success}>
              <strong>[{result.timestamp}] {result.name}</strong>
              <br />
              상태: {result.success ? '✅ 성공' : '❌ 실패'}
              <br />
              {result.success ? (
                <>응답: {JSON.stringify(result.data, null, 2)}</>
              ) : (
                <>에러: {result.error}</>
              )}
            </TestResult>
          ))
        )}
      </div>
    </TestContainer>
  );
};

export default ApiTestComponent;