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

const IntroSection = styled.div`
  margin-top: 60px;
  padding: 40px 60px;
`;

const IntroTitle = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #212529;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MetricCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 30px 20px;
  text-align: center;

  h3 {
    font-size: 2rem;
    margin: 0;
    color: #007bff;
  }

  p {
    margin-top: 10px;
    font-size: 1rem;
    color: #495057;
  }
`;

export const Dashboard = () => {
  return (
    <PageLayout 
      title="통합 모니터링 대시보드"
      description="전체 공정 상태를 종합적으로 모니터링합니다."
      showFooter={true}
    >
      {/* 공정별 카드 */}
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
          <p>도장부스: 3대 가동</p>
          <p>효율: 87%</p>
        </StatusCard>

        <StatusCard status="normal">
          <h3>🔧 의장 조립</h3>
          <p>상태: 정상</p>
          <p>조립라인: 3라인 가동</p>
          <p>효율: 92%</p>
        </StatusCard>
      </OverviewGrid>

      {/* 소개 + 핵심 지표 섹션 */}
      <IntroSection>
        <IntroTitle>🚗 프로젝트 소개 & 핵심 지표</IntroTitle>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 30px auto', color: '#495057' }}>
          본 플랫폼은 자동차 제조 공정을 스마트 팩토리 환경에서 <b>실시간 모니터링</b>하는 서비스입니다.  
          AI 기반 공정별 분석을 통해 <b>불량률 감소, 생산 효율 향상, 안전성 강화</b>를 목표로 합니다.
        </p>

        <MetricsGrid>
          <MetricCard>
            <h3>⬇️ 32%</h3>
            <p>불량률 감소</p>
          </MetricCard>
          <MetricCard>
            <h3>6개</h3>
            <p>적용된 AI 모델</p>
          </MetricCard>
          <MetricCard>
            <h3>99%</h3>
            <p>실시간 데이터 처리율</p>
          </MetricCard>
          <MetricCard>
            <h3>24/7</h3>
            <p>상시 모니터링 지원</p>
          </MetricCard>
        </MetricsGrid>
      </IntroSection>
    </PageLayout>
  );
};
