import React from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot'; // 추가

export const AssemblyMonitoring = () => {
  const assemblyEquipmentData = [
    {
      id: 1,
      name: "조립라인 A",
      title: "차량 조립 공정 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "조립 중"
    },
    {
      id: 2,
      name: "조립라인 B", 
      title: "차량 조립 공정 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "조립 중"
    },
    {
      id: 3,
      name: "검사라인", 
      title: "최종 품질 검사",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "검사 중"
    }
  ];

  return (
    <>
      <PageLayout 
        title="의장 조립 공정 모니터링"
        description="의장 조립 공정 수신 양호 🟢"
        footerTitle="조립 공정 효율성 상태"
        footerDescription="조립 효율성 관련 차트가 표시될 예정입니다."
        showFooter={true}
      >
        <EquipmentList 
          title="조립 라인 상태 목록"
          equipmentData={assemblyEquipmentData}
          defaultImage="https://via.placeholder.com/100x100/E5F3FF/0066CC?text=Assembly"
          showConnectionStatus={false}
        />
      </PageLayout>
      <ChatBot /> {/* 챗봇 추가 */}
    </>
  );
};