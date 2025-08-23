// src/hooks/usePaintingSurfaceDefect.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { paintingSurfaceDefectAPI } from '../api/paintingSurfaceDefect';

export const usePaintingSurfaceDefect = () => {
  const [defectResults, setDefectResults] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [machineStatistics, setMachineStatistics] = useState({
    machines: [],
    totalMachines: 0,
    lastUpdated: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelServiceHealth, setModelServiceHealth] = useState('unknown');
  const [simulatorStatus, setSimulatorStatus] = useState({});
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [azureStorageStatus, setAzureStorageStatus] = useState('unknown');
  const [updateNotification, setUpdateNotification] = useState(null);
  
  const intervalRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  // 업데이트 알림 표시 함수
  const showUpdateNotification = useCallback((type, message) => {
    setUpdateNotification({ type, message, timestamp: Date.now() });
    
    // 3초 후 알림 자동 제거
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setUpdateNotification(null);
    }, 3000);
  }, []);

  // 초기 데이터 로드 (도장표면결함탐지만)
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 병렬로 여러 API 호출 (도장표면결함탐지만)
      const [defectStats, modelHealth, simStatus, azureTest, modelTest] = await Promise.allSettled([
        paintingSurfaceDefectAPI.getDefectStatistics(),
        paintingSurfaceDefectAPI.checkModelServiceHealth(),
        paintingSurfaceDefectAPI.getSimulatorStatus(),
        paintingSurfaceDefectAPI.testAzureStorageConnection(),
        paintingSurfaceDefectAPI.testModelServiceConnection()
      ]);

      // 결함 통계 설정
      if (defectStats.status === 'fulfilled') {
        setStatistics(defectStats.value);
      }

      // 모델 서비스 헬스 설정
      if (modelHealth.status === 'fulfilled') {
        setModelServiceHealth(modelHealth.value.status);
      }

      // 시뮬레이터 상태 설정
      if (simStatus.status === 'fulfilled') {
        setSimulatorStatus(simStatus.value);
        setIsSimulatorRunning(simStatus.value.is_running);
      }

      // Azure Storage 상태 설정
      if (azureTest.status === 'fulfilled') {
        setAzureStorageStatus(azureTest.value.status === 'success' ? 'connected' : 'disconnected');
      }

    } catch (err) {
      setError(err.message);
      console.error('도장표면결함탐지 초기 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 실시간 결함 탐지 결과 업데이트 (도장표면결함탐지만)
  const updateDefectResults = useCallback(async () => {
    try {
      const results = await paintingSurfaceDefectAPI.getDefectDetectionResults({
        limit: 10,
        sort: 'timestamp,desc'
      });
      
                    // 변화가 있을 때만 상태 업데이트 (불필요한 리렌더링 방지)
              setDefectResults(prevResults => {
                if (JSON.stringify(prevResults) !== JSON.stringify(results)) {
                  console.log('🔄 결함 탐지 결과 업데이트:', results.length + '개');
                  
                  // 새로운 결함이 감지된 경우 알림 표시
                  if (results.length > prevResults.length) {
                    const newDefects = results.length - prevResults.length;
                    showUpdateNotification('defect', `🚨 새로운 결함 ${newDefects}개 감지됨!`);
                  } else if (results.length !== prevResults.length) {
                    showUpdateNotification('update', '📊 결함 데이터 업데이트됨');
                  }
                  
                  return results;
                }
                return prevResults;
              });
    } catch (err) {
      console.error('도장표면결함탐지 결과 업데이트 실패:', err);
    }
  }, []);

  // 시뮬레이터 시작
  const startSimulator = useCallback(async () => {
    try {
      const result = await paintingSurfaceDefectAPI.startSimulator();
      setIsSimulatorRunning(true);
      setSimulatorStatus(prev => ({ ...prev, is_running: true }));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // 시뮬레이터 중지
  const stopSimulator = useCallback(async () => {
    try {
      const result = await paintingSurfaceDefectAPI.stopSimulator();
      setIsSimulatorRunning(false);
      setSimulatorStatus(prev => ({ ...prev, is_running: false }));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // 실시간 데이터 폴링 시작
  const startRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 2초마다 데이터 업데이트 (빠른 실시간 업데이트)
    intervalRef.current = setInterval(async () => {
      try {
        // 결함 탐지 결과 업데이트
        await updateDefectResults();
        
        // 통계 업데이트 (실시간 누적 통계)
        const stats = await paintingSurfaceDefectAPI.getDefectStatistics();
        
        // 변화가 있을 때만 상태 업데이트 (불필요한 리렌더링 방지)
        setStatistics(prevStats => {
          if (JSON.stringify(prevStats) !== JSON.stringify(stats)) {
            // 전체 통계 변경 시 알림
            if (stats.defectCount > (prevStats.defectCount || 0)) {
              const newDefects = stats.defectCount - (prevStats.defectCount || 0);
              showUpdateNotification('stats', `📈 총 결함 수 증가: +${newDefects}개`);
            }
            return stats;
          }
          return prevStats;
        });
        
        // 기계별 통계 업데이트 (매번 업데이트)
        const machineStats = await paintingSurfaceDefectAPI.getMachineStatistics();
        setMachineStatistics(prevMachineStats => {
          if (JSON.stringify(prevMachineStats) !== JSON.stringify(machineStats)) {
            console.log('🏭 기계별 통계 업데이트:', machineStats.machines?.length || 0 + '개 기계');
            
            // 기계별 통계 변경 시 알림
            const prevTotalMachineDefects = prevMachineStats.machines?.reduce((sum, m) => sum + (m.totalDefects || 0), 0) || 0;
            const currentTotalMachineDefects = machineStats.machines?.reduce((sum, m) => sum + (m.totalDefects || 0), 0) || 0;
            
            if (currentTotalMachineDefects > prevTotalMachineDefects) {
              showUpdateNotification('machine', '🏭 기계별 결함 현황 업데이트됨');
            }
            
            return machineStats;
          }
          return prevMachineStats;
        });
        
        // 시뮬레이터 상태 업데이트 (5번에 1번만 - 10초마다)
        if (Date.now() % 10000 < 2000) {
          const status = await paintingSurfaceDefectAPI.getSimulatorStatus();
          setSimulatorStatus(status);
          setIsSimulatorRunning(status.is_running);
        }
        
      } catch (err) {
        console.error('실시간 업데이트 실패:', err);
      }
    }, 2000); // 2초 간격으로 변경
  }, [updateDefectResults]);

  // 실시간 데이터 폴링 중지
  const stopRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    loadInitialData();
    startRealTimeUpdates();

    return () => {
      stopRealTimeUpdates();
    };
  }, [loadInitialData, startRealTimeUpdates, stopRealTimeUpdates]);

  return {
    // 상태 (도장표면결함탐지만)
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
    
    // 액션 (도장표면결함탐지만)
    loadInitialData,
    updateDefectResults,
    startSimulator,
    stopSimulator,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    
    // 유틸리티 (도장표면결함탐지만)
    hasDefects: defectResults.some(result => result.status === 'defect'),
    defectCount: statistics?.defectImageCount || defectResults.filter(result => result.status === 'defect').length,
    totalCount: statistics?.totalCount || defectResults.length,
    defectRatio: statistics?.defectRatio || 0 // 백엔드에서 계산된 결함 비율 사용
  };
};
