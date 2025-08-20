import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * 실시간 용접 공정 모니터링 차트 컴포넌트
 * WebSocket으로부터 받은 예측 데이터를 실시간으로 시각화
 */
const RealTimeChart = ({ 
  monitoringData = [], 
  maxDataPoints = 20,
  isConnected = false,
  title = "실시간 용접 공정 모니터링"
}) => {
  
  // 차트 데이터 상태
  const [chartData, setChartData] = useState([]);
  const [currentStats, setCurrentStats] = useState({
    current: { value: 0, status: 'normal', confidence: 0 },
    vibration: { value: 0, status: 'normal', confidence: 0 }
  });

  // WebSocket 데이터 처리
  useEffect(() => {
    if (monitoringData.length === 0) return;

    const latestData = monitoringData[monitoringData.length - 1];
    
    // 데이터 파싱 및 변환
    const processedData = processMonitoringData(latestData);
    
    if (processedData) {
      setChartData(prev => {
        const newData = [...prev, processedData].slice(-maxDataPoints);
        return newData;
      });

      // 현재 상태 업데이트
      updateCurrentStats(processedData);
    }
  }, [monitoringData, maxDataPoints]);

  // ✨ 임시 시뮬레이션 데이터 (테스트용)
  useEffect(() => {
    if (monitoringData.length > 0) return; // 실제 데이터가 있으면 시뮬레이션 안함

    const generateTestData = () => {
      const now = new Date();
      const time = now.toLocaleTimeString();
      
      // 랜덤 테스트 데이터 생성
      const isAnomaly = Math.random() > 0.8; // 20% 확률로 이상값
      const currentValue = isAnomaly ? 3.0 + Math.random() * 1.5 : 1.8 + Math.random() * 0.8;
      const vibrationValue = isAnomaly ? 2.8 + Math.random() * 1.2 : 1.2 + Math.random() * 0.6;
      const threshold = 2.5;
      
      const testData = {
        time: time,
        timestamp: now.getTime(),
        current: currentValue,
        vibration: vibrationValue,
        threshold: threshold,
        current_status: currentValue > threshold ? 'anomaly' : 'normal',
        vibration_status: vibrationValue > threshold ? 'anomaly' : 'normal'
      };

      setChartData(prev => [...prev.slice(-19), testData]);
      
      // 현재 상태 업데이트
      setCurrentStats({
        current: {
          value: currentValue,
          status: currentValue > threshold ? 'anomaly' : 'normal',
          confidence: 0.88 + Math.random() * 0.11
        },
        vibration: {
          value: vibrationValue,
          status: vibrationValue > threshold ? 'anomaly' : 'normal',
          confidence: 0.85 + Math.random() * 0.14
        }
      });
    };

    // 초기 테스트 데이터 생성 (10개)
    for (let i = 0; i < 10; i++) {
      setTimeout(() => generateTestData(), i * 300);
    }

    // 실시간 테스트 데이터 업데이트 (3초마다)
    const interval = setInterval(generateTestData, 3000);
    
    return () => clearInterval(interval);
  }, [monitoringData.length]);

  // 모니터링 데이터 처리 함수
  const processMonitoringData = (data) => {
    console.log('🔧 차트 데이터 파싱 시작:', data);
    
    if (!data || !data.predictionResult) {
      console.log('❌ 데이터 또는 predictionResult가 없음');
      return null;
    }

    const timestamp = new Date(data.timestamp);
    const timeString = timestamp.toLocaleTimeString();
    
    const prediction = data.predictionResult;
    const sensorSummary = prediction.sensorValues || {};
    
    // 신호 타입 정규화 (cur -> current, vib -> vibration)
    const normalizedSignalType = data.signalType === 'cur' ? 'current' : 
                                 data.signalType === 'vib' ? 'vibration' : 
                                 data.signalType;
    
    const processedData = {
      time: timeString,
      timestamp: data.timestamp,
      
      // 신호 타입에 따른 데이터 분류
      [normalizedSignalType]: sensorSummary.average || 0,
      [`${normalizedSignalType}_confidence`]: prediction.confidence || 0,
      [`${normalizedSignalType}_status`]: prediction.status || 'normal',
      
      // 임계값과 이상 점수
      threshold: prediction.threshold || 0.5,
      anomalyScore: prediction.anomalyScore || 0,
      
      // 장비 정보
      equipmentId: data.equipmentId,
      isAnomalous: prediction.isAnomalous || false
    };
    
    console.log('✅ 파싱된 차트 데이터:', processedData);
    return processedData;
  };

  // 현재 통계 업데이트
  const updateCurrentStats = (data) => {
    console.log('📊 상태 업데이트 데이터:', data);
    
    // equipmentId에서 신호 타입 추출 또는 직접 신호 타입 사용
    const signalType = data.equipmentId?.includes('current') ? 'current' : 
                      data.equipmentId?.includes('vibration') ? 'vibration' :
                      Object.keys(data).find(key => key === 'current' || key === 'vibration');
    
    if (!signalType) {
      console.log('❌ 신호 타입을 찾을 수 없음');
      return;
    }
    
    console.log('🔧 감지된 신호 타입:', signalType);
    
    setCurrentStats(prev => {
      const newStats = {
        ...prev,
        [signalType]: {
          value: data[signalType] || 0,
          status: data.isAnomalous ? 'anomaly' : 'normal',
          confidence: data[`${signalType}_confidence`] || 0
        }
      };
      
      console.log('📊 업데이트된 상태:', newStats);
      return newStats;
    });
  };

  // 차트 데이터 통합 (전류/진동 데이터 병합)
  const getIntegratedChartData = () => {
    // ✨ 데이터가 없으면 임시 테스트 데이터 생성
    if (chartData.length === 0) {
      const now = new Date();
      return [
        {
          time: new Date(now.getTime() - 10000).toLocaleTimeString(),
          current: 2.1,
          vibration: 1.8,
          threshold: 2.5,
          timestamp: now.getTime() - 10000
        },
        {
          time: new Date(now.getTime() - 5000).toLocaleTimeString(),
          current: 2.3,
          vibration: 1.9,
          threshold: 2.5,
          timestamp: now.getTime() - 5000
        },
        {
          time: now.toLocaleTimeString(),
          current: 2.0,
          vibration: 1.7,
          threshold: 2.5,
          timestamp: now.getTime()
        }
      ];
    }

    // 시간별로 데이터 그룹화
    const timeGroups = {};
    
    chartData.forEach(item => {
      const timeKey = item.time;
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = { 
          time: timeKey, 
          timestamp: item.timestamp,
          threshold: item.threshold 
        };
      }
      
      // 전류 또는 진동 데이터 추가
      if (item.current !== undefined) {
        timeGroups[timeKey].current = item.current;
        timeGroups[timeKey].current_status = item.current_status;
      }
      if (item.vibration !== undefined) {
        timeGroups[timeKey].vibration = item.vibration;
        timeGroups[timeKey].vibration_status = item.vibration_status;
      }
    });

    return Object.values(timeGroups).sort((a, b) => a.timestamp - b.timestamp);
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`시간: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value?.toFixed(3)}`}
              {entry.dataKey.includes('status') && (
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  entry.value === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {entry.value === 'normal' ? '정상' : '이상'}
                </span>
              )}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 상태별 스타일
  const getStatusStyle = (status) => {
    switch (status) {
      case 'anomaly':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const integratedData = getIntegratedChartData();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className={`h-6 w-6 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isConnected ? '연결됨' : '연결 대기'}
          </span>
        </div>
        
        <div className="text-sm text-gray-500">
          데이터 포인트: {integratedData.length}/{maxDataPoints}
        </div>
      </div>

      {/* 실시간 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 전류 상태 */}
        <div className={`p-4 rounded-lg border-2 ${getStatusStyle(currentStats.current.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span className="font-medium">용접 전류</span>
            </div>
            {currentStats.current.status === 'normal' ? 
              <CheckCircle className="h-5 w-5 text-green-500" /> : 
              <AlertTriangle className="h-5 w-5 text-red-500" />
            }
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">
              {currentStats.current.value.toFixed(3)}
            </div>
            <div className="text-sm opacity-75">
              신뢰도: {(currentStats.current.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* 진동 상태 */}
        <div className={`p-4 rounded-lg border-2 ${getStatusStyle(currentStats.vibration.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">진동 레벨</span>
            </div>
            {currentStats.vibration.status === 'normal' ? 
              <CheckCircle className="h-5 w-5 text-green-500" /> : 
              <AlertTriangle className="h-5 w-5 text-red-500" />
            }
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">
              {currentStats.vibration.value.toFixed(3)}
            </div>
            <div className="text-sm opacity-75">
              신뢰도: {(currentStats.vibration.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 실시간 차트 */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={integratedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={12}
              tick={{ fill: '#666' }}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tick={{ fill: '#666' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* 임계값 선 */}
            <Line 
              type="monotone" 
              dataKey="threshold" 
              stroke="#F59E0B" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="임계값"
            />
            
            {/* 전류 데이터 */}
            <Line 
              type="monotone" 
              dataKey="current" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#EF4444' }}
              name="용접 전류"
            />
            
            {/* 진동 데이터 */}
            <Line 
              type="monotone" 
              dataKey="vibration" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3B82F6' }}
              name="진동 레벨"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 차트 하단 정보 */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>용접 전류</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>진동 레벨</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-yellow-500"></div>
            <span>임계값</span>
          </div>
        </div>
        <div>
          마지막 업데이트: {integratedData.length > 0 ? integratedData[integratedData.length - 1]?.time : '-'}
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;