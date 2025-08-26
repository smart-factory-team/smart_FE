import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';
import EcoatingPaintingChartsDashboard from '../../components/charts/ProcessChart/EcoatingPaintingChartsDashboard';
import webSocketService from '../../services/WebSocketService';
import { usePaintingSurfaceDefect } from '../../hooks/usePaintingSurfaceDefect';

// 내 서비스 (설비) API 경로
const EQUIPMENT_API_BASE = '/simulators/painting-equipment';

// --- 공용 스타일 컴포넌트 ---
const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 60px 0 20px 0;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 20px;
`;

const MonitoringCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 40px;
`;

const CardHeader = styled.div`
  background: #f9fafb;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 24px;
`;

const SimulatorCard = styled(MonitoringCard)``;

const ControlButton = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background: ${props => props.$isStop ? '#ef4444' : '#3b82f6'};
  color: white;
  &:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }
`;

// --- 표면 결함 서비스용 스타일 컴포넌트 (`_temp` 기반) ---
const DefectInfoCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const DefectStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props => props.type === 'defect' ? '#fff5f5' : '#f0f9ff'};
  border: 1px solid ${props => props.type === 'defect' ? '#fed7d7' : '#bfdbfe'};
  border-radius: 6px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.type === 'defect' ? '#dc3545' : '#2563eb'};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

const MachineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MachineCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: ${props => props.hasDefects ? 'defectBlink 2s infinite' : 'none'};
  
  @keyframes defectBlink {
    50% { border-color: #dc3545; }
  }
`;

const MachineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const MachineName = styled.h4`
  margin: 0;
  color: #333;
  font-size: 18px;
`;

const MachineStatus = styled.div`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.hasDefects ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.hasDefects ? '#dc2626' : '#16a34a'};
`;

const DefectTypeChart = styled.div`
  margin-top: 16px;
`;

const DefectTypeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: none; }
`;

const DefectTypeLabel = styled.span`
  font-size: 14px;
  color: #333;
  text-transform: capitalize;
`;

const DefectTypeCount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #dc3545;
  background: #fff5f5;
  padding: 2px 8px;
  border-radius: 12px;
`;


export const PaintingMonitoring = () => {
  // 1. 내 서비스 (설비 모니터링) 상태 관리
  const [isEquipmentConnected, setIsEquipmentConnected] = useState(false);
  const [isEquipmentSimulatorRunning, setIsEquipmentSimulatorRunning] = useState(false);
  const [equipmentSimulatorLoading, setEquipmentSimulatorLoading] = useState(false);
  const [monitoringData, setMonitoringData] = useState([]);

  // 2. 동료 서비스 (표면 결함 모니터링) 상태 관리
  const {
    statistics,
    machineStatistics,
    isLoading,
    error,
    isSimulatorRunning: isSurfaceSimulatorRunning,
  } = usePaintingSurfaceDefect();

  // 3. 두 서비스의 데이터를 종합하여 EquipmentList에 전달할 데이터 생성
  const combinedEquipmentData = useMemo(() => {
    const equipment1 = monitoringData.find(d => d.machineId === 'PAINT-MCH-001');
    const equipment2 = monitoringData.find(d => d.machineId === 'PAINT-MCH-002');
    const surfaceDefectStatus = !error; // Assuming no error means healthy

    return [
      {
        id: 1,
        name: "전착조 1",
        title: "도장 설비 결함 탐지",
        status: equipment1 && equipment1.issue ? '이상' : '정상',
        isOperating: !(equipment1 && equipment1.issue), // 결함 있으면 비활성
        manager: "관리자",
        isConnected: isEquipmentConnected,
        operatingStatus: equipment1 && equipment1.issue ? '이상 감지' : '활성',
        image: "https://i.imgur.com/3swWYFe.png"
      },
      {
        id: 2,
        name: "전착조 2",
        title: "도장 설비 결함 탐지",
        status: equipment2 && equipment2.issue ? '이상' : '정상',
        isOperating: !(equipment2 && equipment2.issue),
        manager: "관리자",
        isConnected: isEquipmentConnected,
        operatingStatus: equipment2 && equipment2.issue ? '이상 감지' : '활성',
        image: "https://i.imgur.com/3swWYFe.png"
      },
      {
        id: 3,
        name: "도장부스 1",
        title: "도장 표면 결함 탐지",
        status: isSurfaceSimulatorRunning && statistics.defectImageCount > 0 ? '이상' : '정상',
        isOperating: isSurfaceSimulatorRunning, // 시뮬레이터 실행 여부로 판단
        manager: "관리자",
        isConnected: surfaceDefectStatus, // 모델 서비스 연결 여부로 판단
        operatingStatus: isSurfaceSimulatorRunning ? (statistics.defectImageCount > 0 ? '이상 감지' : '활성') : '비활성',
        image: "https://i.imgur.com/Gm4PpU0.png"
      }
    ];
  }, [isEquipmentConnected, monitoringData, statistics, isSurfaceSimulatorRunning, error]);

  // --- 내 서비스 로직 (설비 모니터링) ---
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

  const handleMonitoringMessage = useCallback((event) => {
    const { type, data } = event;
    if (type === 'CONNECTION_STATUS') {
      setIsEquipmentConnected(data.connected);
    } else if (type === 'MONITORING_DATA') {
      setMonitoringData(prev => [...prev, data].slice(-50));
    }
  }, []);

  const handleStartEquipmentSimulator = async () => {
    setEquipmentSimulatorLoading(true);
    try {
      const response = await fetch(`${EQUIPMENT_API_BASE}/start`, { method: 'POST' });
      if (response.ok) setIsEquipmentSimulatorRunning(true);
    } catch (e) { console.error('설비 시뮬레이터 시작 오류:', e); }
    finally { setEquipmentSimulatorLoading(false); }
  };

  const handleStopEquipmentSimulator = async () => {
    setEquipmentSimulatorLoading(true);
    try {
      const response = await fetch(`${EQUIPMENT_API_BASE}/stop`, { method: 'POST' });
      if (response.ok) setIsEquipmentSimulatorRunning(false);
    } catch (e) { console.error('설비 시뮬레이터 중지 오류:', e); }
    finally { setEquipmentSimulatorLoading(false); }
  };

  useEffect(() => {
    const gatewayHost = window.location.hostname.replace('3000-', '8088-');
    const monitoringWsUrl = `wss://${gatewayHost}/ws/monitoring-data`;
    webSocketService.connectMonitoring(monitoringWsUrl);
    const removeListener = webSocketService.addMonitoringListener(handleMonitoringMessage);
    return () => {
      removeListener();
      webSocketService.disconnectMonitoring();
    };
  }, [handleMonitoringMessage]);

  // --- 렌더링 ---
  return (
    <>
      <PageLayout 
        title="도장 공정 통합 모니터링"
        description={`도장 설비 탐지 수신 양호 ${isEquipmentConnected ? '🟢' : '⚪'} | 표면 결함 탐지 수신 양호 ${!error ? '🟢' : '⚪'}`}
      >
        {/* 1. 통합 장비 목록 (요청사항) */}
        <EquipmentList 
          title="전체 장비 상태 목록"
          equipmentData={combinedEquipmentData}
          showConnectionStatus={true}
        />

        {/* 2. 표면 결함 모니터링 섹션 (요청사항) */}
        <SectionTitle>도장 표면 결함 실시간 현황</SectionTitle>
        {isLoading ? (
          <div>표면 결함 데이터 로딩 중...</div>
        ) : error ? (
          <div style={{color: 'red'}}>표면 결함 데이터 오류: {error}</div>
        ) : (
          <>
            <DefectInfoCard hasDefects={statistics.defectImageCount > 0}>
              <h3>종합 현황</h3>
              <DefectStats>
                <StatItem type="normal">
                  <StatValue type="normal">{statistics.totalCount || 0}</StatValue>
                  <StatLabel>총 검사 이미지</StatLabel>
                </StatItem>
                <StatItem type="defect">
                  <StatValue type="defect">{statistics.defectImageCount || 0}</StatValue>
                  <StatLabel>결함 감지 이미지</StatLabel>
                </StatItem>
              </DefectStats>
            </DefectInfoCard>

            <MonitoringCard>
              <CardHeader><CardTitle>도장 표면 결함 현황</CardTitle></CardHeader>
              <CardContent>
                <MachineGrid>
                  {(machineStatistics.machines || []).length > 0 && (() => {
                    const machine = machineStatistics.machines[0];
                    return (
                      <MachineCard key={machine.machineName} hasDefects={machine.totalDefects > 0}>
                        <MachineHeader>
                          <MachineName>도장 부스 1</MachineName>
                          <MachineStatus hasDefects={machine.totalDefects > 0}>
                            {machine.totalDefects > 0 ? `🚨 결함 ${machine.totalDefects}건` : '✅ 정상'}
                          </MachineStatus>
                        </MachineHeader>
                        {machine.totalDefects > 0 && (
                          <DefectTypeChart>
                            <h4>결함 유형별 분포</h4>
                            {Object.entries(statistics.defectTypeBreakdown || {}).map(([type, count]) => (
                              <DefectTypeItem key={type}>
                                <DefectTypeLabel>{type}</DefectTypeLabel>
                                <DefectTypeCount>{count}개</DefectTypeCount>
                              </DefectTypeItem>
                            ))}
                          </DefectTypeChart>
                        )}
                      </MachineCard>
                    );
                  })()}
                </MachineGrid>
              </CardContent>
            </MonitoringCard>
          </>
        )}

        {/* 3. 설비 모니터링 섹션 (요청사항) */}
        <SectionTitle>전착 도장 설비 실시간 현황</SectionTitle>
        <MonitoringCard>
          <CardHeader>
            <CardTitle>실시간 도장 설비 모니터링</CardTitle>
          </CardHeader>
          <CardContent>
            <EcoatingPaintingChartsDashboard stats={paintingStats} />
          </CardContent>
        </MonitoringCard>

        <SimulatorCard>
          <CardHeader>
            <CardTitle>도장 설비 시뮬레이터 제어</CardTitle>
          </CardHeader>
          <CardContent>
              {!isEquipmentSimulatorRunning ? (
                <ControlButton onClick={handleStartEquipmentSimulator} disabled={equipmentSimulatorLoading || !isEquipmentConnected}>
                  ▶️ 설비 시뮬레이터 시작
                </ControlButton>
              ) : (
                <ControlButton onClick={handleStopEquipmentSimulator} disabled={equipmentSimulatorLoading} $isStop>
                  ⏹️ 설비 시뮬레이터 중지
                </ControlButton>
              )}
          </CardContent>
        </SimulatorCard>

      </PageLayout>
      <ChatBot />
    </>
  );
};