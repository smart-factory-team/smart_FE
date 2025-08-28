// import React, { useState, useEffect, useRef } from 'react';
// import { PageLayout } from '../../components/layout';
// import { EquipmentList } from '../../components/ui/EquipmentList';
// import { ChatBot } from '../../components/ui/ChatBot';
// import PressFaultChartDashboard from '../../components/charts/ProcessChart/PressFaultChartDashboard';
// import styled from 'styled-components';

// export const PressMonitoring = () => {
//   const url = process.env.REACT_APP_API_BASE_URL;
  
//   // 통합된 장비 데이터 (프레스 + 검사 라인)
//   const [pressEquipmentData, setPressEquipmentData] = useState([
//     {
//       id: 1,
//       name: "프레스 1",
//       title: "유압펌프 고장 탐지",
//       status: "정상",
//       isOperating: true,
//       manager: "관리자",
//       operatingStatus: "가동 중",
//       image: "/pressmachine.png"
//     },
//     {
//       id: 2,
//       name: "프레스 2", 
//       title: "유압펌프 고장 탐지",
//       status: "정상",
//       isOperating: true,
//       manager: "관리자",
//       operatingStatus: "가동 중",
//       image: "/pressmachine.png"
//     },
//     {
//       id: 3,
//       name: "검사 라인 1",
//       title: "프레스 패널 결함 탐지",
//       status: "정상",
//       isOperating: true,
//       manager: "관리자",
//       operatingStatus: "검사 중",
//       productType: "제품 A",
//       defectRate: "0.2%",
//       image: "/pressproduct.png"
//     },
//     {
//       id: 4,
//       name: "검사 라인 2",
//       title: "프레스 패널 결함 탐지",
//       status: "정상",
//       isOperating: true,
//       manager: "관리자",
//       operatingStatus: "검사 중",
//       productType: "제품 B",
//       defectRate: "0.4%",
//       image: "/pressproduct.png"
//     }
//   ]);

//   // 재구성 오차 차트 데이터
//   const [reconstructionErrorData, setReconstructionErrorData] = useState(() => {
//     const now = new Date();
//     return Array.from({ length: 10 }, (_, i) => {
//       const time = new Date(now.getTime() - (9 - i) * 60000);
//       return {
//         time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
//         timestamp: time.getTime(),
//         reconstructionError: 0.001 + Math.random() * 0.001,
//         faultProbability: Math.random() * 0.3,
//         isFault: false
//       };
//     });
//   });
  
//   // 현재 상태
//   const [currentStatus, setCurrentStatus] = useState({
//     isFault: false,
//     reconstructionError: 0.002
//   });

//   // 페이지 시작 시 차트 데이터의 최신 값으로 currentStatus 업데이트
//   useEffect(() => {
//     if (reconstructionErrorData.length > 0) {
//       const latestData = reconstructionErrorData[reconstructionErrorData.length - 1];
//       setCurrentStatus(prev => ({
//         ...prev,
//         reconstructionError: latestData.reconstructionError
//       }));
//     }
//   }, []);

//   // 검사 라인별 통계 데이터 (ID 3, 4만 사용)
//   const initialPressStats = {
//     0: { totalProducts: 0, totalDefects: 0, goodProducts: 0 }, // 총계
//     3: { totalProducts: 0, totalDefects: 0, newProducts: 0 }, // 검사 라인 1
//     4: { totalProducts: 0, totalDefects: 0, newProducts: 0 }  // 검사 라인 2
//   };

//   // 폴링 상태 관리
//   const [isPolling, setIsPolling] = useState(false);
//   const [pollingIntervals, setPollingIntervals] = useState({});

//   useEffect(() => {
//     let eventSource = null;
//     let reconnectTimeout = null;
    
//     const connectSSE = () => {
//       try {
//         console.log('SSE 연결 시도 중...');
//         eventSource = new EventSource(`${url}/pressFaultDetectionLogs/status/stream`);
        
//         setTimeout(() => {
//           if (eventSource && eventSource.readyState === 0) {
//             console.log('현재 readyState:', eventSource.readyState);
//           }
//         }, 5000);
        
//         eventSource.onopen = () => {
//           console.log('SSE 연결 성공');
//         };
        
//         eventSource.addEventListener('faultStatus', (event) => {
//           try {
//             console.log('faultStatus 이벤트 수신:', event.data);
//             const data = JSON.parse(event.data);
//             console.log('faultStatus 파싱된 데이터:', data);
//             const { isFault, prediction, reconstructionError, faultProbability } = data;
            
//             // 장비 목록 상태 업데이트
//             setPressEquipmentData(prevData => {
//               const updatedData = prevData.map(press => 
//                 press.id === 1 ? {
//                   ...press,
//                   status: isFault ? "고장" : "정상",
//                   operatingStatus: isFault ? "점검 필요" : "가동 중",
//                   isOperating: !isFault,
//                   reconstructionError: reconstructionError ? reconstructionError.toFixed(4) : "0.0000"
//                 } : press
//               );
//               console.log('faultStatus 업데이트된 데이터:', updatedData);
//               return updatedData;
//             });

//             // 현재 상태의 isFault만 업데이트 (reconstructionError는 차트 데이터 업데이트 시 처리)
//             setCurrentStatus(prev => ({
//               ...prev,
//               isFault: isFault
//             }));

//             // 차트 데이터 업데이트
//             const now = new Date();
//             const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
//             setReconstructionErrorData(prevData => {
//               const newData = [
//                 ...prevData.slice(-19), // 최근 20개 데이터만 유지
//                 {
//                   time: timeString,
//                   timestamp: now.getTime(),
//                   reconstructionError: parseFloat((reconstructionError || 0).toFixed(4)),
//                   faultProbability: parseFloat((faultProbability || 0).toFixed(4)),
//                   isFault: isFault
//                 }
//               ];
              
//               // 가장 최근 데이터의 reconstructionError로 currentStatus 업데이트
//               const latestData = newData[newData.length - 1];
//               setCurrentStatus(prev => ({
//                 ...prev,
//                 reconstructionError: latestData.reconstructionError
//               }));
              
//               return newData;
//             });
            
//           } catch (error) {
//             console.error('faultStatus 데이터 파싱 오류:', error);
//           }
//         });

//         eventSource.onerror = (error) => {
//           console.error('SSE 연결 오류:', error);
//           console.log('EventSource readyState:', eventSource.readyState);
//           eventSource.close();
          
//           reconnectTimeout = setTimeout(() => {
//             console.log('SSE 재연결 시도...');
//             connectSSE();
//           }, 3000);
//         };
//       } catch (error) {
//         console.error('SSE 초기화 오류:', error);
//         reconnectTimeout = setTimeout(connectSSE, 3000);
//       }
//     };

//     connectSSE();

//     return () => {
//       if (eventSource) {
//         eventSource.close();
//       }
//       if (reconnectTimeout) {
//         clearTimeout(reconnectTimeout);
//       }
//     };
//   }, [url]);

//   // 컴포넌트 언마운트 시 정리
//   useEffect(() => {
//     return () => {
//       Object.values(pollingIntervals).forEach(interval => {
//         if (interval) clearInterval(interval);
//       });
//     };
//   }, [pollingIntervals]);

//   return (
//     <>
//       <PageLayout 
//         title="프레스 공정 모니터링"
//         description={`유압 펌프 고장 탐지 수신 ${isPolling ? '양호 🟢' : '대기 중 ⚪'} | 프레스 생산품 결함 탐지 수신 ${isPolling ? '양호 🟢' : '대기 중 ⚪'}`}
//         footerTitle="프레스 생산품 결함 실시간 현황"
//         footerDescription="프레스 생산품별 불량률 및 생산 효율성 모니터링"
//         showFooter={true}
//       >
//         <EquipmentList  
//           title="유압펌프 및 생산품 상태 목록"
//           equipmentData={pressEquipmentData}
//           //defaultImage="/pressmachine.png"
//           showConnectionStatus={false}
//         />
//       <PressFaultChartDashboard 
//           currentStatus={currentStatus}
//           reconstructionErrorData={reconstructionErrorData}
//         />
//       </PageLayout>
//       <ChatBot />
//     </>
//   );
// };

import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';
import PressFaultChartDashboard from '../../components/charts/ProcessChart/PressFaultChartDashboard';
import PressChartsDashboard from '../../components/charts/ProcessChart/PressChartsDashboard';
import styled from 'styled-components';

const StyledChartTitle = styled.h3`
  font-size: 32px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #111827;
  text-align: center; // 중앙 정렬 추가
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
            lastInspection: null,
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
            lastInspection: null,
            image: "/pressproduct.png"
        }
    ]);

    // 재구성 오차 차트 데이터 (설비 고장 탐지용)
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

    // 현재 상태 (설비 고장 탐지용)
    const [currentStatus, setCurrentStatus] = useState({
        isFault: false,
        reconstructionError: 0.002
    });

    // 생산품 결함 탐지 상태 관리
    const [defectDetectionStatus, setDefectDetectionStatus] = useState({
        isConnected: false,
        lastUpdate: null,
        totalInspections: 0,
        totalDefects: 0,
        goodProducts: 0
    });

    // 차트용 생산 통계 상태
    // ID 1, 2는 각각 검사 라인 1, 2를 나타냅니다.
    const [pressStats, setPressStats] = useState({
        1: { totalProducts: 0, totalDefects: 0 },
        2: { totalProducts: 0, totalDefects: 0 },
        // 총합 계산을 위한 전체 통계
        0: { totalProducts: 0, totalDefects: 0 }
    });

    // 🆕 마지막으로 처리된 inspectionId를 저장하는 ref
    const lastProcessedIdRef = useRef(null);

    // 웹소켓 연결 상태
    const [wsConnection, setWsConnection] = useState({
        isConnected: false,
        reconnectCount: 0
    });

    const wsRef = useRef(null);

    // 페이지 시작 시 차트 데이터의 최신 값으로 currentStatus 업데이트
    useEffect(() => {
        if (reconstructionErrorData.length > 0) {
            const latestData = reconstructionErrorData[reconstructionErrorData.length - 1];
            setCurrentStatus(prev => ({
                ...prev,
                reconstructionError: latestData.reconstructionError
            }));
        }
    }, []);

    // 웹소켓 연결 및 생산품 결함 탐지 데이터 수신
    useEffect(() => {
        const connectWebSocket = () => {
            const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://localhost:8088';
            const wsUrl = baseUrl.replace('https', 'wss').replace('http', 'ws') + '/ws/monitoring';

            console.log('WebSocket 연결 시도:', wsUrl);
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('WebSocket 연결 성공');
                setWsConnection({ isConnected: true, reconnectCount: 0 });
                setDefectDetectionStatus(prev => ({ ...prev, isConnected: true }));
            };

            wsRef.current.onmessage = (event) => {
                console.log('WebSocket 메시지 수신:', event.data);
                const data = JSON.parse(event.data);

                if (data.type === "PRESS_DEFECT_MONITORING") {
                    const {
                        inspectionId,
                        isDefective,
                        qualityStatus,
                        totalProducts,
                        totalDefects
                    } = data;

                    // 🆕 이미 처리된 메시지인지 확인하고 중복 메시지면 무시
                    if (lastProcessedIdRef.current === inspectionId) {
                        console.log(`- 중복 메시지 무시: ${inspectionId}`);
                        return;
                    }
                    lastProcessedIdRef.current = inspectionId;

                    // 🚨 중요: totalProducts와 totalDefects가 유효한지 확인합니다.
                    if (totalProducts === undefined || totalDefects === undefined) {
                        console.error('WebSocket 메시지에 totalProducts 또는 totalDefects 값이 없습니다.');
                        return;
                    }

                    // 🛠️ 수정된 부분: 모든 데이터를 검사 라인 1에 매핑합니다.
                    const chartPressId = 1;

                    // 프론트엔드 EquipmentList의 ID에 맞게 매핑
                    //const equipmentId = chartPressId + 2;
                    const equipmentId = 3; // 검사 라인 1

                    // 전체 통계 업데이트
                    setDefectDetectionStatus(prev => ({
                        ...prev,
                        totalInspections: totalProducts,
                        totalDefects: totalDefects,
                        goodProducts: totalProducts - totalDefects,
                        lastUpdate: new Date()
                    }));

                    // pressStats 데이터 업데이트 (차트용)
                    setPressStats(prevStats => {
                        const updatedStats = { ...prevStats };

                        updatedStats[chartPressId] = {
                            totalProducts: totalProducts,
                            totalDefects: totalDefects
                        };

                        // 전체 합산 통계 업데이트 (ID 0)
                        const overallTotalProducts = (updatedStats[1]?.totalProducts || 0) + (updatedStats[2]?.totalProducts || 0);
                        const overallTotalDefects = (updatedStats[1]?.totalDefects || 0) + (updatedStats[2]?.totalDefects || 0);

                        updatedStats[0] = {
                            totalProducts: overallTotalProducts,
                            totalDefects: overallTotalDefects
                        };

                        return updatedStats;
                    });

                    // 장비 목록 상태 업데이트
                    setPressEquipmentData(prevData => {
                        return prevData.map(item => {
                            if (item.id === equipmentId) { // id 3 (검사 라인 1)
                                return {
                                    ...item,
                                    status: isDefective ? "결함 감지" : "정상",
                                    operatingStatus: isDefective ? "검토 필요" : "검사 중",
                                    defectRate: totalProducts > 0 ? 
                                        ((totalDefects / totalProducts) * 100).toFixed(1) + "%" : "0.0%",
                                    lastInspection: {
                                        id: inspectionId,
                                        result: qualityStatus,
                                        timestamp: new Date().toLocaleTimeString()
                                    }
                                };
                            }
                            return item;
                        });
                    });
                }
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket 연결 종료');
                setWsConnection(prev => ({ ...prev, isConnected: false }));
            };
        };

        connectWebSocket();
    }, []);

    // 폴링 상태 관리
    const [isPolling, setIsPolling] = useState(false);
    const [pollingIntervals, setPollingIntervals] = useState({});

    // 기존 SSE 연결 (설비 고장 탐지용) - 그대로 유지
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

                        setCurrentStatus(prev => ({
                            ...prev,
                            isFault: isFault
                        }));

                        const now = new Date();
                        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                        setReconstructionErrorData(prevData => {
                            const newData = [
                                ...prevData.slice(-19),
                                {
                                    time: timeString,
                                    timestamp: now.getTime(),
                                    reconstructionError: parseFloat((reconstructionError || 0).toFixed(4)),
                                    faultProbability: parseFloat((faultProbability || 0).toFixed(4)),
                                    isFault: isFault
                                }
                            ];

                            const latestData = newData[newData.length - 1];
                            setCurrentStatus(prev => ({
                                ...prev,
                                reconstructionError: latestData.reconstructionError
                            }));

                            return newData;
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
    }, [url]);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            Object.values(pollingIntervals).forEach(interval => {
                if (interval) clearInterval(interval);
            });
        };
    }, [pollingIntervals]);

    // 연결 상태 표시용 함수
    const getConnectionStatusText = () => {
        const equipmentStatus = isPolling ? '양호 🟢' : '대기 중 ⚪';
        const defectStatus = defectDetectionStatus.isConnected ? '양호 🟢' : '대기 중 ⚪';
        return `유압 펌프 고장 탐지 수신 ${equipmentStatus} | 프레스 생산품 결함 탐지 수신 ${defectStatus}`;
    };

    return (
        <>
            <PageLayout
                title="프레스 공정 모니터링"
                description={getConnectionStatusText()}
                // footerTitle과 footerDescription을 제거합니다.
                // showFooter도 false로 변경하거나 제거할 수 있습니다.
            >
                <EquipmentList 
                    title="유압펌프 및 생산품 상태 목록"
                    equipmentData={pressEquipmentData}
                    showConnectionStatus={false}
                />
                <PressFaultChartDashboard 
                    currentStatus={currentStatus}
                    reconstructionErrorData={reconstructionErrorData}
                />
                
                {/* 텍스트를 차트 컴포넌트 위에 직접 배치합니다 */}
                <StyledChartTitle>프레스 생산품 결함 실시간 현황</StyledChartTitle>
                <PressChartsDashboard pressStats={pressStats} />
            </PageLayout>
            <ChatBot />
        </>
    );
};