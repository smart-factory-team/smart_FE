import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 32px;
`;

export const Board = () => {
  return (
    <Container>
      <Title>📊 게시판</Title>
      <p>공지사항 및 시스템 로그를 확인할 수 있습니다.</p>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>최근 알림</h3>
        <p>• 시스템 정기 점검 완료 (2024-01-15)</p>
        <p>• 새로운 AI 모델 업데이트 (2024-01-14)</p>
      </div>
    </Container>
  );
};