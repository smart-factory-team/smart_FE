import React from 'react';
import styled from 'styled-components';

// 헤더/사이드바 크기에 맞춘 정확한 계산
const HEADER_HEIGHT = 80;
const SIDEBAR_WIDTH = 220;

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  padding: 0; /* Layout.jsx에서 이미 margin/padding 처리됨 */
`;

const PageHeader = styled.div`
  padding: 40px 60px;
  text-align: center;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  
  h1 {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #000000;
    font-family: "Roboto", Helvetica;
  }
  
  p {
    font-size: 16px;
    color: #000000;
    font-family: "Roboto", Helvetica;
    margin: 0;
  }
`;

const PageContent = styled.div`
  flex: 1;
  background-color: #ffffff;
`;

const PageFooter = styled.div`
  padding: 40px 60px;
  text-align: center;
  color: #666;
  border-top: 1px solid #f0f0f0;
  background-color: #ffffff;
  
  h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #000000;
    font-family: "Roboto", Helvetica;
  }
  
  p {
    font-size: 16px;
    color: #666;
    font-family: "Roboto", Helvetica;
    margin: 0;
  }
`;

export const PageLayout = ({ 
  title, 
  description, 
  children, 
  footerTitle,
  footerDescription,
  showFooter = false 
}) => {
  return (
    <PageContainer>
      {title && (
        <PageHeader>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </PageHeader>
      )}
      
      <PageContent>
        {children}
      </PageContent>
      
      {showFooter && (footerTitle || footerDescription) && (
        <PageFooter>
          {footerTitle && <h2>{footerTitle}</h2>}
          {footerDescription && <p>{footerDescription}</p>}
        </PageFooter>
      )}
    </PageContainer>
  );
};