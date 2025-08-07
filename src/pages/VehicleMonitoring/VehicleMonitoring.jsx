import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';

export const VehicleMonitoring = () => {
  // 실시간 데이터 상태 관리
  const [weldingEquipmentData, setWeldingEquipmentData] = useState([
    {
      id: 1,
      name: "용접기 1",
      title: "로봇 용접기 고장 탐지",
      status: "정상",
      isOperating: false,
      manager: "관리자",
      isConnected: false,
      operatingStatus: "대기 중"
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

  // 상태 관리
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [isStreamConnected, setIsStreamConnected] = useState(false);
  const [eventSource, setEventSource] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStartingSimulator, setIsStartingSimulator] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [dataCheckInterval, setDataCheckInterval] = useState(null);
  const [isResuming, setIsResuming] = useState(false); // 🔧 재개 버튼 로딩 상태

  // 데이터 준비 상태 확인
  const checkDataReady = async () => {
    try {
      const response = await fetch('http://localhost:8008/stream/data-ready');
      if (response.ok) {
        const result = await response.json();
        setIsDataReady(result.data_ready);
        
        if (result.data_ready) {
          console.log('✅ AI 예측 데이터 준비 완료:', result.last_prediction_time);
          // 데이터가 준비되면 체크 중단
          if (dataCheckInterval) {
            clearInterval(dataCheckInterval);
            setDataCheckInterval(null);
          }
        }
      }
    } catch (error) {
      console.error('❌ 데이터 준비 상태 확인 오류:', error);
    }
  };

  // 🔧 데이터 수집 재개 함수 (전체 재시작)
  const resumeDataCollection = async () => {
    setIsResuming(true);
    try {
      // 1. 메모리 상태 리셋
      const response = await fetch('http://localhost:8008/stream/reset-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        console.log('✅ 메모리 상태 리셋 완료');
        
        // 2. 시뮬레이터 재시작
        const startResponse = await fetch('http://localhost:8008/simulator/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (startResponse.ok) {
          setIsSimulatorRunning(true);
          setIsDataReady(false);
          console.log('✅ 시뮬레이터 재시작 완료');
          
          // 3. 용접기 1번 상태를 정상으로 리셋
          setWeldingEquipmentData(prev => 
            prev.map(equipment => 
              equipment.id === 1 
                ? { 
                    ...equipment, 
                    status: "정상",
                    isOperating: true,
                    operatingStatus: "가동 중",
                    isConnected: false
                  }
                : equipment
            )
          );
          
          // 4. 데이터 준비 상태 체크 재시작
          const interval = setInterval(checkDataReady, 5000);
          setDataCheckInterval(interval);
          
          console.log('🔄 전체 시스템 재시작 완료 - 모니터링은 수동으로 시작하세요');
        }
      }
    } catch (error) {
      console.error('❌ 시스템 재시작 오류:', error);
    } finally {
      setIsResuming(false);
    }
  };

  // 시뮬레이터 시작
  const startSimulator = async () => {
    setIsStartingSimulator(true);
    try {
      const response = await fetch('http://localhost:8008/simulator/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ 시뮬레이터 시작 성공:', result);
        setIsSimulatorRunning(true);
        
        // 용접기 1번 운영 상태 업데이트
        setWeldingEquipmentData(prev => 
          prev.map(equipment => 
            equipment.id === 1 
              ? { 
                  ...equipment, 
                  isOperating: true,
                  operatingStatus: "가동 중"
                }
              : equipment
          )
        );

        // 🔧 시뮬레이터 시작 후 데이터 준비 상태 주기적 확인
        const interval = setInterval(checkDataReady, 5000); // 5초마다 확인
        setDataCheckInterval(interval);
        
      } else {
        console.error('❌ 시뮬레이터 시작 실패:', response.status);
      }
    } catch (error) {
      console.error('❌ 시뮬레이터 시작 오류:', error);
    } finally {
      setIsStartingSimulator(false);
    }
  };

  // 시뮬레이터 중지
  const stopSimulator = async () => {
    try {
      const response = await fetch('http://localhost:8008/simulator/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log('🛑 시뮬레이터 중지 성공');
        setIsSimulatorRunning(false);
        setIsDataReady(false);
        
        // 데이터 체크 인터벌 정리
        if (dataCheckInterval) {
          clearInterval(dataCheckInterval);
          setDataCheckInterval(null);
        }
        
        // 용접기 1번 상태 초기화
        setWeldingEquipmentData(prev => 
          prev.map(equipment => 
            equipment.id === 1 
              ? { 
                  ...equipment, 
                  isOperating: false,
                  isConnected: false,
                  operatingStatus: "대기 중",
                  status: "정상"
                }
              : equipment
          )
        );
      }
    } catch (error) {
      console.error('❌ 시뮬레이터 중지 오류:', error);
    }
  };

  // SSE 연결 시작
  const startRealTimeMonitoring = () => {
    if (!eventSource && !isConnecting) {
      console.log('🔄 실시간 모니터링 연결 중...');
      setIsConnecting(true);
      
      const es = new EventSource('http://localhost:8008/stream/realtime-status');
      
      es.onopen = () => {
        console.log('✅ 실시간 모니터링 연결 성공');
        setIsStreamConnected(true);
        setIsConnecting(false);
        setEventSource(es);
      };
      
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📡 실시간 데이터 수신:', data);
          
          // 용접기 1번 상태 업데이트
          updateWeldingMachineStatus(data.welding_machine);
          
        } catch (error) {
          console.error('❌ 데이터 파싱 오류:', error);
        }
      };
      
      es.onerror = (error) => {
        console.log('❌ SSE 연결 오류:', error);
        setIsStreamConnected(false);
        setIsConnecting(false);
        
        if (es) {
          es.close();
        }
        setEventSource(null);
      };
    }
  };

  // SSE 연결 종료
  const stopRealTimeMonitoring = () => {
    console.log('🛑 실시간 모니터링 중지');
    
    if (eventSource) {
      eventSource.close();
    }
    
    setEventSource(null);
    setIsStreamConnected(false);
    setIsConnecting(false);
    
    // 용접기 1번을 기본 상태로 변경 (시뮬레이터는 계속 실행 중)
    setWeldingEquipmentData(prev => 
      prev.map(equipment => 
        equipment.id === 1 
          ? { 
              ...equipment, 
              isConnected: false
            }
          : equipment
      )
    );
  };

  // 용접기 상태 업데이트 함수
// 용접기 상태 업데이트 함수
  const updateWeldingMachineStatus = (weldingData) => {
    setWeldingEquipmentData(prev => 
      prev.map(equipment => 
        equipment.id === 1 
          ? {
              ...equipment,
              status: weldingData.status === 'anomaly' ? '이상' : '정상',
              isConnected: weldingData.isConnected,
              isOperating: weldingData.isOperating,
              operatingStatus: weldingData.isOperating ? '가동 중' : '대기 중'
            }
          : equipment
      )
    );

    // 🚨 이상 감지 시 모든 것 자동 중단
    if (weldingData.status === 'anomaly') {
      console.log('🚨 이상 감지! 모든 시스템 자동 중단');
      
      // 1. 실시간 모니터링 중지
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
        setIsStreamConnected(false);
        console.log('🛑 실시간 모니터링 자동 중지');
      }
      
      // 2. 데이터 체크 중단
      if (dataCheckInterval) {
        clearInterval(dataCheckInterval);
        setDataCheckInterval(null);
        console.log('🛑 데이터 체크 중단');
      }
      
      // 3. 시뮬레이터 자동 중지 (즉시 실행)
      fetch('http://localhost:8008/simulator/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        if (response.ok) {
          setIsSimulatorRunning(false);
          console.log('🛑 시뮬레이터 자동 중지 완료');
        }
      }).catch(error => {
        console.error('❌ 시뮬레이터 자동 중지 실패:', error);
      });
    }
  };

  // 🔧 용접기 1번이 이상 상태인지 확인
  const isAnomalyDetected = weldingEquipmentData[0]?.status === '이상';

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (dataCheckInterval) {
        clearInterval(dataCheckInterval);
      }
    };
  }, []);

  return (
    <>
      <PageLayout 
        title="차체 공정 모니터링"
        description={`차체 공정 수신 ${isStreamConnected ? '양호 🟢' : isConnecting ? '연결 중 🟡' : '대기 중 ⚪'}`}
        footerTitle="차체 공정 가공률 상태"
        footerDescription="차트 컴포넌트가 여기에 들어갈 예정입니다."
        showFooter={true}
      >
        {/* 데모 제어 패널 */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>🎮 데모 제어 패널</h4>
          
          {/* 1단계: 시뮬레이터 제어 */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ minWidth: '120px', fontWeight: 'bold' }}>1단계: 시뮬레이터</span>
              <span style={{ 
                color: isSimulatorRunning ? '#22c55e' : '#6b7280',
                fontWeight: 'bold'
              }}>
                {isSimulatorRunning ? '실행 중 ✅' : '중지됨 ⏸️'}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isSimulatorRunning ? (
                <button 
                  onClick={startSimulator}
                  disabled={isStartingSimulator}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isStartingSimulator ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isStartingSimulator ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {isStartingSimulator ? '시작 중...' : '시뮬레이터 시작'}
                </button>
              ) : (
                <button 
                  onClick={stopSimulator}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  시뮬레이터 중지
                </button>
              )}
            </div>
          </div>

          {/* 🔧 이상 상태 알림 및 재개 버튼 */}
          {isAnomalyDetected && (
            <div style={{ 
              marginBottom: '15px', 
              padding: '10px', 
              backgroundColor: '#fee2e2', 
              borderRadius: '4px',
              border: '1px solid #fecaca'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#dc2626' }}>🚨 이상 감지!</span>
                <span style={{ fontSize: '14px', color: '#7f1d1d' }}>
                  모든 시스템이 자동 중단되었습니다.
                </span>
              </div>
              <button 
                onClick={resumeDataCollection}
                disabled={isResuming}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isResuming ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isResuming ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {isResuming ? '재시작 중...' : '🔄 전체 시스템 재시작'}
              </button>
            </div>
          )}

          {/* 1.5단계: 데이터 준비 상태 표시 */}
          {isSimulatorRunning && !isAnomalyDetected && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>AI 예측 데이터:</span>
                <span style={{ 
                  color: isDataReady ? '#22c55e' : '#f59e0b',
                  fontWeight: 'bold'
                }}>
                  {isDataReady ? '준비 완료 🎯' : '분석 중... ⏳'}
                </span>
                {!isDataReady && (
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    (최대 1분 소요)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 2단계: 실시간 모니터링 제어 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ minWidth: '120px', fontWeight: 'bold' }}>2단계: 실시간 모니터링</span>
              <span style={{ 
                color: isStreamConnected ? '#22c55e' : isConnecting ? '#f59e0b' : '#6b7280',
                fontWeight: 'bold'
              }}>
                {isStreamConnected ? '연결됨 📡' : isConnecting ? '연결 중... 🔄' : '연결 안됨 📴'}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isStreamConnected && !isConnecting ? (
                <button 
                  onClick={startRealTimeMonitoring}
                  disabled={!isSimulatorRunning || !isDataReady}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: (!isSimulatorRunning || !isDataReady) ? '#d1d5db' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: (!isSimulatorRunning || !isDataReady) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  실시간 모니터링 시작
                </button>
              ) : isConnecting ? (
                <button 
                  disabled
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'not-allowed',
                    fontWeight: 'bold'
                  }}
                >
                  연결 중...
                </button>
              ) : (
                <button 
                  onClick={stopRealTimeMonitoring}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  모니터링 중지
                </button>
              )}
              
              {(!isSimulatorRunning || !isDataReady) && !isAnomalyDetected && (
                <span style={{ 
                  color: '#6b7280', 
                  fontSize: '14px', 
                  fontStyle: 'italic',
                  alignSelf: 'center'
                }}>
                  ※ {!isSimulatorRunning ? '시뮬레이터를 먼저 시작해주세요' : 'AI 예측 데이터를 기다리는 중...'}
                </span>
              )}
            </div>
          </div>
        </div>

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