import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';
import SimpleRealTimeChart from '../../components/charts/RealTimeChart/SimpleRealTimeChart';
import webSocketService from '../../services/WebSocketService';

// ✅ 환경변수로 베이스 URL 제어 (없으면 localhost)
const API_BASE = process.env.REACT_APP_SIMULATOR_API || 'http://localhost:8016';

// 🎨 모니터링 카드 컨테이너 (특이성 상승으로 덮어쓰기 방지)
const MonitoringCard = styled.div`
  && {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    padding: 30px;
    margin: 50px;
  }
`;

// 🎨 카드 헤더 (중앙정렬)
const CardHeader = styled.div`
  background: #f9fafb;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const StatusBadge = styled.div.withConfig({
  shouldForwardProp: (prop) => !['connected'].includes(prop),
})`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  
  ${props => props.connected ? `
    background: #dcfce7;
    color: #166534;
  ` : `
    background: #f3f4f6;
    color: #6b7280;
  `}
`;

const StatusDot = styled.div.withConfig({
  shouldForwardProp: (prop) => !['connected'].includes(prop),
})`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#10b981' : '#9ca3af'};
  animation: ${props => props.connected ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const CardDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
`;

// 🎨 카드 내용
const CardContent = styled.div`
  padding: 24px;
`;

// 🎨 대기 상태 표시
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIconContainer = styled.div`
  width: 64px;
  height: 64px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  font-size: 24px;
  color: #9ca3af;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
`;

// 🎨 시뮬레이터 제어 카드
const SimulatorCard = styled(MonitoringCard)``;
const SimulatorHeader = styled(CardHeader)``;

// 🎨 WebSocket 상태 표시
const WebSocketStatus = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const WebSocketBadge = styled.div.withConfig({
  shouldForwardProp: (prop) => !['connected'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  
  ${props => props.connected ? `
    background: #dbeafe;
    color: #1e40af;
  ` : `
    background: #fef3c7;
    color: #d97706;
  `}
`;

const WebSocketDot = styled.div.withConfig({
  shouldForwardProp: (prop) => !['connected'].includes(prop),
})`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#3b82f6' : '#f59e0b'};
  animation: pulse 2s infinite;
`;

// 🎨 제어 버튼
const ControlButtonContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

// ✅ transient prop($isStop)으로 DOM 경고 제거
const ControlButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.disabled ? `
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  ` : props.$isStop ? `
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  ` : `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(156, 163, 175, 0.3);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ButtonIcon = styled.span`
  font-size: 16px;
`;

// 🎨 실행 상태 표시
const RunningStatus = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const RunningBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #dcfce7;
  color: #166534;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
`;

const RunningDot = styled.div`
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
`;

// 🎨 정보 카드 그리드
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const InfoCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['bgGradient', 'borderColor'].includes(prop),
})`
  background: white;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
`;

const InfoIconContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['bgColor'].includes(prop),
})`
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  font-size: 20px;
  color: #6b7280;
`;

const InfoTitle = styled.h4.withConfig({
  shouldForwardProp: (prop) => !['color'].includes(prop),
})`
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  font-size: 16px;
`;

const InfoText = styled.p.withConfig({
  shouldForwardProp: (prop) => !['color'].includes(prop),
})`
  color: #6b7280;
  font-weight: 500;
  margin: 0;
  font-size: 14px;
`;

const SectionTitle = styled.div`
  color: #000000;
  font-family: "Roboto", Helvetica;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 48px;
  margin-top: 20px;
  margin-bottom: 50px;
  text-align: center;
`;

export const VehicleMonitoring = () => {
  // ✅ 상태 관리 (올바른 순서)
  const [isStreamConnected, setIsStreamConnected] = useState(false);
  const [isMonitoringConnected, setIsMonitoringConnected] = useState(false);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  const [monitoringData, setMonitoringData] = useState([]);
  
  // ✨ 실시간 장비 상태 관리
  const [currentEquipmentStatus, setCurrentEquipmentStatus] = useState({
    current: 'NORMAL',
    vibration: 'NORMAL',
    overall: 'normal'
  });
  
  // ✨ 동적 장비 데이터 (실시간 상태 반영)
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

  // ✅ 핸들러 함수들 (올바른 순서)
  const handleWebSocketMessage = useCallback((event) => {
    const { type, data } = event;
    if (type === 'CONNECTION_STATUS') {
      setIsStreamConnected(data.connected);
    }
  }, []);

  // ✨ 차트에서 상태 변경 알림을 받는 핸들러
  const handleStatusChange = useCallback((statusData) => {
    setCurrentEquipmentStatus(statusData);
    
    // 용접기 1의 상태 업데이트
    setWeldingEquipmentData(prevData => 
      prevData.map(equipment => 
        equipment.id === 1 
          ? {
              ...equipment,
              status: statusData.overall === 'anomaly' ? '이상' : '정상',
              operatingStatus: statusData.overall === 'anomaly' ? '이상 감지' : '가동 중',
              isOperating: statusData.overall === 'normal'
            }
          : equipment
      )
    );
    
    console.log('📊 장비 리스트 상태 업데이트:', statusData);
  }, []);

  // ✨ 모니터링 메시지 처리
  const handleMonitoringMessage = useCallback((event) => {
    const { type, data } = event;
    
    if (type === 'CONNECTION_STATUS') {
      setIsMonitoringConnected(data.connected);
    } else if (type === 'MONITORING_DATA') {
      // 모니터링 데이터만 업데이트 (상태는 차트 컴포넌트에서 처리)
      setMonitoringData(prev => [...prev, data].slice(-50));
    }
  }, []);

  // 시뮬레이터 제어
  const handleStartSimulator = async () => {
    setSimulatorLoading(true);
    try {
      const response = await fetch(`${API_BASE}/simulator/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: 'WELDING_MACHINE_001',
          interval: 3000
        })
      });
      if (response.ok) {
        setIsSimulatorRunning(true);
        console.log('✅ 시뮬레이터 시작 성공');
      } else {
        console.error('⌛ 시뮬레이터 시작 실패:', response.status);
        if (process.env.NODE_ENV === 'development') {
          setIsSimulatorRunning(true);
          console.log('🔧 개발 모드: 시뮬레이터 상태 변경');
        }
      }
    } catch (error) {
      console.error('시뮬레이터 시작 오류:', error);
      if (process.env.NODE_ENV === 'development') {
        setIsSimulatorRunning(true);
        console.log('🔧 개발 모드: 시뮬레이터 상태 변경');
      }
    } finally {
      setSimulatorLoading(false);
    }
  };

  const handleStopSimulator = async () => {
    setSimulatorLoading(true);
    try {
      const response = await fetch(`${API_BASE}/simulator/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setIsSimulatorRunning(false);
        console.log('✅ 시뮬레이터 중지 성공');
      } else {
        console.error('⌛ 시뮬레이터 중지 실패:', response.status);
        if (process.env.NODE_ENV === 'development') {
          setIsSimulatorRunning(false);
          console.log('🔧 개발 모드: 시뮬레이터 상태 변경');
        }
      }
    } catch (error) {
      console.error('시뮬레이터 중지 오류:', error);
      if (process.env.NODE_ENV === 'development') {
        setIsSimulatorRunning(false);
        console.log('🔧 개발 모드: 시뮬레이터 상태 변경');
      }
    } finally {
      setSimulatorLoading(false);
    }
  };

  // WebSocket 연결
  useEffect(() => {
    webSocketService.connect();
    webSocketService.connectMonitoring();
    
    const removeDefectListener = webSocketService.addListener(handleWebSocketMessage);
    const removeMonitoringListener = webSocketService.addMonitoringListener(handleMonitoringMessage);
    
    return () => {
      removeDefectListener();
      removeMonitoringListener();
    };
  }, [handleWebSocketMessage, handleMonitoringMessage]);

  return (
    <>
      <PageLayout 
        title="차체 공정 모니터링"
        description={`차체 공정 수신 ${isStreamConnected ? '양호 🟢' : '대기 중 ⚪'} | 모니터링 ${isMonitoringConnected ? '연결됨 📊' : '대기 중 ⚪'}`}
      >          
          {/* ✨ 실시간 상태가 반영되는 장비 목록 */}
          <EquipmentList 
            title="로봇 용접기 상태 목록"
            equipmentData={weldingEquipmentData}
            showConnectionStatus={true}
          />

        <SectionTitle>로봇 용접기 상태 차트</SectionTitle>

          {/* 🎯 모니터링 카드 */}
          <MonitoringCard>
            {/* 🎨 중앙정렬 헤더 */}
            <CardHeader title="실시간 용접 공정 모니터링">
              <HeaderContent>
                <CardTitle>실시간 용접 공정 모니터링</CardTitle>
                {/* <StatusBadge connected={isMonitoringConnected}>
                  <StatusDot connected={isMonitoringConnected} />
                  {isMonitoringConnected ? '연결됨' : '대기 중'}
                </StatusBadge> */}
              </HeaderContent>
              <CardDescription>전류 및 진동 센서 데이터 실시간 분석</CardDescription>
            </CardHeader>
            
            {/* 내용 */}
            <CardContent>
              {monitoringData.length > 0 ? (
                <SimpleRealTimeChart 
                  monitoringData={monitoringData}
                  maxDataPoints={20}
                  isConnected={isMonitoringConnected}
                  onStatusChange={handleStatusChange}
                />
              ) : (
                <EmptyState>
                  <EmptyIconContainer>📡</EmptyIconContainer>
                  <EmptyTitle>모니터링 데이터 대기 중</EmptyTitle>
                  <EmptyDescription>
                    {isMonitoringConnected ? '시뮬레이터를 시작하여 실시간 데이터를 확인하세요' : 'WebSocket 연결을 확인하고 있습니다'}
                  </EmptyDescription>
                </EmptyState>
              )}
            </CardContent>
          </MonitoringCard>
          
          {/* 🎮 시뮬레이터 제어 카드 */}
          <SimulatorCard>
            {/* 🎨 중앙정렬 헤더 */}
            <SimulatorHeader>
              <HeaderContent>
                <CardTitle>시뮬레이터 제어</CardTitle>
                <StatusBadge connected={isSimulatorRunning}>
                  <StatusDot connected={isSimulatorRunning} />
                  {isSimulatorRunning ? '실행 중' : '중지됨'}
                </StatusBadge>
              </HeaderContent>
              <CardDescription>데이터 생성 및 전송 제어 시스템</CardDescription>
            </SimulatorHeader>
            
            {/* 내용 */}
            <CardContent>
              {/* WebSocket 상태 */}
              <WebSocketStatus>
                <WebSocketBadge connected={isMonitoringConnected}>
                  <WebSocketDot connected={isMonitoringConnected} />
                  WebSocket {isMonitoringConnected ? '연결됨' : '연결 대기 중'}
                </WebSocketBadge>
              </WebSocketStatus>
              
              {/* 제어 버튼 */}
              <ControlButtonContainer>
                {!isSimulatorRunning ? (
                  <ControlButton
                    onClick={handleStartSimulator}
                    disabled={simulatorLoading}
                  >
                    {simulatorLoading ? (
                      <>
                        <LoadingSpinner />
                        시작 중...
                      </>
                    ) : (
                      <>
                        <ButtonIcon>▶️</ButtonIcon>
                        시뮬레이터 시작하기
                      </>
                    )}
                  </ControlButton>
                ) : (
                  <ControlButton
                    onClick={handleStopSimulator}
                    disabled={simulatorLoading}
                    $isStop
                  >
                    {simulatorLoading ? (
                      <>
                        <LoadingSpinner />
                        중지 중...
                      </>
                    ) : (
                      <>
                        <ButtonIcon>⏹️</ButtonIcon>
                        시뮬레이터 중지하기
                      </>
                    )}
                  </ControlButton>
                )}
              </ControlButtonContainer>
              
              {/* 실행 중 상태 */}
              {isSimulatorRunning && (
                <RunningStatus>
                  <RunningBadge>
                    <RunningDot />
                    1분 간격으로 데이터 전송 중
                  </RunningBadge>
                </RunningStatus>
              )}
              
              {/* 정보 카드들 */}
              <InfoGrid>
                <InfoCard>
                  <InfoIconContainer>📡</InfoIconContainer>
                  <InfoTitle>데이터 타입</InfoTitle>
                  <InfoText>전류 센서 · 진동 센서</InfoText>
                </InfoCard>
                
                <InfoCard>
                  <InfoIconContainer>⏱️</InfoIconContainer>
                  <InfoTitle>전송 주기</InfoTitle>
                  <InfoText>1분 간격 실시간</InfoText>
                </InfoCard>
                
                <InfoCard>
                  <InfoIconContainer>🎯</InfoIconContainer>
                  <InfoTitle>장비 ID</InfoTitle>
                  <InfoText>MACHINE_001</InfoText>
                </InfoCard>
              </InfoGrid>
            </CardContent>
          </SimulatorCard>
      </PageLayout>
      <ChatBot />
    </>
  );
};