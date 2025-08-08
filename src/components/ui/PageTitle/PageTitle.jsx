import React from "react";
import styled from "styled-components";

const StyledPageTitle = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  gap: 60px;
  justify-content: center;
  overflow: hidden;
  padding: 60px;
  width: 100%;
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  flex-grow: 1;
  gap: 24px;
  position: relative;
`;

const Title = styled.div`
  color: #000000;
  font-family: "Roboto", Helvetica;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 48px;
  margin-top: -1.00px;
  position: relative;
  text-align: center;
  width: 520px;
`;

const Description = styled.p`
  color: #000000;
  font-family: "Roboto", Helvetica;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
  position: relative;
  text-align: center;
  width: 520px;
`;

export const PageTitle = ({ title, description, status = "정상" }) => {
  const getStatusDisplay = () => {
    if (status === "정상") {
      return "차체 공정 수신 양호 🟢";
    }
    return `차체 공정 수신 ${status}`;
  };

  return (
    <StyledPageTitle>
      <Container>
        <Title>{title}</Title>
        <Description>{description || getStatusDisplay()}</Description>
      </Container>
    </StyledPageTitle>
  );
};