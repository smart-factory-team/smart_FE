import React from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';
import { usePaintingSurfaceDefect } from '../../hooks/usePaintingSurfaceDefect';
import styled from 'styled-components';

const MonitoringContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${props => props.$status === 'healthy' ? '#d4edda' : 
    props.$status === 'unhealthy' ? '#f8d7da' : '#fff3cd'};
  border: 1px solid ${props => props.$status === 'healthy' ? '#c3e6cb' : 
    props.$status === 'unhealthy' ? '#f5c6cb' : '#ffeaa7'};
  border-radius: 4px;
  margin-bottom: 20px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$status === 'healthy' ? '#28a745' : 
    props.$status === 'unhealthy' ? '#dc3545' : '#ffc107'};
`;

const RealTimeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
  width: fit-content;
`;

const PulsingDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #00ff88;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7);
    }
    
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(0, 255, 136, 0);
    }
    
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 255, 136, 0);
    }
  }
`;

const LastUpdated = styled.div`
  font-size: 11px;
  color: #666;
  margin-top: 8px;
  text-align: right;
`;

const DefectInfoCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: ${props => props.hasDefects ? 'cardPulse 3s infinite' : 'none'};
  
  @keyframes cardPulse {
    0%, 100% {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    50% {
      box-shadow: 0 0 25px rgba(220, 53, 69, 0.2);
    }
  }
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
  animation: ${props => props.type === 'defect' ? 'valueBlink 2s infinite' : 'none'};
  
  @keyframes valueBlink {
    0%, 100% {
      color: #dc3545;
    }
    50% {
      color: #ff6b6b;
    }
  }
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
    0%, 100% {
      border-color: #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    50% {
      border-color: #dc3545;
      box-shadow: 0 0 20px rgba(220, 53, 69, 0.3);
    }
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

const MachineName = styled.h3`
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
  animation: ${props => props.hasDefects ? 'statusBlink 1.5s infinite' : 'none'};
  
  @keyframes statusBlink {
    0%, 100% {
      background: #fee2e2;
      color: #dc2626;
    }
    50% {
      background: #dc2626;
      color: white;
    }
  }
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
  
  &:last-child {
    border-bottom: none;
  }
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

const DefectResultsTable = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 150px 120px 100px 120px 150px 100px;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 2px solid #f0f0f0;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 150px 120px 100px 120px 150px 100px;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f8f8f8;
  font-size: 14px;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  color: ${props => props.type === 'defect' ? '#dc3545' : '#333'};
  font-weight: ${props => props.bold ? '600' : '400'};
`;

const UpdateNotification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  min-width: 250px;
  background: ${props => {
    switch(props.type) {
      case 'defect': return 'linear-gradient(135deg, #dc3545, #c82333)';
      case 'stats': return 'linear-gradient(135deg, #28a745, #20c997)';
      case 'machine': return 'linear-gradient(135deg, #007bff, #6610f2)';
      case 'update': return 'linear-gradient(135deg, #ffc107, #fd7e14)';
      default: return 'linear-gradient(135deg, #6c757d, #495057)';
    }
  }};

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 16px;
`;

const ControlButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &.start {
    background-color: #28a745;
    color: white;
    
    &:hover {
      background-color: #218838;
    }
    
    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  }
  
  &.stop {
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
    
    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  }
`;

export const PaintingMonitoring = () => {
  const {
    defectResults,
    statistics,
    machineStatistics,
    isLoading,
    error,
    modelServiceHealth,
    simulatorStatus,
    isSimulatorRunning,
    azureStorageStatus,
    updateNotification,
    startSimulator,
    stopSimulator,
    hasDefects,
    defectCount,
    totalCount,
    defectRatio
  } = usePaintingSurfaceDefect();

  // 시뮬레이터 시작/중지 처리
  const handleSimulatorToggle = async () => {
    try {
      if (isSimulatorRunning) {
        await stopSimulator();
        alert('도장표면결함탐지 모니터링이 중지되었습니다.');
      } else {
        await startSimulator();
        alert('도장표면결함탐지 모니터링이 시작되었습니다.');
      }
    } catch (error) {
      alert(`시뮬레이터 제어 실패: ${error.message}`);
    }
  };

  // 상태에 따른 설명 텍스트 생성 (도장표면결함탐지만)
  const getStatusDescription = () => {
    if (hasDefects) {
      return `도장표면 결함 감지 🚨`;
    }
    return '도장표면 공정 수신 양호 🟢';
  };

  // 품질 상태 설명 생성 (도장표면결함탐지만)
  const getQualityDescription = () => {
    if (totalCount === 0) return '아직 도장표면 검사된 이미지가 없습니다.';
    
    const percentage = Math.round((1 - defectRatio) * 100);
    if (defectRatio === 0) return `완벽한 도장표면 품질! 100% 정상`;
    if (defectRatio <= 0.1) return `우수한 도장표면 품질! ${percentage}% 정상`;
    if (defectRatio <= 0.3) return `양호한 도장표면 품질! ${percentage}% 정상`;
    return `도장표면 품질 개선 필요! ${percentage}% 정상`;
  };

  if (isLoading) {
    return (
      <PageLayout 
        title="도장 공정 모니터링"
        description="도장표면결함탐지 데이터 로딩 중..."
        footerTitle="로딩 중..."
        footerDescription="도장표면결함탐지 서비스 연결 및 데이터 수집 중입니다."
        showFooter={true}
      >
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <div>🔄 도장표면결함탐지 데이터 로딩 중...</div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout 
        title="도장 공정 모니터링"
        description="도장표면결함탐지 연결 오류 발생"
        footerTitle="오류 발생"
        footerDescription="도장표면결함탐지 백엔드 서비스 연결에 실패했습니다."
        showFooter={true}
      >
        <div style={{ textAlign: 'center', padding: '100px', color: '#dc3545' }}>
          <div>❌ 도장표면결함탐지 오류 발생: {error}</div>
          <button onClick={() => window.location.reload()}>새로고침</button>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      {/* 업데이트 알림 */}
      {updateNotification && (
        <UpdateNotification type={updateNotification.type}>
          {updateNotification.message}
        </UpdateNotification>
      )}
      
      <PageLayout 
        title="도장 공정 모니터링"
        description={getStatusDescription()}
        showFooter={false}
      >
        <MonitoringContainer>

          {/* 도장 장비 상태 목록 */}
          <EquipmentList 
            title="도장 장비 상태 목록"
            equipmentData={[
              {
                id: 1,
                name: "도장부스 1",
                title: "도장 표면 결함 탐지",
                status: defectCount > 0 ? "결함감지" : "정상",
                isOperating: isSimulatorRunning,
                manager: "관리자 A",
                operatingStatus: "도장 중",
                image: "https://via.placeholder.com/100x100/FFE5CC/FF8C00?text=Paint",
                defectCount: defectCount,
                totalCount: totalCount,
                lastUpdate: statistics.lastUpdated ? new Date(statistics.lastUpdated).toLocaleTimeString('ko-KR') : null
              },
              {
                id: 2,
                name: "도장부스 2", 
                title: "도장 표면 결함 탐지",
                status: "정상",
                isOperating: true,
                manager: "관리자 B",
                operatingStatus: "도장 중",
                image: "https://via.placeholder.com/100x100/FFE5CC/FF8C00?text=Paint",
                defectCount: 0,
                totalCount: 847,
                lastUpdate: "14:23:15"
              },
              {
                id: 3,
                name: "도장부스 3",
                title: "도장 표면 결함 탐지", 
                status: "정상",
                isOperating: true,
                manager: "관리자 C",
                operatingStatus: "도장 중",
                image: "https://via.placeholder.com/100x100/FFE5CC/FF8C00?text=Paint",
                defectCount: 0,
                totalCount: 692,
                lastUpdate: "14:25:42"
              }
            ]}
            defaultImage="https://via.placeholder.com/100x100/FFE5CC/FF8C00?text=Paint"
            showConnectionStatus={true}
          />


          {/* 도장표면 품질 상태 */}
          <div style={{ 
            padding: '40px 60px',
            textAlign: 'center',
            color: '#666',
            borderTop: '1px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#ffffff',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '16px',
              color: '#000000',
              fontFamily: '"Roboto", Helvetica',
              margin: '0 0 16px 0'
            }}>도장표면 품질 상태</h2>
          </div>

                            {/* 도장표면결함탐지 정보 카드 */}
                  <DefectInfoCard hasDefects={defectCount > 0}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3>도장표면결함탐지 현황</h3>
            </div>
            
                         <DefectStats>
               <StatItem type="normal">
                 <StatValue type="normal">{totalCount + 847 + 692}</StatValue>
                 <StatLabel>총 검사 이미지</StatLabel>
               </StatItem>
               <StatItem type="defect">
                 <StatValue type="defect">{defectCount}</StatValue>
                 <StatLabel>결함 감지 이미지</StatLabel>
               </StatItem>
               <StatItem type="defect">
                 <StatValue type="defect">{Math.round((defectCount / (totalCount + 847 + 692)) * 100)}%</StatValue>
                 <StatLabel>결함 비율</StatLabel>
               </StatItem>
             </DefectStats>
            
            
          </DefectInfoCard>

          {/* 도장표면결함탐지 결과 목록 */}
          {/* 기계별 결함 현황 */}
          <div>
            <h2>🏭 기계별 도장 결함 현황</h2>
            <MachineGrid>
              {/* 도장부스 1 - 실제 모니터링 */}
              <MachineCard>
                <MachineHeader>
                  <MachineName>도장부스 1</MachineName>
                                          <MachineStatus hasDefects={defectCount > 0}>
                          {defectCount > 0 ? '🚨 결함 감지' : '정상'}
                        </MachineStatus>
                </MachineHeader>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <StatItem type="defect">
                    <StatValue type="defect">{defectCount}</StatValue>
                    <StatLabel>총 결함 수</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{totalCount}</StatValue>
                    <StatLabel>총 검사 수</StatLabel>
                  </StatItem>
                </div>
                
                                 {defectCount > 0 && (
                   <DefectTypeChart>
                     <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#333' }}>결함 유형별 분포</h4>
                     {Object.entries(statistics.defectTypeBreakdown || {}).map(([type, count]) => (
                       <DefectTypeItem key={type}>
                         <DefectTypeLabel>{type}</DefectTypeLabel>
                         <DefectTypeCount>{count}개</DefectTypeCount>
                       </DefectTypeItem>
                     ))}
                   </DefectTypeChart>
                 )}
                
                {statistics.lastUpdated && (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                    <strong>최근 결함:</strong> {new Date(statistics.lastUpdated).toLocaleString('ko-KR')}
                  </div>
                )}
              </MachineCard>

              {/* 도장부스 2 - 목 데이터 */}
              <MachineCard>
                <MachineHeader>
                  <MachineName>도장부스 2</MachineName>
                  <MachineStatus hasDefects={false}>
                    정상
                  </MachineStatus>
                </MachineHeader>
                
                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                   <StatItem>
                     <StatValue>0</StatValue>
                     <StatLabel>총 결함 수</StatLabel>
                   </StatItem>
                   <StatItem>
                     <StatValue>847</StatValue>
                     <StatLabel>총 검사 수</StatLabel>
                   </StatItem>
                 </div>
                 
                 <div style={{ marginTop: '16px', textAlign: 'center', color: '#28a745', fontSize: '14px', fontWeight: '500' }}>
                   ✅ 결함 없음
                 </div>                
              </MachineCard>

              {/* 도장부스 3 - 목 데이터 */}
              <MachineCard>
                <MachineHeader>
                  <MachineName>도장부스 3</MachineName>
                  <MachineStatus hasDefects={false}>
                    정상
                  </MachineStatus>
                </MachineHeader>
                
                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                   <StatItem>
                     <StatValue>0</StatValue>
                     <StatLabel>총 결함 수</StatLabel>
                   </StatItem>
                   <StatItem>
                     <StatValue>692</StatValue>
                     <StatLabel>총 검사 수</StatLabel>
                   </StatItem>
                 </div>
                 
                 <div style={{ marginTop: '16px', textAlign: 'center', color: '#28a745', fontSize: '14px', fontWeight: '500' }}>
                   ✅ 결함 없음
                 </div>                
              </MachineCard>
            </MachineGrid>
          </div>

          {/* 결함 탐지 결과 표 */}
          {defectResults.length > 0 && (
            <DefectResultsTable>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <h3>📊 결함 탐지 상세 결과</h3>
                 <div style={{ fontSize: '12px', color: '#666' }}>
                   자동 갱신 중... ({defectResults.length}개 결과)
                 </div>
               </div>
              
              <TableHeader>
                <div>결함 유형</div>
                <div>신뢰도</div>
                <div>위치 (X, Y)</div>
                <div>감지 시간</div>
                <div>상태</div>
              </TableHeader>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {defectResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.defectType || 'N/A'}</TableCell>
                    <TableCell>{(result.confidence * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      ({Math.round(result.defectX || 0)}, {Math.round(result.defectY || 0)})
                    </TableCell>
                    <TableCell>
                      {new Date(result.timestamp).toLocaleString('ko-KR', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell type="defect">
                      {result.status === 'defect' ? '🚨 결함' : '✅ 정상'}
                    </TableCell>
                  </TableRow>
                ))}
              </div>
            </DefectResultsTable>
          )}
        </MonitoringContainer>
      </PageLayout>
      <ChatBot />
    </>
  );
};