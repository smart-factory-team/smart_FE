import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

// 기존 스타일 그대로 유지
const StyledSidebar = styled.div`
  align-items: center;
  background-color: #0000000d;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  left: 0;
  padding: 12px 0px;
  position: fixed;
  top: 80px;
  width: 220px;
  z-index: 999;

  & .item {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex: 0 0 auto;
    gap: 12px;
    justify-content: center;
    padding: 16px 20px;
    position: relative;
    width: 100%;
    cursor: pointer;
    
    &:hover {
      background-color: #f2f2f2;
    }
  }

  & .frame {
    aspect-ratio: 1;
    background-color: #0000000d;
    border-radius: 12px;
    height: 24px;
    position: relative;
    width: 24px;
  }

  & .icon {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    color: #000000;
    display: -webkit-box;
    font-family: "Roboto", Helvetica;
    font-size: 15px;
    font-weight: 400;
    height: 24px;
    left: 0;
    letter-spacing: 0;
    line-height: 24px;
    overflow: hidden;
    position: absolute;
    text-align: center;
    text-overflow: ellipsis;
    top: -1px;
    white-space: nowrap;
    width: 24px;
  }

  & .text-wrapper {
    color: #000000;
    flex: 1;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 20px;
    position: relative;
  }

  & .active {
    background-color: #ffffff;
    
    .text-wrapper {
      font-weight: 600;
    }
  }
`;

// Link 스타일 - 기본 스타일 제거
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
`;

export const Sidebar = () => {
  const location = useLocation();

  return (
    <StyledSidebar>
      <StyledLink to="/">
        <div className={`item ${location.pathname === '/' ? 'active' : ''}`}>
          <div className="frame">
            <div className="icon">🔍</div>
          </div>
          <div className="text-wrapper">통합 모니터링</div>
        </div>
      </StyledLink>

      <StyledLink to="/press">
        <div className={`item ${location.pathname === '/press' ? 'active' : ''}`}>
          <div className="frame">
            <div className="icon">⚙</div>
          </div>
          <div className="text-wrapper">프레스 공정 모니터링</div>
        </div>
      </StyledLink>

      <StyledLink to="/vehicle">
        <div className={`item ${location.pathname === '/vehicle' ? 'active' : ''}`}>
          <div className="frame">
            <div className="icon">🤖</div>
          </div>
          <div className="text-wrapper">차체 공정 모니터링</div>
        </div>
      </StyledLink>

      <StyledLink to="/painting">
        <div className={`item ${location.pathname === '/painting' ? 'active' : ''}`}>
          <div className="frame">
            <div className="icon">🎨</div>
          </div>
          <div className="text-wrapper">도장 공정 모니터링</div>
        </div>
      </StyledLink>

      <StyledLink to="/assembly">
        <div className={`item ${location.pathname === '/assembly' ? 'active' : ''}`}>
          <div className="frame">
            <div className="icon">🔧</div>
          </div>
          <div className="text-wrapper">의장 조립 공정 모니터링</div>
        </div>
      </StyledLink>

      <StyledLink to="/board">
        <div className={`item ${location.pathname === '/board' ? 'active' : ''}`}>
          <div className="frame">
            <div className="icon">📊</div>
          </div>
          <div className="text-wrapper">게시판</div>
        </div>
      </StyledLink>

      <StyledLink to="/mypage">
        <div className={`item ${location.pathname === '/mypage' ? 'active' : ''}`}>
          <div className="frame">
            <div className="icon">👤</div>
          </div>
          <div className="text-wrapper">마이페이지</div>
        </div>
      </StyledLink>
    </StyledSidebar>
  );
};