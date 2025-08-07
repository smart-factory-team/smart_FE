import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';

export const VehicleMonitoring = () => {
  // Mock 실시간 데이터 상태 관리 (자연스러운 초기값)
  const [weldingEquipmentData, setWeldingEquipmentData] = useState([
    {
      id: 1,
      name: "용접기 1",
      title: "로봇 용접기 고장 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      isConnected: true,
      operatingStatus: "가동 중"
    },
    {
      id: 2, 
      name: "용접기 2",
      title: "로봇 용접기 고장 탐지", 
      status: "정상",
      isOperating: true,
      manager: "관리자",
      isConnected: false,
      operatingStatus: "가동 중"
    },
    {
      id: 3,
      name: "용접기 3", 
      title: "로봇 용접기 고장 탐지",
      status: "정상", 
      isOperating: true,
      manager: "관리자",
      isConnected: false,
      operatingStatus: "가동 중"
    }
  ]);

  // 자연스러운 상태 (실제 서비스처럼)
  const [isStreamConnected] = useState(true); // 연결된 상태로 시작

  // Mock 시나리오: 컴포넌트 마운트 후 랜덤하게 상태 변화
  useEffect(() => {
    // 30초 후 용접기 1번에 이상 발생 시뮬레이션
    const anomalyTimeout = setTimeout(() => {
      setWeldingEquipmentData(prev => 
        prev.map(equipment => 
          equipment.id === 1 
            ? {
                ...equipment,
                status: "이상",
                isOperating: false,
                operatingStatus: "비상정지"
              }
            : equipment
        )
      );
      console.log('🚨 Mock: 용접기 1번 이상 감지');
    }, 30000); // 30초 후

    // 1분 후 다시 정상 복구 시뮬레이션
    const recoveryTimeout = setTimeout(() => {
      setWeldingEquipmentData(prev => 
        prev.map(equipment => 
          equipment.id === 1 
            ? {
                ...equipment,
                status: "정상",
                isOperating: true,
                operatingStatus: "가동 중"
              }
            : equipment
        )
      );
      console.log('✅ Mock: 용접기 1번 정상 복구');
    }, 60000); // 1분 후

    // 랜덤하게 용접기 2, 3번 연결 상태 변화
    const connectionInterval = setInterval(() => {
      setWeldingEquipmentData(prev => 
        prev.map(equipment => {
          if (equipment.id === 2 || equipment.id === 3) {
            return {
              ...equipment,
              isConnected: Math.random() > 0.3 // 70% 확률로 연결
            };
          }
          return equipment;
        })
      );
    }, 15000); // 15초마다

    // 클린업
    return () => {
      clearTimeout(anomalyTimeout);
      clearTimeout(recoveryTimeout);
      clearInterval(connectionInterval);
    };
  }, []);

  return (
    <>
      <PageLayout 
        title="차체 공정 모니터링"
        description={`차체 공정 수신 ${isStreamConnected ? '양호 🟢' : '대기 중 ⚪'}`}
        footerTitle="차체 공정 가공률 상태"
        footerDescription="차트 컴포넌트가 여기에 들어갈 예정입니다."
        showFooter={true}
      >
        <EquipmentList 
          title="로봇 용접기 상태 목록"
          equipmentData={weldingEquipmentData}
          showConnectionStatus={true}
        />
      </PageLayout>
      <ChatBot />
    </>
  );
};