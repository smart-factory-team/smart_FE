import React from "react";
import styled from "styled-components";

const StyledEquipmentList = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 60px;
  min-height: 600px;
  justify-content: center;
  overflow: hidden;
  padding: 60px;
  width: 100%;
`;

const Contents = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 60px 170px;
  width: 100%;
`;

const SectionTitle = styled.div`
  color: #000000;
  font-family: "Roboto", Helvetica;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 48px;
  margin-bottom: 40px;
  text-align: center;
`;

const EquipmentGrid = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: center;
  width: 100%;
  max-width: 1060px;
`;

const EquipmentCard = styled.div`
  align-items: flex-start;
  border: 1px solid #0000001a;
  border-radius: 6px;
  display: flex;
  width: 100%;
  gap: 16px;
  justify-content: center;
  padding: 16px;
`;

const ImageContainer = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 16px;
`;

const EquipmentImage = styled.div`
  background-color: #d8d8d880;
  height: 100px;
  width: 100px;
  border-radius: 4px;
  overflow: hidden;
  position: relative; 
`;

const Image = styled.img`
  height: 100px;         
  width: 100px;            
  object-fit: cover;     
`;

const EquipmentName = styled.div`
  color: #000000;
  font-family: "Inter", Helvetica;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  text-align: center;
  width: 100px;
`;

const InfoSection = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
`;

const EquipmentTitle = styled.div`
  align-self: stretch;
  color: #000000;
  font-family: "Roboto", Helvetica;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 28px;
  margin-top: -1.00px;
`;

const StatusText = styled.div`
  align-self: stretch;
  color: #000000;
  font-family: "Roboto", Helvetica;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 1. StatusIcon 수정
const StatusIcon = styled.div.withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop),
})`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
  background-color: ${props => props.status === 'normal' ? '#28a745' : props.status === 'anomaly' ? '#dc3545' : '#6c757d'};
  color: white;
  
  &::before {
    content: ${props => props.status === 'normal' ? '"✓"' : props.status === 'anomaly' ? '"✕"' : '"?"'};
  }
`;

// 2. StatusBadge 수정
const StatusBadge = styled.div.withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop),
})`
  align-items: center;
  background-color: ${props => {
    switch(props.status) {
      case 'normal': return '#d4edda';
      case 'anomaly': return '#f8d7da';
      case 'operating': return '#d4edda';
      case 'stopped': return '#f8d7da';
      default: return '#d8d8d880';
    }
  }};
  border: 0.5px solid #0000001a;
  border-radius: 2px;
  display: inline-flex;
  gap: 2px;
  justify-content: center;
  overflow: hidden;
  padding: 2px 4px;
  margin: 4px 0;
`;

// 3. BadgeText 수정
const BadgeText = styled.div.withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop),
})`
  color: ${props => {
    switch(props.status) {
      case 'normal': return '#155724';
      case 'anomaly': return '#721c24';
      case 'operating': return '#856404';
      case 'stopped': return '#721c24';
      default: return '#000000';
    }
  }};
  font-family: "Roboto", Helvetica;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 16px;
  white-space: nowrap;
`;

// 4. Indicator도 수정
const Indicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})`
  background-color: ${props => props.active ? '#28a745' : '#d8d8d880'};
  height: 5px;
  width: 40px;
  border-radius: 2px;
`;

const UserInfo = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  gap: 8px;
  padding: 4px 0;
  width: 100%;
`;

const Avatar = styled.div`
  background-color: #0000001a;
  border-radius: 20px;
  height: 20px;
  width: 20px;
`;

const UserName = styled.div`
  color: #000000;
  font-family: "Roboto", Helvetica;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 20px;
  margin-left: 8px;
`;

const StatusIndicators = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 16px;
  padding: 45px 0px;
`;

export const EquipmentList = ({
  title = "장비 상태 목록",
  equipmentData = [],
  defaultImage = "https://c.animaapp.com/DYKcRidV/img/image-13-2@2x.png",
  showConnectionStatus = true
}) => {

  const getStatusType = (equipment) => {
    if (equipment.status === '결함감지' || equipment.status === '이상') return 'anomaly';
    if (equipment.status === '정상') return 'normal';
    return 'unknown';
  };

  const getOperatingStatusType = (equipment) => {
    if (equipment.operatingStatus === '도장 중' || equipment.operatingStatus === '활성') return 'operating';
    if (equipment.operatingStatus === '정지' || equipment.operatingStatus === '중지' || equipment.operatingStatus === '비활성' || equipment.operatingStatus === '이상 탐지' || equipment.operatingStatus === '이상 감지') return 'stopped';
    return 'unknown';
  };

  return (
    <StyledEquipmentList>
      <Contents>
        <SectionTitle>{title}</SectionTitle>

        <EquipmentGrid>
          {equipmentData.map((equipment) => (
            <EquipmentCard key={equipment.id}>
              <ImageContainer>
                <EquipmentImage>
                  <Image
                    alt="Equipment"
                    src={equipment.image || defaultImage}
                  />
                </EquipmentImage>
                <EquipmentName>{equipment.name}</EquipmentName>
              </ImageContainer>

              <InfoSection>
                <EquipmentTitle>
                  {equipment.title}
                </EquipmentTitle>

                <StatusText>
                  상태: {equipment.status}
                  <StatusIcon status={getStatusType(equipment)} />
                </StatusText>

                <StatusBadge status={getOperatingStatusType(equipment)}>
                  <BadgeText status={getOperatingStatusType(equipment)}>
                    {equipment.operatingStatus || (equipment.isOperating ? '가동 중' : '정지')}
                  </BadgeText>
                </StatusBadge>

                <UserInfo>
                  <Avatar />
                  <UserName>{equipment.manager || '관리자'}</UserName>
                  {showConnectionStatus && equipment.isConnected && (
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#28a745' }}>
                      🔗 실시간 연결
                    </span>
                  )}
                </UserInfo>
              </InfoSection>

              <StatusIndicators>
                <Indicator active={equipment.isOperating} />
                <Indicator active={equipment.isOperating} />
                <Indicator active={equipment.isOperating} />
              </StatusIndicators>
            </EquipmentCard>
          ))}
        </EquipmentGrid>
      </Contents>
    </StyledEquipmentList>
  );
};