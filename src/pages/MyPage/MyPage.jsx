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

export const MyPage = () => {
  return (
    <Container>
      <Title>👤 마이페이지</Title>
      <p>사용자 정보 및 설정을 관리할 수 있습니다.</p>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>사용자 정보</h3>
        <p>• 이름: 관리자</p>
        <p>• 권한: 시스템 관리자</p>
        <p>• 마지막 로그인: 방금 전</p>
      </div>
    </Container>
  );
};