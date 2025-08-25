import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';
import PressChartsDashboard from '../../components/charts/ProcessChart/PressChartsDashboard';
import PressFaultChartDashboard from '../../components/charts/ProcessChart/PressFaultChartDashboard';
import styled from 'styled-components';

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

const ChartContainer = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DefectTypeBarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const DefectBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DefectBarLabel = styled.div`
  min-width: 60px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const DefectBarContainer = styled.div`
  flex: 1;
  height: 24px;
  background: #fff5f5;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
`;

const DefectBarFill = styled.div`
  height: 100%;
  background: ${props => props.color || 'linear-gradient(135deg, #ff6b6b, #dc3545)'};
  border-radius: 12px;
  width: ${props => props.percentage}%;
  transition: width 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 600;
`;

const DefectBarValue = styled.div`
  min-width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #dc3545;
`;

const LineDefectChart = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 20px;
`;

const DefectTypeColors = {
  AX1: '#FF6B6B',
  BY1: '#4ECDC4', 
  CY1: '#45B7D1',
  DY1: '#96CEB4',
  DY2: '#FFEAA7',
  DY3: '#DDA0DD',
  DY4: '#98D8C8'
};

const LineDefectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

const LineDefectCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
`;

const LineDefectTitle = styled.h4`
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  text-align: center;
`;

const LineDefectBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LineDefectBarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LineDefectTypeLabel = styled.div`
  min-width: 35px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
`;

const LineDefectBarContainer = styled.div`
  flex: 1;
  height: 20px;
  background: #fff;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const LineDefectBarFill = styled.div`
  height: 100%;
  background: ${props => props.color};
  border-radius: 10px;
  width: ${props => props.percentage}%;
  transition: width 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 600;
`;

const LineDefectCount = styled.div`
  min-width: 25px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: #666;
`;

export const PressMonitoring = () => {
  const url = process.env.REACT_APP_API_BASE_URL;
  
  // 통합된 장비 데이터 (프레스 + 검사 라인)
  const [pressEquipmentData, setPressEquipmentData] = useState([
    {
      id: 1,
      name: "프레스 1",
      title: "유압펌프 고장 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "가동 중",
      image: "/pressmachine.png"
    },
    {
      id: 2,
      name: "프레스 2", 
      title: "유압펌프 고장 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "가동 중",
      image: "/pressmachine.png"
    },
    {
      id: 3,
      name: "검사 라인 1",
      title: "프레스 패널 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "검사 중",
      productType: "제품 A",
      defectRate: "0.2%",
      image: "/pressproduct.png"
    },
    {
      id: 4,
      name: "검사 라인 2",
      title: "프레스 패널 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "검사 중",
      productType: "제품 B",
      defectRate: "0.4%",
      image: "/pressproduct.png"
    }
  ]);

  // 재구성 오차 차트 데이터
  const [reconstructionErrorData, setReconstructionErrorData] = useState(() => {
    const now = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const time = new Date(now.getTime() - (9 - i) * 60000);
      return {
        time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
        timestamp: time.getTime(),
        reconstructionError: 0.001 + Math.random() * 0.001,
        faultProbability: Math.random() * 0.3,
        isFault: false
      };
    });
  });
  
  // 현재 상태
  const [currentStatus, setCurrentStatus] = useState({
    isFault: false,
    reconstructionError: 0.002
  });

  // 검사 라인별 통계 데이터 (ID 3, 4만 사용)
  const initialPressStats = {
    0: { totalProducts: 0, totalDefects: 0, goodProducts: 0 }, // 총계
    3: { totalProducts: 0, totalDefects: 0, newProducts: 0 }, // 검사 라인 1
    4: { totalProducts: 0, totalDefects: 0, newProducts: 0 }  // 검사 라인 2
  };

  const [pressStats, setPressStats] = useState(initialPressStats);
  const prevPressStatsRef = useRef(initialPressStats);

  // pressStats가 변경될 때마다 ref 동기화
  useEffect(() => {
    prevPressStatsRef.current = pressStats;
  }, [pressStats]);

  // 폴링 상태 관리
  const [isPolling, setIsPolling] = useState(false);
  const [pollingIntervals, setPollingIntervals] = useState({});

  const destinationUrl = '/pressProductDefectDetectionLogs/defect-detection'

  // 결함 유형별 분포 데이터 관리
  const [defectTypeBreakdown, setDefectTypeBreakdown] = useState({
    AX1: 0,
    BY1: 0,
    CY1: 0,
    DY1: 0,
    DY2: 0,
    DY3: 0,
    DY4: 0
  });

  // 검사 라인별 결함 유형 데이터 관리 (ID 3, 4만 사용)
  const [lineDefectBreakdown, setLineDefectBreakdown] = useState({
    3: { AX1: 0, BY1: 0, CY1: 0, DY1: 0, DY2: 0, DY3: 0, DY4: 0 }, // 검사 라인 1
    4: { AX1: 0, BY1: 0, CY1: 0, DY1: 0, DY2: 0, DY3: 0, DY4: 0 }  // 검사 라인 2
  });

  // 차트 강제 리렌더링을 위한 키 관리
  const [chartUpdateKey, setChartUpdateKey] = useState(0);

  // 동적 데이터 업데이트를 위한 시뮬레이션 함수들
  const generateRandomIncrement = (min = 0, max = 2) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateDefectProbability = () => {
    return Math.random() < 0.02; // 2% 확률로 불량품 생성
  };

  // 통합된 데이터 업데이트 함수 - 차트와 장비 상태를 동시에 업데이트
  const updatePressDataWithDefect = (pressId, hasDefect, defectType = null, additionalDefects = 1) => {
    console.log(`🔄 통합 업데이트: 검사 라인 ${pressId}, 결함 여부: ${hasDefect}, 타입: ${defectType}`);
    
    // 상태 업데이트를 Promise로 래핑하여 순서 보장
    return new Promise((resolve) => {
      // 1. pressStats 업데이트
      setPressStats(prev => {
        const newStats = { ...prev };
        
        if (hasDefect) {
          // 해당 라인의 불량품 수 증가
          newStats[pressId] = {
            ...prev[pressId],
            totalDefects: prev[pressId].totalDefects + additionalDefects
          };
          
          // 전체 통계도 동시 업데이트
          const newOverallDefects = prev[0].totalDefects + additionalDefects;
          newStats[0] = {
            ...prev[0],
            totalDefects: newOverallDefects,
            goodProducts: prev[0].totalProducts - newOverallDefects
          };
        }
        
        console.log('📊 pressStats 업데이트 완료:', newStats);
        return newStats;
      });

      // 2. 장비 상태 업데이트
      setPressEquipmentData(prevEquipment => {
        const updatedEquipment = prevEquipment.map(equipment => {
          if (equipment.id === pressId) {
            const updatedItem = { ...equipment };
            
            if (hasDefect) {
              updatedItem.status = "결함";
              updatedItem.isOperating = false;
              updatedItem.operatingStatus = "결함 탐지";
              if (defectType) {
                updatedItem.lastDefectType = defectType;
              }
              // 불량률 업데이트
              const currentStats = prevPressStatsRef.current[pressId];
              if (currentStats && currentStats.totalProducts > 0) {
                const newDefectRate = ((currentStats.totalDefects + additionalDefects) / currentStats.totalProducts * 100).toFixed(1);
                updatedItem.defectRate = `${newDefectRate}%`;
              }
            } else {
              updatedItem.status = "정상";
              updatedItem.isOperating = true;
              updatedItem.operatingStatus = "검사 중";
            }
            
            return updatedItem;
          }
          return equipment;
        });
        
        console.log('🏭 장비 상태 업데이트 완료');
        return updatedEquipment;
      });

      // 3. 차트 강제 리렌더링
      setChartUpdateKey(prev => prev + 1);
      
      resolve();
    });
  };

  // 2초마다 데이터 업데이트하는 시뮬레이션 (수정된 버전)
  const startDataSimulation = () => {
    console.log('📊 데이터 시뮬레이션 시작 (10초 간격)');
    
    const simulationInterval = setInterval(async () => {
      let hasAnyDefectDetected = false;
      let defectDetails = [];

      // 먼저 새로운 통계 데이터 계산
      const newStatsUpdate = await new Promise((resolve) => {
        setPressStats(prev => {
          const newStats = { ...prev };
          let overallTotalProducts = 0;
          let overallTotalDefects = 0;

          // 각 검사 라인별로 데이터 업데이트 (ID 3, 4만)
          [3, 4].forEach(pressId => {
            const currentPress = prev[pressId];
            const newProductsCount = generateRandomIncrement(4, 6); // 4~6개 신규 생산
            const hasDefect = generateDefectProbability(); // 2% 확률로 불량품
            
            const newTotalProducts = currentPress.totalProducts + newProductsCount;
            const newTotalDefects = currentPress.totalDefects + (hasDefect ? 1 : 0);
            
            newStats[pressId] = {
              totalProducts: newTotalProducts,
              totalDefects: newTotalDefects,
              newProducts: newProductsCount
            };

            overallTotalProducts += newTotalProducts;
            overallTotalDefects += newTotalDefects;

            if (hasDefect) {
              hasAnyDefectDetected = true;
              const defectTypes = ['AX1', 'BY1', 'CY1', 'DY1', 'DY2', 'DY3', 'DY4'];
              const randomDefectType = defectTypes[Math.floor(Math.random() * defectTypes.length)];
              
              defectDetails.push({ pressId, defectType: randomDefectType });
              
              console.log(`⚠️ 검사 라인 ${pressId}에서 불량품 발생: ${randomDefectType}`);
            }
          });

          // 전체 통계 업데이트
          newStats[0] = {
            totalProducts: overallTotalProducts,
            totalDefects: overallTotalDefects,
            goodProducts: overallTotalProducts - overallTotalDefects
          };

          console.log('📈 시뮬레이션 데이터 업데이트:', newStats);
          resolve(newStats);
          return newStats;
        });
      });

      // 결함 발생 시 관련 데이터 업데이트
      if (hasAnyDefectDetected) {
        for (const { pressId, defectType } of defectDetails) {
          // 전체 결함 유형별 분포 업데이트
          setDefectTypeBreakdown(prev => ({
            ...prev,
            [defectType]: prev[defectType] + 1
          }));
          
          // 검사 라인별 결함 유형 분포 업데이트
          setLineDefectBreakdown(prev => ({
            ...prev,
            [pressId]: {
              ...prev[pressId],
              [defectType]: prev[pressId][defectType] + 1
            }
          }));
        }

        // 장비 상태 업데이트 (결함 발생한 라인만)
        setPressEquipmentData(prevEquipment => 
          prevEquipment.map(equipment => {
            const defectInfo = defectDetails.find(d => d.pressId === equipment.id);
            if (defectInfo && equipment.id >= 3) { // 검사 라인만
              const lineStats = newStatsUpdate[equipment.id];
              const newDefectRate = lineStats.totalProducts > 0 ? 
                ((lineStats.totalDefects / lineStats.totalProducts) * 100).toFixed(1) : "0.0";
              
              return {
                ...equipment,
                status: "결함",
                isOperating: false,
                operatingStatus: "결함 탐지",
                defectRate: `${newDefectRate}%`,
                lastDefectType: defectInfo.defectType
              };
            } else if (equipment.id >= 3) {
              // 결함이 없는 검사 라인은 불량률만 업데이트
              const lineStats = newStatsUpdate[equipment.id];
              const newDefectRate = lineStats && lineStats.totalProducts > 0 ? 
                ((lineStats.totalDefects / lineStats.totalProducts) * 100).toFixed(1) : "0.0";
              
              return {
                ...equipment,
                defectRate: `${newDefectRate}%`
              };
            }
            return equipment;
          })
        );
        
        // 차트 강제 업데이트
        setChartUpdateKey(prev => prev + 1);
      }
      
    }, 30000); // 30초마다 업데이트

    return simulationInterval;
  };

  // 특정 검사 라인의 결과 폴링 시작
  const startResultPolling = (pressId) => {
    const interval = setInterval(async () => {
      try {
        console.log(`📡 검사 라인 ${pressId} 데이터 요청 중...`);
        const response = await fetch(`${destinationUrl}/${pressId}/${prevPressStatsRef.current[pressId].totalProducts}`);
        if (response.ok) {
          const obj = await response.json();
          const results = obj.defectDetectionResponses;

          const totalProducts = obj.totalProductCount;
          const totalDefects = obj.defectProductCount;

          console.log(`✅ 검사 라인 ${pressId} 신규 데이터 수신:`, obj);
          if (totalProducts > 0) {
            console.log(`✅ 검사 라인 ${pressId} 신규 데이터 수신:`, results);
            
            // 해당 검사 라인의 통계 저장 + 전체 통계 계산 및 저장
            setPressStats(prev => {
              // 현재 검사 라인 데이터 계산
              const newPressData = {
                totalProducts: totalProducts,
                totalDefects: totalDefects,
                newProducts: (totalProducts - (prevPressStatsRef.current[pressId]?.totalProducts || 0))
              };

              // 전체 통계 계산 (모든 검사 라인의 합계)
              const allPresses = { ...prev, [pressId]: newPressData }; // 현재 검사 라인 포함한 모든 데이터
              
              const overallTotalProducts = Object.keys(allPresses)
                .filter(key => key !== '0') // 0 키 제외하고 검사 라인만
                .reduce((sum, key) => sum + (allPresses[key]?.totalProducts || 0), 0);
              
              const overallTotalDefects = Object.keys(allPresses)
                .filter(key => key !== '0')
                .reduce((sum, key) => sum + (allPresses[key]?.totalDefects || 0), 0);

              const overallGoodProducts = overallTotalProducts - overallTotalDefects;

              const updatedStats = {
                ...prev,
                0: { // 전체 통계
                  totalProducts: overallTotalProducts,
                  totalDefects: overallTotalDefects,
                  goodProducts: overallGoodProducts
                },
                [pressId]: newPressData // 특정 검사 라인
              };
              
              console.log('📊 실시간 폴링 데이터 업데이트:', updatedStats);
              return updatedStats;
            });

            // 신규 결과 중 불량이 하나라도 있는지 확인하여 장비 상태 업데이트
            const hasAnyDefect = results.some(result => result.defectType === '불량품');
            setPressEquipmentData(prev => 
              prev.map(equipment => {
                if (equipment.id === pressId) {
                  console.log(`🔄 검사 라인 ${pressId} 상태 업데이트: ${hasAnyDefect ? '이상' : '정상'}`);
                  const newDefectRate = totalProducts > 0 ? ((totalDefects / totalProducts) * 100).toFixed(1) : "0.0";
                  
                  return {
                    ...equipment,
                    status: hasAnyDefect ? '이상' : '정상',
                    isOperating: !hasAnyDefect,
                    operatingStatus: hasAnyDefect ? '불량 탐지' : '검사 중',
                    defectRate: `${newDefectRate}%`
                  };
                }
                return equipment;
              })
            );
            
            // 차트 강제 업데이트
            if (hasAnyDefect) {
              setChartUpdateKey(prev => prev + 1);
            }
          } else {
            console.log(`ℹ️ 검사 라인 ${pressId}: 새 데이터 없음`);
          }
        } else {
          console.warn(`⚠️ 검사 라인 ${pressId} 응답 오류: ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ 검사 라인 ${pressId} 결과 폴링 오류:`, error);
      }
    }, 3000); // 3초마다 폴링

    return interval;
  };

  // 모든 검사 라인의 폴링 시작
  const startAllPolling = () => {
    console.log('🚀 모든 검사 라인 데이터 폴링 시작 (3초 간격)');
    setIsPolling(true);
    
    const intervals = {};
    [3, 4].forEach(pressId => {
      intervals[pressId] = startResultPolling(pressId);
      console.log(`📊 검사 라인 ${pressId} 폴링 활성화`);
    });
    
    setPollingIntervals(intervals);
  };

  useEffect(() => {
    let eventSource = null;
    let reconnectTimeout = null;
    
    const connectSSE = () => {
      try {
        console.log('SSE 연결 시도 중...');
        eventSource = new EventSource(`${url}/pressFaultDetectionLogs/status/stream`);
        
        setTimeout(() => {
          if (eventSource && eventSource.readyState === 0) {
            console.log('현재 readyState:', eventSource.readyState);
          }
        }, 5000);
        
        eventSource.onopen = () => {
          console.log('SSE 연결 성공');
        };
        
        eventSource.addEventListener('faultStatus', (event) => {
          try {
            console.log('faultStatus 이벤트 수신:', event.data);
            const data = JSON.parse(event.data);
            console.log('faultStatus 파싱된 데이터:', data);
            const { isFault, prediction, reconstructionError, faultProbability } = data;
            
            // 장비 목록 상태 업데이트
            setPressEquipmentData(prevData => {
              const updatedData = prevData.map(press => 
                press.id === 1 ? {
                  ...press,
                  status: isFault ? "고장" : "정상",
                  operatingStatus: isFault ? "점검 필요" : "가동 중",
                  isOperating: !isFault,
                  reconstructionError: reconstructionError ? reconstructionError.toFixed(4) : "0.0000"
                } : press
              );
              console.log('faultStatus 업데이트된 데이터:', updatedData);
              return updatedData;
            });

            // 현재 상태 업데이트
            setCurrentStatus({
              isFault: isFault,
              reconstructionError: reconstructionError || 0
            });

            // 차트 데이터 업데이트
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            setReconstructionErrorData(prevData => [
              ...prevData.slice(-19), // 최근 20개 데이터만 유지
              {
                time: timeString,
                timestamp: now.getTime(),
                reconstructionError: parseFloat((reconstructionError || 0).toFixed(4)),
                faultProbability: parseFloat((faultProbability || 0).toFixed(4)),
                isFault: isFault
              }
            ]);
            
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
  }, [url]);


  // 페이지 로드 시 자동으로 데이터 시뮬레이션 시작
  useEffect(() => {
    let simulationInterval = null;
    
    // 컴포넌트 마운트 후 1초 뒤에 시뮬레이션 시작
    const timer = setTimeout(() => {
      simulationInterval = startDataSimulation();
      setIsPolling(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
      // 컴포넌트 언마운트 시 모든 폴링 정리
      Object.values(pollingIntervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []); // 빈 dependency array로 마운트 시에만 실행

  // 목업 데이터 - 1분 후 검사 라인 1 상태 변경 (ID 3) - 수정된 버전
  useEffect(() => {
    // 1분(60초) 후에 검사 라인 1의 상태를 "결함"으로 변경
    const mockDefectTimer = setTimeout(async () => {
      console.log('🔄 목업 데이터: 1분 후 검사 라인 1 결함 발생 - 차트 즉시 반영');
      
      // 통합된 업데이트 함수 사용
      await updatePressDataWithDefect(3, true, 'AX1', 2); // 검사 라인 1에 AX1 타입 결함 5개 발생
      
      // 추가로 결함 통계도 업데이트
      setDefectTypeBreakdown(prev => ({
        ...prev,
        AX1: prev.AX1 + 2
      }));
      
      setLineDefectBreakdown(prev => ({
        ...prev,
        3: {
          ...prev[3],
          AX1: prev[3].AX1 + 2
        }
      }));

      // 차트 강제 업데이트
      setChartUpdateKey(prev => prev + 1);
      
      console.log('✅ 목업 결함 데이터 적용 완료 - 차트 업데이트됨');

    }, 60000); // 60초 = 1분

    return () => {
      clearTimeout(mockDefectTimer);
    };
  }, []); // 컴포넌트 마운트 시에만 실행

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      Object.values(pollingIntervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [pollingIntervals]);

  return (
    <>
      <PageLayout 
        title="프레스 공정 모니터링"
        description={`유압 펌프 고장 탐지 수신 ${isPolling ? '양호 🟢' : '대기 중 ⚪'} | 프레스 생산품 결함 탐지 수신 ${isPolling ? '양호 🟢' : '대기 중 ⚪'}`}
        footerTitle="프레스 생산품 결함 실시간 현황"
        footerDescription="프레스 생산품별 불량률 및 생산 효율성 모니터링"
        showFooter={true}
      >
        <EquipmentList  
          title="유압펌프 및 생산품 상태 목록"
          equipmentData={pressEquipmentData}
          //defaultImage="/pressmachine.png"
          showConnectionStatus={false}
        />
      <PressFaultChartDashboard 
          currentStatus={currentStatus}
          reconstructionErrorData={reconstructionErrorData}
        />
      </PageLayout>
      {/* 프레스 차트 대시보드 - 수정된 데이터 구조와 강제 리렌더링 */}
      <div className="mt-8">
        <PressChartsDashboard 
          pressStats={{
            0: pressStats[0] || { totalProducts: 0, totalDefects: 0, goodProducts: 0 }, // 전체 통계
            1: pressStats[3] || { totalProducts: 0, totalDefects: 0 }, // 검사 라인 1 → 차트 라인 1
            2: pressStats[4] || { totalProducts: 0, totalDefects: 0 }  // 검사 라인 2 → 차트 라인 2
          }} 
          key={`press-chart-${chartUpdateKey}-${pressStats[0]?.totalDefects || 0}-${Date.now()}`} // 강제 리렌더링
        />
      </div>  
      <ChatBot />
    </>
  );
};
