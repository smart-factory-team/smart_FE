import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';
import EcoatingPaintingChartsDashboard from '../../components/charts/ProcessChart/EcoatingPaintingChartsDashboard';
import webSocketService from '../../services/WebSocketService';

// ✅ 게이트웨이 라우팅 경로
const API_BASE = '/simulators/painting-equipment';

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

export const PaintingMonitoring = () => {
  // 상태 관리
  const [isMonitoringConnected, setIsMonitoringConnected] = useState(false);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  
  // WebSocket으로 수신한 전체 모니터링 데이터
  const [monitoringData, setMonitoringData] = useState([]);

  // 새 대시보드에 전달할 통계 데이터 계산
  const paintingStats = useMemo(() => {
    const stats = {
      'PAINT-MCH-001': { totalOps: 0, totalDefects: 0 },
      'PAINT-MCH-002': { totalOps: 0, totalDefects: 0 },
    };

    monitoringData.forEach(data => {
      if (stats[data.machineId]) {
        stats[data.machineId].totalOps += 1;
        if (data.issue && data.issue !== "") {
          stats[data.machineId].totalDefects += 1;
        }
      }
    });

    return stats;
  }, [monitoringData]);
  
  // 장비 데이터: 초기 상태를 미리 정의
  const [paintingEquipmentData, setPaintingEquipmentData] = useState([
    {
      id: 1,
      machineId: "PAINT-MCH-001",
      name: "도장기 1",
      title: "도장 설비 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      isConnected: true,
      operatingStatus: "활성", // '도장중' -> '활성'으로 변경
      image: "https://i.imgur.com/3swWYFe.png"
    },
    {
      id: 2,
      machineId: "PAINT-MCH-002",
      name: "도장기 2",
      title: "도장 설비 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      isConnected: true,
      operatingStatus: "활성", // '도장중' -> '활성'으로 변경
      image: "https://i.imgur.com/3swWYFe.png"
    },
    {
      id: 3,
      name: "도장기 3",
      title: "도장 표현 결함 탐지",
      status: "정상",
      isOperating: false,
      manager: "관리자",
      isConnected: false,
      operatingStatus: "비활성",
      image: "https://i.imgur.com/3swWYFe.png"
    }
  ]);

  // WebSocket 메시지 처리 로직 수정
  const handleMonitoringMessage = useCallback((event) => {
    console.log('handleMonitoringMessage called with event:', event);
    const { type, data } = event;
    if (type === 'CONNECTION_STATUS') {
      console.log('Setting isMonitoringConnected to:', data.connected);
      setIsMonitoringConnected(data.connected);
    } else if (type === 'MONITORING_DATA') {
      console.log('Received MONITORING_DATA:', data);
      // 실시간 차트 데이터 업데이트
      setMonitoringData(prev => [...prev, data].slice(-50));

      // 장비 상태 업데이트 로직 변경
      setPaintingEquipmentData(prevData => 
        prevData.map(equipment => {
          // 해당 장비의 데이터일 경우에만 상태 업데이트
          if (equipment.machineId === data.machineId) {
            // 결함 데이터가 있을 경우
            if (data.issue && data.issue !== "") {
              return { ...equipment, status: '이상', operatingStatus: '이상 탐지' };
            }
            // 정상 데이터가 있을 경우
            else {
              return { ...equipment, status: '정상', operatingStatus: '활성' };
            }
          }
          // 다른 장비는 그대로 반환
          return equipment;
        })
      );
    }
  }, []);

  // 시뮬레이터 제어
  const handleStartSimulator = async () => {
    setSimulatorLoading(true);
    try {
      const response = await fetch(`${API_BASE}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setIsSimulatorRunning(true);
        console.log('✅ 시뮬레이터 시작 성공');
      } else {
        console.error('❌ 시뮬레이터 시작 실패:', response.status);
        if (process.env.NODE_ENV === 'development') {
          setIsSimulatorRunning(true);
          console.log('🔧 개발 모드: 시뮬레이터 상태 강제 변경');
        }
      }
    } catch (error) {
      console.error('시뮬레이터 시작 오류:', error);
      if (process.env.NODE_ENV === 'development') {
        setIsSimulatorRunning(true);
        console.log('🔧 개발 모드: 시뮬레이터 상태 강제 변경');
      }
    } finally {
      setSimulatorLoading(false);
    }
  };

  const handleStopSimulator = async () => {
    setSimulatorLoading(true);
    try {
      const response = await fetch(`${API_BASE}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setIsSimulatorRunning(false);
        console.log('✅ 시뮬레이터 중지 성공');
      } else {
        console.error('❌ 시뮬레이터 중지 실패:', response.status);
        if (process.env.NODE_ENV === 'development') {
          setIsSimulatorRunning(false);
          console.log('🔧 개발 모드: 시뮬레이터 상태 강제 변경');
        }
      }
    } catch (error) {
      console.error('시뮬레이터 중지 오류:', error);
      if (process.env.NODE_ENV === 'development') {
        setIsSimulatorRunning(false);
        console.log('🔧 개발 모드: 시뮬레이터 상태 강제 변경');
      }
    } finally {
      setSimulatorLoading(false);
    }
  };

  // WebSocket 연결
  useEffect(() => {
    const gatewayHost = window.location.hostname.replace('3000-', '8088-');
    const monitoringWsUrl = `wss://${gatewayHost}/ws/monitoring-data`;

    console.log(`Attempting to connect to WebSocket at: ${monitoringWsUrl}`);

    webSocketService.connectMonitoring(monitoringWsUrl);
    
    const removeMonitoringListener = webSocketService.addMonitoringListener(handleMonitoringMessage);
    
    return () => {
      removeMonitoringListener();
      webSocketService.disconnectMonitoring();
    };
  }, [handleMonitoringMessage]);

  return (
    <>
      {/*
        TODO: 다음 개발자는 아래 PageLayout의 description을 자신의 서비스에 맞게 수정해야 합니다.
              1. 자신의 서비스에 맞는 WebSocket 연결 상태를 관리하는 state를 추가합니다.
                 (예: const [isSurfaceDefectConnected, setIsSurfaceDefectConnected] = useState(false);)
              2. 아래 description prop의 내용을 삼항연산자를 사용하여 새로 만든 state와 연결합니다.
                 (예: description={isSurfaceDefectConnected ? '표면 탐지 공정 수신 양호 🟢' : '표면 탐지 공정 수신 대기중 ⚪'})
      */}
      <PageLayout 
        title="도장 공정 모니터링"
        description={isMonitoringConnected ? '전착 도장 공정 수신 양호 🟢' : '전착 도장 공정 수신 대기중 ⚪'}
      >          
          {/* 장비 목록 */}
          <EquipmentList 
            title="도장 장비 상태 목록"
            equipmentData={paintingEquipmentData}
            showConnectionStatus={true} // 연결 상태 표시 활성화
          />

        <SectionTitle>도장 공정 결함 탐지</SectionTitle>

          {/* 🎯 모니터링 카드 */}
          <MonitoringCard>
            <CardHeader title="실시간 설비 모니터링">
              <HeaderContent>
                <CardTitle>실시간 도장 설비 모니터링</CardTitle>
                <StatusBadge connected={isMonitoringConnected}>
                  <StatusDot connected={isMonitoringConnected} />
                  {isMonitoringConnected ? '연결됨' : '대기 중'}
                </StatusBadge>
              </HeaderContent>
              <CardDescription>도장 설비 상태 실시간 분석</CardDescription>
            </CardHeader>
            
            <CardContent>
              <EcoatingPaintingChartsDashboard stats={paintingStats} />
            </CardContent>
          </MonitoringCard>

          {/* 템플릿: 다음 개발자를 위한 모니터링 카드 예시 */}
          <MonitoringCard>
            <CardHeader title="실시간 표면 결함 모니터링">
              <HeaderContent>
                <CardTitle>실시간 표면 결함 모니터링</CardTitle>
                {/*
                  TODO: 이 부분에 해당 서비스의 WebSocket 연결 상태(isMonitoringConnected)를 연결하세요.
                        아래 StatusBadge의 connected prop을 실제 연결 상태 boolean 값으로 교체해야 합니다.
                */}
                <StatusBadge connected={false}>
                  <StatusDot connected={false} />
                  대기 중
                </StatusBadge>
              </HeaderContent>
              <CardDescription>
                {/* TODO: 서비스에 맞는 설명으로 변경하세요. */}
                카메라 이미지 데이터 실시간 분석
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/*
                TODO: 이 부분에 해당 서비스에 맞는 데이터 시각화 차트 컴포넌트를 생성하고 연결하세요.
                      1. /src/components/charts/ 하위에 새 차트 컴포넌트 생성
                      2. PaintingMonitoring.jsx에서 해당 서비스의 WebSocket 데이터 수신 및 가공
                      3. 가공된 데이터를 새 차트 컴포넌트의 props로 전달
                      4. 아래 div를 새로 만든 차트 컴포넌트로 교체
              */}
              <div style={{ padding: '50px', textAlign: 'center', border: '2px dashed #e5e7eb', borderRadius: '8px', color: '#9ca3af' }}>
                여기에 표면 결함 모니터링 차트가 표시됩니다.
              </div>
            </CardContent>
          </MonitoringCard>
          
          {/* 🎮 시뮬레이터 제어 카드 */}
          <SimulatorCard>
            <SimulatorHeader>
              <HeaderContent>
                <CardTitle>도장 설비 시뮬레이터 제어</CardTitle>
                <StatusBadge connected={isSimulatorRunning}>
                  <StatusDot connected={isSimulatorRunning} />
                  {isSimulatorRunning ? '실행 중' : '중지됨'}
                </StatusBadge>
              </HeaderContent>
              <CardDescription>센서 데이터 생성 및 Kafka 전송 제어</CardDescription>
            </SimulatorHeader>
            
            <CardContent>
              <WebSocketStatus>
                <WebSocketBadge connected={isMonitoringConnected}>
                  <WebSocketDot connected={isMonitoringConnected} />
                  WebSocket {isMonitoringConnected ? '연결됨' : '연결 대기 중'}
                </WebSocketBadge>
              </WebSocketStatus>
              
              <ControlButtonContainer>
                {!isSimulatorRunning ? (
                  <ControlButton
                    onClick={handleStartSimulator}
                    disabled={simulatorLoading || !isMonitoringConnected} // 연결 안되면 비활성화
                  >
                    {simulatorLoading ? (
                      <> 
                        <LoadingSpinner />
                        시작 중...
                      </>
                    ) : (
                      <>
                        <ButtonIcon>▶️</ButtonIcon>
                        시뮬레이터 시작
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
                        시뮬레이터 중지
                      </>
                    )}
                  </ControlButton>
                )}
              </ControlButtonContainer>
              
              {isSimulatorRunning && (
                <RunningStatus>
                  <RunningBadge>
                    <RunningDot />
                    30초 간격으로 데이터 전송 중
                  </RunningBadge>
                </RunningStatus>
              )}
              
              <InfoGrid>
                <InfoCard>
                  <InfoIconContainer>🌡️</InfoIconContainer>
                  <InfoTitle>데이터 타입</InfoTitle>
                  <InfoText>온도 · 진동 · 소음</InfoText>
                </InfoCard>
                
                <InfoCard>
                  <InfoIconContainer>⏱️</InfoIconContainer>
                  <InfoTitle>전송 주기</InfoTitle>
                  <InfoText>30초 간격 실시간</InfoText>
                </InfoCard>
                
                <InfoCard>
                  <InfoIconContainer>📨</InfoIconContainer>
                  <InfoTitle>전송 방식</InfoTitle>
                  <InfoText>Kafka 이벤트</InfoText>
                </InfoCard>
              </InfoGrid>
            </CardContent>
          </SimulatorCard>

          {/* 템플릿: 다음 개발자를 위한 시뮬레이터 제어 카드 예시 */}
          <SimulatorCard>
            <SimulatorHeader>
              <HeaderContent>
                {/* TODO: 서비스에 맞는 이름으로 변경하세요. */}
                <CardTitle>표면 결함 시뮬레이터 제어</CardTitle>
                {/*
                  TODO: 이 부분에 해당 서비스의 시뮬레이터 실행 상태(isSimulatorRunning)를 연결하세요.
                        아래 StatusBadge의 connected prop을 실제 실행 상태 boolean 값으로 교체해야 합니다.
                */}
                <StatusBadge connected={false}>
                  <StatusDot connected={false} />
                  중지됨
                </StatusBadge>
              </HeaderContent>
              <CardDescription>
                {/* TODO: 서비스에 맞는 설명으로 변경하세요. */}
                표면 결함 데이터 생성 및 Kafka 전송 제어
              </CardDescription>
            </SimulatorHeader>
            
            <CardContent>
              <WebSocketStatus>
                {/*
                  TODO: 이 부분은 상단의 모니터링 카드와 동일한 WebSocket 연결 상태(isMonitoringConnected)를 사용하면 됩니다.
                */}
                <WebSocketBadge connected={isMonitoringConnected}>
                  <WebSocketDot connected={isMonitoringConnected} />
                  WebSocket {isMonitoringConnected ? '연결됨' : '연결 대기 중'}
                </WebSocketBadge>
              </WebSocketStatus>
              
              <ControlButtonContainer>
                {/*
                  TODO: 아래 버튼들은 해당 서비스의 시뮬레이터 제어 로직에 맞게 수정해야 합니다.
                        1. 새로운 API_BASE 경로를 최상단에 정의합니다. (예: /simulators/surface-defect)
                        2. isSimulatorRunning, simulatorLoading과 같은 상태 변수를 새로 추가합니다.
                        3. handleStartSimulator, handleStopSimulator와 같은 핸들러 함수를 새로 작성합니다.
                        4. 아래 onClick, disabled 등의 prop을 새로 만든 상태와 핸들러에 연결합니다.
                */}
                <ControlButton
                  onClick={() => alert('시뮬레이터 시작 함수를 연결하세요.')}
                  disabled={!isMonitoringConnected}
                >
                  <ButtonIcon>▶️</ButtonIcon>
                  시뮬레이터 시작
                </ControlButton>
              </ControlButtonContainer>
              
              {/*
                TODO: 이 부분은 시뮬레이터가 실행 중일 때만 표시되도록 isSimulatorRunning과 같은 상태에 연결하세요.
              */}
              {false && (
                <RunningStatus>
                  <RunningBadge>
                    <RunningDot />
                    30초 간격으로 데이터 전송 중
                  </RunningBadge>
                </RunningStatus>
              )}
              
              <InfoGrid>
                {/* TODO: 서비스에 맞는 정보로 아래 카드들의 내용을 변경하세요. */}
                <InfoCard>
                  <InfoIconContainer>🖼️</InfoIconContainer>
                  <InfoTitle>데이터 타입</InfoTitle>
                  <InfoText>이미지 데이터</InfoText>
                </InfoCard>
                
                <InfoCard>
                  <InfoIconContainer>⏱️</InfoIconContainer>
                  <InfoTitle>전송 주기</InfoTitle>
                  <InfoText>30초 간격 실시간</InfoText>
                </InfoCard>
                
                <InfoCard>
                  <InfoIconContainer>📨</InfoIconContainer>
                  <InfoTitle>전송 방식</InfoTitle>
                  <InfoText>Kafka 이벤트</InfoText>
                </InfoCard>
              </InfoGrid>
            </CardContent>
          </SimulatorCard>
      </PageLayout>
      <ChatBot />
    </>
  );
};