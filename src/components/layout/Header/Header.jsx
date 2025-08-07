// TopBarSubsection 코드를 그대로 복사하되, 컴포넌트명만 Header로 변경
import React from "react";
import styled from "styled-components";

const StyledHeader = styled.div`
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0px 0px 6px #0000001f;
  display: flex;
  gap: 20px;
  height: 80px;
  justify-content: center;
  padding: 20px;
  position: sticky;  /* fixed를 sticky로 변경 */
  top: 0;           /* 스크롤 시 상단에 고정 */
  width: 100%;
  z-index: 1000;
`;

// 나머지 styled 컴포넌트들은 동일하게 복사...
const Rectangle = styled.div`
  background-color: #0000001a;
  border-radius: 100px;
  height: 40px;
  position: relative;
  width: 40px;
`;

const Title = styled.p`
  color: #000000;
  flex: 1;
  font-family: "Roboto", Helvetica;
  font-size: 28px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 36px;
  position: relative;
`;

const Navigation = styled.div`
  align-items: center;
  background-color: #ffffff;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 40px;
  justify-content: center;
  position: relative;
`;

const Tab = styled.div`
  color: #000000;
  font-family: "Roboto", Helvetica;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
  cursor: pointer;  /* 클릭 가능하도록 추가 */
  
  &:hover {
    color: #666;    /* 호버 효과 추가 */
  }
`;

const Textfield = styled.div`
  align-items: center;
  border: 1px solid;
  border-color: #0000001a;
  border-radius: 6px;
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  padding: 8px;
  position: relative;
  width: 200px;
`;

const Text = styled.div`
  color: #00000080;
  flex: 1;
  font-family: "Roboto", Helvetica;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  margin-top: -1.00px;
  position: relative;
`;

const SearchIcon = styled.img`
  aspect-ratio: 1;
  height: 20px;
  position: relative;
  width: 20px;
`;

export const Header = () => {
  return (
    <StyledHeader>
      <Rectangle />
      <Title>자동차 스마트 팩토리 공정 모니터링 플랫폼</Title>
      <Navigation>
        <Tab>홈</Tab>
        <Tab>문서</Tab>
        <Tab>지원</Tab>
        <Textfield>
          <Text>Search in site</Text>
          <SearchIcon
            alt="Ic search"
            src="https://c.animaapp.com/DYKcRidV/img/ic-search.svg"
          />
        </Textfield>
      </Navigation>
    </StyledHeader>
  );
};

