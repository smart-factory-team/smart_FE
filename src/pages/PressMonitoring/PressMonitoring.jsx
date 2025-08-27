import React from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot'; // 추가

export const PressMonitoring = () => {
  const pressEquipmentData = [
    {
      id: 1,
      name: "프레스 1",
      title: "유압펌프 고장 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "가동 중"
    },
    {
      id: 2,
      name: "프레스 2", 
      title: "유압펌프 고장 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "가동 중"
    },
    {
      id: 3,
      name: "프레스 3", 
      title: "유압펌프 고장 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "가동 중"
    }
  ];

  return (
    <>
      <PageLayout 
        title="프레스 공정 모니터링"
        description="프레스 공정 수신 양호 🟢"
        footerTitle="프레스 공정 가공률 상태"
        footerDescription="차트 컴포넌트가 여기에 들어갈 예정입니다."
        showFooter={true}
      >
        <EquipmentList 
          title="프레스별 상태 목록"
          equipmentData={pressEquipmentData}
          defaultImage="https://via.placeholder.com/100x100/cccccc/666666?text=Press"
          showConnectionStatus={false}
        />
      </PageLayout>
      <ChatBot /> {/* 챗봇 추가 */}
    </>
  );
};