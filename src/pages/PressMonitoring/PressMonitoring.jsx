import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot'; // 추가

export const PressMonitoring = () => {
  const url = process.env.REACT_APP_API_BASE_URL;
  const [pressEquipmentData, setPressEquipmentData] = useState([
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
  ]);

  useEffect(() => {
    let eventSource = null;
    let reconnectTimeout = null;
    
    const connectSSE = () => {
      try {
        console.log('SSE 연결 시도 중...');
        eventSource = new EventSource(`${url}/pressFaultDetectionLogs/status/stream`);
        
        // 5초 후에도 연결되지 않으면 로그 출력
        setTimeout(() => {
          if (eventSource && eventSource.readyState === 0) {
            console.log('현재 readyState:', eventSource.readyState);
          }
        }, 5000);
        
        eventSource.onopen = () => {
          console.log('SSE 연결 성공');
        };
        
        // 특정 이벤트 이름으로 수신
        eventSource.addEventListener('faultStatus', (event) => {
          try {
            console.log('faultStatus 이벤트 수신:', event.data);
            const data = JSON.parse(event.data);
            console.log('faultStatus 파싱된 데이터:', data);
            const { isFault, prediction } = data;
            
            setPressEquipmentData(prevData => {
              const updatedData = prevData.map(press => 
                press.id === 1 ? {
                  ...press,
                  status: isFault ? "고장" : "정상",
                  operatingStatus: isFault ? "점검 필요" : "가동 중",
                  isOperating: !isFault
                } : press
              );
              console.log('faultStatus 업데이트된 데이터:', updatedData);
              return updatedData;
            });
          } catch (error) {
            console.error('faultStatus 데이터 파싱 오류:', error);
          }
        });

        eventSource.onerror = (error) => {
          console.error('SSE 연결 오류:', error);
          console.log('EventSource readyState:', eventSource.readyState);
          eventSource.close();
          
          reconnectTimeout = setTimeout(() => {
            console.log('SSE 재연결 시도...');
            connectSSE();
          }, 3000);
        };
      } catch (error) {
        console.error('SSE 초기화 오류:', error);
        reconnectTimeout = setTimeout(connectSSE, 3000);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  return (
    <>
      <PageLayout 
        title="프레스 공정 모니터링"
        description="프레스 공정 수신 양호 🟢"
        footerTitle="프레스 생산품 불량 상태"
        footerDescription="차트 컴포넌트가 여기에 들어갈 예정입니다."
        showFooter={true}
      >
        <EquipmentList 
          title="프레스별 상태 목록"
          equipmentData={pressEquipmentData}
          defaultImage="/pressmachine.png"
          showConnectionStatus={false}
        />
      </PageLayout>
      <ChatBot /> {/* 챗봇 추가 */}
    </>
  );
};