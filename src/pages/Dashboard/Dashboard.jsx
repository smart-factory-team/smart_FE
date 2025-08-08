import React from 'react';
import { PageLayout } from '../../components/layout';
import styled from 'styled-components';

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 40px 60px;
`;

const StatusCard = styled.div`
  background: ${props => props.status === 'normal' ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${props => props.status === 'normal' ? '#c3e6cb' : '#f5c6cb'};
  border-radius: 8px;
  padding: 20px;
  text-align: center;

  h3 {
    margin: 0 0 10px 0;
    color: ${props => props.status === 'normal' ? '#155724' : '#721c24'};
  }

  p {
    margin: 5px 0;
    color: ${props => props.status === 'normal' ? '#155724' : '#721c24'};
  }
`;

export const Dashboard = () => {
  return (
    <PageLayout 
      title="통합 모니터링 대시보드"
      description="전체 공정 상태를 종합적으로 모니터링합니다."
      footerTitle="전체 공정 통합 현황"
      footerDescription="통합 대시보드 차트가 표시될 예정입니다."
      showFooter={true}
    >
      <OverviewGrid>
        <StatusCard status="normal">
          <h3>🤖 차체 공정</h3>
          <p>상태: 정상</p>
          <p>용접기: 3대 가동</p>
          <p>효율: 98%</p>
        </StatusCard>

        <StatusCard status="normal">
          <h3>⚙️ 프레스 공정</h3>
          <p>상태: 정상</p>
          <p>프레스: 3대 가동</p>
          <p>효율: 95%</p>
        </StatusCard>

        <StatusCard status="normal">
          <h3>🎨 도장 공정</h3>
          <p>상태: 점검중</p>
          <p>도장부스: 2대 가동</p>
          <p>효율: 87%</p>
        </StatusCard>

        <StatusCard status="normal">
          <h3>🔧 의장 조립</h3>
          <p>상태: 정상</p>
          <p>조립라인: 3라인 가동</p>
          <p>효율: 92%</p>
        </StatusCard>
      </OverviewGrid>
    </PageLayout>
  );
};