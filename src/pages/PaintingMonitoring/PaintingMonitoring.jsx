import React from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot'; // 추가

export const PaintingMonitoring = () => {
  const paintingEquipmentData = [
    {
      id: 1,
      name: "도장부스 1",
      title: "도장 표면 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "도장 중"
    },
    {
      id: 2,
      name: "도장부스 2", 
      title: "도장 공정 장비 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "도장 중"
    },
    {
      id: 3,
      name: "건조로 1", 
      title: "도장 표면 결함 탐지",
      status: "점검중",
      isOperating: false,
      manager: "관리자",
      operatingStatus: "점검 중"
    }
  ];

  return (
    <>
      <PageLayout 
        title="도장 공정 모니터링"
        description="도장 공정 수신 양호 🟢"
        footerTitle="도장 공정 품질 상태"
        footerDescription="도장 품질 관련 차트가 표시될 예정입니다."
        showFooter={true}
      >
        <EquipmentList 
          title="도장 장비 상태 목록"
          equipmentData={paintingEquipmentData}
          defaultImage="https://via.placeholder.com/100x100/FFE5CC/FF8C00?text=Paint"
          showConnectionStatus={false}
        />
      </PageLayout>
      <ChatBot /> {/* 챗봇 추가 */}
    </>
  );
};