import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';
import AssemblyChartsDashboard from '../../components/charts/ProcessChart/AssemblyChartsDashboard';

export const AssemblyMonitoring = () => {
  const [assemblyEquipmentData, setAssemblyEquipmentData] = useState([
    {
      id: 1,
      name: "조립라인 A",
      title: "커넥터 조립 공정 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "조립 중"
    },
    {
      id: 2,
      name: "조립라인 B", 
      title: "배선 조립 공정 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "조립 중"
    },
    {
      id: 3,
      name: "조립 라인 C", 
      title: "프레임 조립 공정 결함 탐지",
      status: "정상",
      isOperating: true,
      manager: "관리자",
      operatingStatus: "검사 중"
    }
  ]);

  // 🎯 초기값 설정
  const initialLineStats = {
    0: { totalProducts: 0, totalDefects: 0, goodProducts: 0 }, // 총계
    1: { totalProducts: 0, totalDefects: 0, newProducts: 0 },
    2: { totalProducts: 0, totalDefects: 0, newProducts: 0 },
    3: { totalProducts: 0, totalDefects: 0, newProducts: 0 }
  };

  const [lineStats, setLineStats] = useState(initialLineStats);
  const prevLineStatsRef = useRef(initialLineStats);

  // lineStats가 변경될 때마다 ref 동기화
  useEffect(() => {
    prevLineStatsRef.current = lineStats;
  }, [lineStats]);

  // 폴링 상태 관리
  const [isPolling, setIsPolling] = useState(false);
  const [pollingIntervals, setPollingIntervals] = useState({});

  const destinationUrl = '/vehicleAssemblyProcessDefectDetectionLogs/defect-detection'

  // 특정 라인의 결과 폴링 시작
  const startResultPolling = (lineId) => {
    const interval = setInterval(async () => {
      try {
        console.log(`📡 라인 ${lineId} 데이터 요청 중...`);
        const response = await fetch(`${destinationUrl}/${lineId}/${prevLineStatsRef.current[lineId].totalProducts}`);
        if (response.ok) {
          const obj = await response.json();
          const results = obj.defectDetectionResponses;

          const totalProducts = obj.totalProductCount;
          const totalDefects = obj.defectProductCount;

          console.log(`✅ 라인 ${lineId} 신규 데이터 수신:`, obj);
          if (totalProducts > 0) {
            console.log(`✅ 라인 ${lineId} 신규 데이터 수신:`, results);
            
            // 해당 라인의 통계 저장 + 전체 통계 계산 및 저장
            setLineStats(prev => {
              // 현재 라인 데이터 계산
              const newLineData = {
                totalProducts: totalProducts,
                totalDefects: totalDefects,
                newProducts: (totalProducts - (prevLineStatsRef.current[lineId]?.totalProducts || 0))
              };

              // 전체 통계 계산 (모든 라인의 합계)
              const allLines = { ...prev, [lineId]: newLineData }; // 현재 라인 포함한 모든 데이터
              
              const overallTotalProducts = Object.keys(allLines)
                .filter(key => key !== '0') // 0 키 제외하고 라인만
                .reduce((sum, key) => sum + (allLines[key]?.totalProducts || 0), 0);
              
              const overallTotalDefects = Object.keys(allLines)
                .filter(key => key !== '0')
                .reduce((sum, key) => sum + (allLines[key]?.totalDefects || 0), 0);

              const overallGoodProducts = overallTotalProducts - overallTotalDefects;

              return {
                ...prev,
                0: { // 전체 통계
                  totalProducts: overallTotalProducts,
                  totalDefects: overallTotalDefects,
                  goodProducts: overallGoodProducts
                },
                [lineId]: newLineData // 특정 라인
              };
            });

            // 신규 결과 중 불량이 하나라도 있는지 확인하여 장비 상태 업데이트
            const hasAnyDefect = results.some(result => result.defectType === '불량품');
            setAssemblyEquipmentData(prev => 
              prev.map(equipment => {
                if (equipment.id === lineId) {
                  console.log(`🔄 라인 ${lineId} 상태 업데이트: ${hasAnyDefect ? '이상' : '정상'} (신규 데이터 ${results.length}개 중 불량 ${results.filter(r => r.defectType === '불량품').length}개)`);
                  return {
                    ...equipment,
                    status: hasAnyDefect ? '이상' : '정상',
                    isOperating: !hasAnyDefect,
                    operatingStatus: hasAnyDefect ? '불량 탐지' : 
                      equipment.id === 3 ? '검사 중' : '조립 중'
                  };
                }
                return equipment;
              })
            );
          } else {
            console.log(`ℹ️ 라인 ${lineId}: 새 데이터 없음`);
          }
        } else {
          console.warn(`⚠️ 라인 ${lineId} 응답 오류: ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ 라인 ${lineId} 결과 폴링 오류:`, error);
      }
    }, 2000); // 2초마다 폴링

    return interval;
  };

  // 모든 라인의 폴링 시작
  const startAllPolling = () => {
    console.log('🚀 모든 라인 데이터 폴링 시작 (2초 간격)');
    setIsPolling(true);
    
    const intervals = {};
    [1, 2, 3].forEach(lineId => {
      intervals[lineId] = startResultPolling(lineId);
      console.log(`📊 라인 ${lineId} 폴링 활성화`);
    });
    
    setPollingIntervals(intervals);
  };

  // 페이지 로드 시 자동으로 폴링 시작
  useEffect(() => {
    // 컴포넌트 마운트 후 1초 뒤에 폴링 시작
    const timer = setTimeout(() => {
      startAllPolling();
    }, 1000);

    return () => {
      clearTimeout(timer);
      // 컴포넌트 언마운트 시 모든 폴링 정리
      Object.values(pollingIntervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []); // 빈 dependency array로 마운트 시에만 실행

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
        title="의장 조립 공정 모니터링"
        description={`의장 조립 공정 수신 ${isPolling ? '양호 🟢' : '대기 중 ⚪'}`}
        footerTitle="조립 공정 효율성 상태"
        showFooter={true}
      >
        
        <EquipmentList 
          title="조립 라인 상태 목록"
          equipmentData={assemblyEquipmentData}
          defaultImage="https://www.hyundai.co.kr/image/upload/asset_library/MDA00000000000060267/8d8c1d3abef145258d5328517d56411a.jpg"
          showConnectionStatus={false}
        />
      </PageLayout>
      
      {/* 차트 대시보드 추가 */}
      <div className="mt-8">
        <AssemblyChartsDashboard lineStats={lineStats} />
      </div>
      <ChatBot />
    </>
  );
};