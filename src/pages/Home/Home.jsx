import React from "react";
import styled from "styled-components";
import { List } from "../../components/list";

const StyledScreen = styled.div`
  align-items: center;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 80px 0px 0px;
  position: relative;

  .top-bar {
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0px 0px 6px #0000001f;
    display: flex;
    gap: 20px;
    height: 80px;
    justify-content: center;
    left: 0;
    padding: 20px;
    position: absolute;
    top: 0;
    width: 1440px;
  }

  .rectangle {
    background-color: #0000001a;
    border-radius: 100px;
    height: 40px;
    position: relative;
    width: 40px;
  }

  .p {
    color: #000000;
    flex: 1;
    font-family: "Roboto", Helvetica;
    font-size: 28px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 36px;
    position: relative;
  }

  .navigation {
    align-items: center;
    background-color: #ffffff;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 40px;
    justify-content: center;
    position: relative;
  }

  .tab {
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 24px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
  }

  .textfield-2 {
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
  }

  .text-2 {
    color: #00000080;
    flex: 1;
    font-family: "Roboto", Helvetica;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 20px;
    margin-top: -1.00px;
    position: relative;
  }

  .ic-search {
    aspect-ratio: 1;
    height: 20px;
    position: relative;
    width: 20px;
  }

  .section {
    align-items: center;
    align-self: stretch;
    border: 0.3px solid;
    border-color: #dbe0e5;
    display: flex;
    height: 254px;
    justify-content: center;
    overflow: hidden;
    padding: 70px 0px 60px 200px;
    position: relative;
    width: 100%;
  }

  .container {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    padding: 10px 0px;
    position: relative;
    width: 510px;
  }

  .title-2 {
    align-self: stretch;
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 40px;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 48px;
    margin-top: -1.00px;
    position: relative;
  }

  .description {
    align-self: stretch;
    color: #607289;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 24px;
    position: relative;
  }

  .vector {
    height: 1px;
    left: 0;
    object-fit: cover;
    position: absolute;
    top: 254px;
    width: 1440px;
  }

  .image {
    height: 254px;
    margin-bottom: -60.00px;
    margin-left: -94px;
    margin-top: -70.00px;
    object-fit: cover;
    position: relative;
    width: 822px;
  }

  .form {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex: 0 0 auto;
    gap: 60px;
    justify-content: center;
    overflow: hidden;
    padding: 60px 170px 63px;
    position: relative;
    width: 100%;
  }

  .container-2 {
    align-items: flex-start;
    display: flex;
    flex: 1;
    flex-direction: column;
    flex-grow: 1;
    gap: 24px;
    position: relative;
  }

  .description-2 {
    align-self: stretch;
    color: #7f7f7f;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 24px;
    position: relative;
  }

  .list-instance {
    flex: 1 !important;
    flex-grow: 1 !important;
    width: unset !important;
  }

  .img {
    height: 1px;
    left: 0;
    object-fit: cover;
    position: absolute;
    top: 450px;
    width: 1440px;
  }

  .container-wrapper {
    align-items: center;
    align-self: stretch;
    display: flex;
    gap: 60px;
    height: 190px;
    justify-content: center;
    padding: 60px;
    position: relative;
    width: 100%;
  }

  .container-3 {
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 60px;
    height: 100px;
    justify-content: center;
    margin-bottom: -15.00px;
    margin-top: -15.00px;
    position: relative;
  }

  .title-3 {
    align-self: stretch;
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 28px;
    margin-top: -1.00px;
    position: relative;
    text-align: center;
    width: 74px;
  }

  .title-4 {
    align-self: stretch;
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 28px;
    margin-top: -1.00px;
    position: relative;
    text-align: center;
    width: 148px;
  }
`;

export const Home = () => {
  return (
    <StyledScreen data-model-id="36:604">


      <div className="section">
        <div className="container">
          <div className="title-2">스마트 팩토리 솔루션</div>

          <p className="description">
            최신 AI 기술로 결함 탐지를 자동화하고, 생산성을 극대화하세요!
          </p>
        </div>

        <img
          className="vector"
          alt="Vector"
          src="https://c.animaapp.com/0vnVVfRX/img/vector-200-1.svg"
        />

        <img
          className="image"
          alt="Image"
          src="https://c.animaapp.com/0vnVVfRX/img/-------.png"
        />
      </div>

      <div className="form">
        <div className="container-2">
          <div className="title-2">로그인</div>

          <div className="description-2">
            이미 계정이 있으신가요? 로그인하세요.
          </div>
        </div>

        <List className="list-instance" />
        <img
          className="img"
          alt="Vector"
          src="https://c.animaapp.com/0vnVVfRX/img/vector-200-1.svg"
        />
      </div>

      <div className="container-wrapper">
        <div className="container-3">
          <div className="title-3">문의하기</div>

          <div className="title-4">개인정보처리방침</div>

          <div className="title-3">이용약관</div>
        </div>
      </div>
    </StyledScreen>
  );
};
