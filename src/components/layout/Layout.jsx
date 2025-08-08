import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  /* margin-top 제거! */
`;

const SidebarArea = styled.div`
  width: 220px;
  flex-shrink: 0;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  min-height: calc(100vh - 80px);
`;

export const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContainer>
        <SidebarArea>
          <Sidebar />
        </SidebarArea>
        <ContentArea>
          {children}
        </ContentArea>
      </MainContainer>
    </LayoutContainer>
  );
};