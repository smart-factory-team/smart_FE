// // import React, { useState, useEffect, useRef } from 'react';
// // import { PageLayout } from '../../components/layout';
// // import { EquipmentList } from '../../components/ui/EquipmentList';
// // import { ChatBot } from '../../components/ui/ChatBot';
// // import PressFaultChartDashboard from '../../components/charts/ProcessChart/PressFaultChartDashboard';
// // import styled from 'styled-components';

// // export const PressMonitoring = () => {
// //   const url = process.env.REACT_APP_API_BASE_URL;
  
// //   // 통합된 장비 데이터 (프레스 + 검사 라인)
// //   const [pressEquipmentData, setPressEquipmentData] = useState([
// //     {
// //       id: 1,
// //       name: "프레스 1",
// //       title: "유압펌프 고장 탐지",
// //       status: "정상",
// //       isOperating: true,
// //       manager: "관리자",
// //       operatingStatus: "가동 중",
// //       image: "/pressmachine.png"
// //     },
// //     {
// //       id: 2,
// //       name: "프레스 2", 
// //       title: "유압펌프 고장 탐지",
// //       status: "정상",
// //       isOperating: true,
// //       manager: "관리자",
// //       operatingStatus: "가동 중",
// //       image: "/pressmachine.png"
// //     },
// //     {
// //       id: 3,
// //       name: "검사 라인 1",
// //       title: "프레스 패널 결함 탐지",
// //       status: "정상",
// //       isOperating: true,
// //       manager: "관리자",
// //       operatingStatus: "검사 중",
// //       productType: "제품 A",
// //       defectRate: "0.2%",
// //       image: "/pressproduct.png"
// //     },
// //     {
// //       id: 4,
// //       name: "검사 라인 2",
// //       title: "프레스 패널 결함 탐지",
// //       status: "정상",
// //       isOperating: true,
// //       manager: "관리자",
// //       operatingStatus: "검사 중",
// //       productType: "제품 B",
// //       defectRate: "0.4%",
// //       image: "/pressproduct.png"
// //     }
// //   ]);

// //   // 재구성 오차 차트 데이터
// //   const [reconstructionErrorData, setReconstructionErrorData] = useState(() => {
// //     const now = new Date();
// //     return Array.from({ length: 10 }, (_, i) => {
// //       const time = new Date(now.getTime() - (9 - i) * 60000);
// //       return {
// //         time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
// //         timestamp: time.getTime(),
// //         reconstructionError: 0.001 + Math.random() * 0.001,
// //         faultProbability: Math.random() * 0.3,
// //         isFault: false
// //       };
// //     });
// //   });
  
// //   // 현재 상태
// //   const [currentStatus, setCurrentStatus] = useState({
// //     isFault: false,
// //     reconstructionError: 0.002
// //   });

// //   // 페이지 시작 시 차트 데이터의 최신 값으로 currentStatus 업데이트
// //   useEffect(() => {
// //     if (reconstructionErrorData.length > 0) {
// //       const latestData = reconstructionErrorData[reconstructionErrorData.length - 1];
// //       setCurrentStatus(prev => ({
// //         ...prev,
// //         reconstructionError: latestData.reconstructionError
// //       }));
// //     }
// //   }, []);

// //   // 검사 라인별 통계 데이터 (ID 3, 4만 사용)
// //   const initialPressStats = {
// //     0: { totalProducts: 0, totalDefects: 0, goodProducts: 0 }, // 총계
// //     3: { totalProducts: 0, totalDefects: 0, newProducts: 0 }, // 검사 라인 1
// //     4: { totalProducts: 0, totalDefects: 0, newProducts: 0 }  // 검사 라인 2
// //   };

// //   // 폴링 상태 관리
// //   const [isPolling, setIsPolling] = useState(false);
// //   const [pollingIntervals, setPollingIntervals] = useState({});

// //   useEffect(() => {
// //     let eventSource = null;
// //     let reconnectTimeout = null;
    
// //     const connectSSE = () => {
// //       try {
// //         console.log('SSE 연결 시도 중...');
// //         eventSource = new EventSource(`${url}/pressFaultDetectionLogs/status/stream`);
        
// //         setTimeout(() => {
// //           if (eventSource && eventSource.readyState === 0) {
// //             console.log('현재 readyState:', eventSource.readyState);
// //           }
// //         }, 5000);
        
// //         eventSource.onopen = () => {
// //           console.log('SSE 연결 성공');
// //         };
        
// //         eventSource.addEventListener('faultStatus', (event) => {
// //           try {
// //             console.log('faultStatus 이벤트 수신:', event.data);
// //             const data = JSON.parse(event.data);
// //             console.log('faultStatus 파싱된 데이터:', data);
// //             const { isFault, prediction, reconstructionError, faultProbability } = data;
            
// //             // 장비 목록 상태 업데이트
// //             setPressEquipmentData(prevData => {
// //               const updatedData = prevData.map(press => 
// //                 press.id === 1 ? {
// //                   ...press,
// //                   status: isFault ? "고장" : "정상",
// //                   operatingStatus: isFault ? "점검 필요" : "가동 중",
// //                   isOperating: !isFault,
// //                   reconstructionError: reconstructionError ? reconstructionError.toFixed(4) : "0.0000"
// //                 } : press
// //               );
// //               console.log('faultStatus 업데이트된 데이터:', updatedData);
// //               return updatedData;
// //             });

// //             // 현재 상태의 isFault만 업데이트 (reconstructionError는 차트 데이터 업데이트 시 처리)
// //             setCurrentStatus(prev => ({
// //               ...prev,
// //               isFault: isFault
// //             }));

// //             // 차트 데이터 업데이트
// //             const now = new Date();
// //             const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
// //             setReconstructionErrorData(prevData => {
// //               const newData = [
// //                 ...prevData.slice(-19), // 최근 20개 데이터만 유지
// //                 {
// //                   time: timeString,
// //                   timestamp: now.getTime(),
// //                   reconstructionError: parseFloat((reconstructionError || 0).toFixed(4)),
// //                   faultProbability: parseFloat((faultProbability || 0).toFixed(4)),
// //                   isFault: isFault
// //                 }
// //               ];
              
// //               // 가장 최근 데이터의 reconstructionError로 currentStatus 업데이트
// //               const latestData = newData[newData.length - 1];
// //               setCurrentStatus(prev => ({
// //                 ...prev,
// //                 reconstructionError: latestData.reconstructionError
// //               }));
              
// //               return newData;
// //             });
            
// //           } catch (error) {
// //             console.error('faultStatus 데이터 파싱 오류:', error);
// //           }
// //         });

// //         eventSource.onerror = (error) => {
// //           console.error('SSE 연결 오류:', error);
// //           console.log('EventSource readyState:', eventSource.readyState);
// //           eventSource.close();
          
// //           reconnectTimeout = setTimeout(() => {
// //             console.log('SSE 재연결 시도...');
// //             connectSSE();
// //           }, 3000);
// //         };
// //       } catch (error) {
// //         console.error('SSE 초기화 오류:', error);
// //         reconnectTimeout = setTimeout(connectSSE, 3000);
// //       }
// //     };

// //     connectSSE();

// //     return () => {
// //       if (eventSource) {
// //         eventSource.close();
// //       }
// //       if (reconnectTimeout) {
// //         clearTimeout(reconnectTimeout);
// //       }
// //     };
// //   }, [url]);

// //   // 컴포넌트 언마운트 시 정리
// //   useEffect(() => {
// //     return () => {
// //       Object.values(pollingIntervals).forEach(interval => {
// //         if (interval) clearInterval(interval);
// //       });
// //     };
// //   }, [pollingIntervals]);

// //   return (
// //     <>
// //       <PageLayout 
// //         title="프레스 공정 모니터링"
// //         description={`유압 펌프 고장 탐지 수신 ${isPolling ? '양호 🟢' : '대기 중 ⚪'} | 프레스 생산품 결함 탐지 수신 ${isPolling ? '양호 🟢' : '대기 중 ⚪'}`}
// //         footerTitle="프레스 생산품 결함 실시간 현황"
// //         footerDescription="프레스 생산품별 불량률 및 생산 효율성 모니터링"
// //         showFooter={true}
// //       >
// //         <EquipmentList  
// //           title="유압펌프 및 생산품 상태 목록"
// //           equipmentData={pressEquipmentData}
// //           //defaultImage="/pressmachine.png"
// //           showConnectionStatus={false}
// //         />
// //       <PressFaultChartDashboard 
// //           currentStatus={currentStatus}
// //           reconstructionErrorData={reconstructionErrorData}
// //         />
// //       </PageLayout>
// //       <ChatBot />
// //     </>
// //   );
// // };

// import React, { useState, useEffect, useRef } from 'react';
// import { PageLayout } from '../../components/layout';
// import { EquipmentList } from '../../components/ui/EquipmentList';
// import { ChatBot } from '../../components/ui/ChatBot';
// import PressFaultChartDashboard from '../../components/charts/ProcessChart/PressFaultChartDashboard';
// import PressChartsDashboard from '../../components/charts/ProcessChart/PressChartsDashboard';
// import styled from 'styled-components';

// const StyledChartTitle = styled.h3`
//   font-size: 32px;
//   font-weight: 600;
//   margin-top: 20px;
//   margin-bottom: 10px;
//   color: #111827;
//   text-align: center; // 중앙 정렬 추가
// `;

// export const PressMonitoring = () => {
//     const url = process.env.REACT_APP_API_BASE_URL;

//     // 통합된 장비 데이터 (프레스 + 검사 라인)
//     const [pressEquipmentData, setPressEquipmentData] = useState([
//         {
//             id: 1,
//             name: "프레스 1",
//             title: "유압펌프 고장 탐지",
//             status: "정상",
//             isOperating: true,
//             manager: "관리자",
//             operatingStatus: "가동 중",
//             image: "/pressmachine.png"
//         },
//         {
//             id: 2,
//             name: "프레스 2",
//             title: "유압펌프 고장 탐지",
//             status: "정상",
//             isOperating: true,
//             manager: "관리자",
//             operatingStatus: "가동 중",
//             image: "/pressmachine.png"
//         },
//         {
//             id: 3,
//             name: "검사 라인 1",
//             title: "프레스 패널 결함 탐지",
//             status: "정상",
//             isOperating: true,
//             manager: "관리자",
//             operatingStatus: "검사 중",
//             productType: "제품 A",
//             defectRate: "0.2%",
//             lastInspection: null,
//             image: "/pressproduct.png"
//         },
//         {
//             id: 4,
//             name: "검사 라인 2",
//             title: "프레스 패널 결함 탐지",
//             status: "정상",
//             isOperating: true,
//             manager: "관리자",
//             operatingStatus: "검사 중",
//             productType: "제품 B",
//             defectRate: "0.4%",
//             lastInspection: null,
//             image: "/pressproduct.png"
//         }
//     ]);

//     // 재구성 오차 차트 데이터 (설비 고장 탐지용)
//     const [reconstructionErrorData, setReconstructionErrorData] = useState(() => {
//         const now = new Date();
//         return Array.from({ length: 10 }, (_, i) => {
//             const time = new Date(now.getTime() - (9 - i) * 60000);
//             return {
//                 time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
//                 timestamp: time.getTime(),
//                 reconstructionError: 0.001 + Math.random() * 0.001,
//                 faultProbability: Math.random() * 0.3,
//                 isFault: false
//             };
//         });
//     });

//     // 현재 상태 (설비 고장 탐지용)
//     const [currentStatus, setCurrentStatus] = useState({
//         isFault: false,
//         reconstructionError: 0.002
//     });

//     // 생산품 결함 탐지 상태 관리
//     const [defectDetectionStatus, setDefectDetectionStatus] = useState({
//         isConnected: false,
//         lastUpdate: null,
//         totalInspections: 0,
//         totalDefects: 0,
//         goodProducts: 0
//     });

//     // 차트용 생산 통계 상태
//     // ID 1, 2는 각각 검사 라인 1, 2를 나타냅니다.
//     const [pressStats, setPressStats] = useState({
//         1: { totalProducts: 0, totalDefects: 0 },
//         2: { totalProducts: 0, totalDefects: 0 },
//         // 총합 계산을 위한 전체 통계
//         0: { totalProducts: 0, totalDefects: 0 }
//     });

//     // 🆕 마지막으로 처리된 inspectionId를 저장하는 ref
//     const lastProcessedIdRef = useRef(null);

//     // 웹소켓 연결 상태
//     const [wsConnection, setWsConnection] = useState({
//         isConnected: false,
//         reconnectCount: 0
//     });

//     const wsRef = useRef(null);

//     // 페이지 시작 시 차트 데이터의 최신 값으로 currentStatus 업데이트
//     useEffect(() => {
//         if (reconstructionErrorData.length > 0) {
//             const latestData = reconstructionErrorData[reconstructionErrorData.length - 1];
//             setCurrentStatus(prev => ({
//                 ...prev,
//                 reconstructionError: latestData.reconstructionError
//             }));
//         }
//     }, []);

//     // 웹소켓 연결 및 생산품 결함 탐지 데이터 수신
//     useEffect(() => {
//         const connectWebSocket = () => {
//             const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://localhost:8088';
//             const wsUrl = baseUrl.replace('https', 'wss').replace('http', 'ws') + '/ws/monitoring';

//             console.log('WebSocket 연결 시도:', wsUrl);
//             wsRef.current = new WebSocket(wsUrl);

//             wsRef.current.onopen = () => {
//                 console.log('WebSocket 연결 성공');
//                 setWsConnection({ isConnected: true, reconnectCount: 0 });
//                 setDefectDetectionStatus(prev => ({ ...prev, isConnected: true }));
//             };

//             wsRef.current.onmessage = (event) => {
//                 console.log('WebSocket 메시지 수신:', event.data);
//                 const data = JSON.parse(event.data);

//                 if (data.type === "PRESS_DEFECT_MONITORING") {
//                     const {
//                         inspectionId,
//                         isDefective,
//                         qualityStatus,
//                         totalProducts,
//                         totalDefects
//                     } = data;

//                     // 🆕 이미 처리된 메시지인지 확인하고 중복 메시지면 무시
//                     if (lastProcessedIdRef.current === inspectionId) {
//                         console.log(`- 중복 메시지 무시: ${inspectionId}`);
//                         return;
//                     }
//                     lastProcessedIdRef.current = inspectionId;

//                     // 🚨 중요: totalProducts와 totalDefects가 유효한지 확인합니다.
//                     if (totalProducts === undefined || totalDefects === undefined) {
//                         console.error('WebSocket 메시지에 totalProducts 또는 totalDefects 값이 없습니다.');
//                         return;
//                     }

//                     // 🛠️ 수정된 부분: 모든 데이터를 검사 라인 1에 매핑합니다.
//                     const chartPressId = 1;

//                     // 프론트엔드 EquipmentList의 ID에 맞게 매핑
//                     //const equipmentId = chartPressId + 2;
//                     const equipmentId = 3; // 검사 라인 1

//                     // 전체 통계 업데이트
//                     setDefectDetectionStatus(prev => ({
//                         ...prev,
//                         totalInspections: totalProducts,
//                         totalDefects: totalDefects,
//                         goodProducts: totalProducts - totalDefects,
//                         lastUpdate: new Date()
//                     }));

//                     // pressStats 데이터 업데이트 (차트용)
//                     setPressStats(prevStats => {
//                         const updatedStats = { ...prevStats };

//                         updatedStats[chartPressId] = {
//                             totalProducts: totalProducts,
//                             totalDefects: totalDefects
//                         };

//                         // 전체 합산 통계 업데이트 (ID 0)
//                         const overallTotalProducts = (updatedStats[1]?.totalProducts || 0) + (updatedStats[2]?.totalProducts || 0);
//                         const overallTotalDefects = (updatedStats[1]?.totalDefects || 0) + (updatedStats[2]?.totalDefects || 0);

//                         updatedStats[0] = {
//                             totalProducts: overallTotalProducts,
//                             totalDefects: overallTotalDefects
//                         };

//                         return updatedStats;
//                     });

//                     // 장비 목록 상태 업데이트
//                     setPressEquipmentData(prevData => {
//                         return prevData.map(item => {
//                             if (item.id === equipmentId) { // id 3 (검사 라인 1)
//                                 return {
//                                     ...item,
//                                     status: isDefective ? "결함 감지" : "정상",
//                                     operatingStatus: isDefective ? "검토 필요" : "검사 중",
//                                     defectRate: totalProducts > 0 ? 
//                                         ((totalDefects / totalProducts) * 100).toFixed(1) + "%" : "0.0%",
//                                     lastInspection: {
//                                         id: inspectionId,
//                                         result: qualityStatus,
//                                         timestamp: new Date().toLocaleTimeString()
//                                     }
//                                 };
//                             }
//                             return item;
//                         });
//                     });
//                 }
//             };

//             wsRef.current.onclose = () => {
//                 console.log('WebSocket 연결 종료');
//                 setWsConnection(prev => ({ ...prev, isConnected: false }));
//             };
//         };

//         connectWebSocket();
//     }, []);

//     // 폴링 상태 관리
//     const [isPolling, setIsPolling] = useState(false);
//     const [pollingIntervals, setPollingIntervals] = useState({});

//     // 기존 SSE 연결 (설비 고장 탐지용) - 그대로 유지
//     useEffect(() => {
//         let eventSource = null;
//         let reconnectTimeout = null;

//         const connectSSE = () => {
//             try {
//                 console.log('SSE 연결 시도 중...');
//                 eventSource = new EventSource(`${url}/pressFaultDetectionLogs/status/stream`);

//                 setTimeout(() => {
//                     if (eventSource && eventSource.readyState === 0) {
//                         console.log('현재 readyState:', eventSource.readyState);
//                     }
//                 }, 5000);

//                 eventSource.onopen = () => {
//                     console.log('SSE 연결 성공');
//                 };

//                 eventSource.addEventListener('faultStatus', (event) => {
//                     try {
//                         console.log('faultStatus 이벤트 수신:', event.data);
//                         const data = JSON.parse(event.data);
//                         console.log('faultStatus 파싱된 데이터:', data);
//                         const { isFault, prediction, reconstructionError, faultProbability } = data;

//                         setPressEquipmentData(prevData => {
//                             const updatedData = prevData.map(press =>
//                                 press.id === 1 ? {
//                                     ...press,
//                                     status: isFault ? "고장" : "정상",
//                                     operatingStatus: isFault ? "점검 필요" : "가동 중",
//                                     isOperating: !isFault,
//                                     reconstructionError: reconstructionError ? reconstructionError.toFixed(4) : "0.0000"
//                                 } : press
//                             );
//                             console.log('faultStatus 업데이트된 데이터:', updatedData);
//                             return updatedData;
//                         });

//                         setCurrentStatus(prev => ({
//                             ...prev,
//                             isFault: isFault
//                         }));

//                         const now = new Date();
//                         const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

//                         setReconstructionErrorData(prevData => {
//                             const newData = [
//                                 ...prevData.slice(-19),
//                                 {
//                                     time: timeString,
//                                     timestamp: now.getTime(),
//                                     reconstructionError: parseFloat((reconstructionError || 0).toFixed(4)),
//                                     faultProbability: parseFloat((faultProbability || 0).toFixed(4)),
//                                     isFault: isFault
//                                 }
//                             ];

//                             const latestData = newData[newData.length - 1];
//                             setCurrentStatus(prev => ({
//                                 ...prev,
//                                 reconstructionError: latestData.reconstructionError
//                             }));

//                             return newData;
//                         });

//                     } catch (error) {
//                         console.error('faultStatus 데이터 파싱 오류:', error);
//                     }
//                 });

//                 eventSource.onerror = (error) => {
//                     console.error('SSE 연결 오류:', error);
//                     console.log('EventSource readyState:', eventSource.readyState);
//                     eventSource.close();

//                     reconnectTimeout = setTimeout(() => {
//                         console.log('SSE 재연결 시도...');
//                         connectSSE();
//                     }, 3000);
//                 };
//             } catch (error) {
//                 console.error('SSE 초기화 오류:', error);
//                 reconnectTimeout = setTimeout(connectSSE, 3000);
//             }
//         };

//         connectSSE();

//         return () => {
//             if (eventSource) {
//                 eventSource.close();
//             }
//             if (reconnectTimeout) {
//                 clearTimeout(reconnectTimeout);
//             }
//         };
//     }, [url]);

//     // 컴포넌트 언마운트 시 정리
//     useEffect(() => {
//         return () => {
//             Object.values(pollingIntervals).forEach(interval => {
//                 if (interval) clearInterval(interval);
//             });
//         };
//     }, [pollingIntervals]);

//     // 연결 상태 표시용 함수
//     const getConnectionStatusText = () => {
//         const equipmentStatus = isPolling ? '양호 🟢' : '대기 중 ⚪';
//         const defectStatus = defectDetectionStatus.isConnected ? '양호 🟢' : '대기 중 ⚪';
//         return `유압 펌프 고장 탐지 수신 ${equipmentStatus} | 프레스 생산품 결함 탐지 수신 ${defectStatus}`;
//     };

//     return (
//         <>
//             <PageLayout
//                 title="프레스 공정 모니터링"
//                 description={getConnectionStatusText()}
//                 // footerTitle과 footerDescription을 제거합니다.
//                 // showFooter도 false로 변경하거나 제거할 수 있습니다.
//             >
//                 <EquipmentList 
//                     title="유압펌프 및 생산품 상태 목록"
//                     equipmentData={pressEquipmentData}
//                     showConnectionStatus={false}
//                 />
//                 <PressFaultChartDashboard 
//                     currentStatus={currentStatus}
//                     reconstructionErrorData={reconstructionErrorData}
//                 />
                
//                 {/* 텍스트를 차트 컴포넌트 위에 직접 배치합니다 */}
//                 <StyledChartTitle>프레스 생산품 결함 실시간 현황</StyledChartTitle>
//                 <PressChartsDashboard pressStats={pressStats} />
//             </PageLayout>
//             <ChatBot />
//         </>
//     );
// };

import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../../components/layout';
import { EquipmentList } from '../../components/ui/EquipmentList';
import { ChatBot } from '../../components/ui/ChatBot';
import PressFaultChartDashboard from '../../components/charts/ProcessChart/PressFaultChartDashboard';
import PressChartsDashboard from '../../components/charts/ProcessChart/PressChartsDashboard';
import styled from 'styled-components';

// "프레스 생산품 결함 실시간 현황" 제목 스타일 컴포넌트
const StyledChartTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
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
            image: "data:image/jpeg;base64,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"
        },
        {
            id: 2,
            name: "프레스 2",
            title: "유압펌프 고장 탐지",
            status: "정상",
            isOperating: true,
            manager: "관리자",
            operatingStatus: "가동 중",
            image: "data:image/jpeg;base64,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"
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
            image: "data:image/jpeg;base64,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"
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
            image: "data:image/jpeg;base64,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"
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
                footerDescription={`총 검사: ${defectDetectionStatus.totalInspections}건 | 정상품: ${defectDetectionStatus.goodProducts}건 | 결함품: ${defectDetectionStatus.totalDefects}건 | 불량률: ${defectDetectionStatus.totalInspections > 0 ? ((defectDetectionStatus.totalDefects / defectDetectionStatus.totalInspections) * 100).toFixed(1) : 0}%`}
                showFooter={true}
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
                <StyledChartTitle>프레스 생산품 결함 실시간 현황</StyledChartTitle>
                <PressChartsDashboard pressStats={pressStats} />
            </PageLayout>
            <ChatBot />
        </>
    );
};