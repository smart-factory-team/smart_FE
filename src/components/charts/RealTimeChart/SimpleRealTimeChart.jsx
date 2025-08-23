import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

// 🎨 메인 차트 컨테이너
const ChartContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 24px;
`;

// 🎨 헤더 섹션
const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActivityIcon = styled(Activity).withConfig({
  shouldForwardProp: (prop) => !['connected'].includes(prop),
})`
  height: 24px;
  width: 24px;
  color: ${props => props.connected ? '#10b981' : '#9ca3af'};
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const ConnectionBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => !['connected'].includes(prop),
})`
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  
  ${props => props.connected ? `
    background: #dcfce7;
    color: #166534;
  ` : `
    background: #f3f4f6;
    color: #4b5563;
  `}
`;

const DataPointsInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

// 🎨 실시간 상태 카드 그리드
const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatusCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop),
})`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.3s ease;
  
  ${props => props.status === 'normal' ? `
    background: #dcfce7;
    color: #166534;
    border-color: #bbf7d0;
  ` : props.status === 'anomaly' ? `
    background: #fee2e2;
    color: #991b1b;
    border-color: #fca5a5;
  ` : `
    background: #f3f4f6;
    color: #4b5563;
    border-color: #d1d5db;
  `}
`;

const StatusCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatusLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
`;

const StatusValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatusConfidence = styled.div`
  font-size: 12px;
  opacity: 0.75;
`;

// 🎨 차트 컨테이너
const ChartWrapper = styled.div`
  height: 384px;
  margin-bottom: 16px;
`;

// 🎨 차트 하단 정보
const ChartFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
  flex-wrap: wrap;
  gap: 16px;
`;

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendColor = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isDashed', 'color'].includes(prop),
})`
  width: 12px;
  height: 12px;
  border-radius: ${props => props.isDashed ? '0' : '50%'};
  background: ${props => props.color};
  ${props => props.isDashed && `
    height: 2px;
    width: 12px;
    border-radius: 0;
  `}
`;

const LastUpdateInfo = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

// 🎨 커스텀 툴팁 컨테이너
const TooltipContainer = styled.div`
  background: white;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const TooltipLabel = styled.p`
  font-weight: 500;
  color: #111827;
  margin: 0 0 4px 0;
`;

const TooltipItem = styled.p`
  font-size: 14px;
  margin: 2px 0;
  color: ${props => props.color};
`;

const TooltipStatus = styled.span.withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop),
})`
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => props.status === 'normal' ? `
    background: #dcfce7;
    color: #166534;
  ` : `
    background: #fee2e2;
    color: #991b1b;
  `}
`;

/**
 * ✨ 개선된 실시간 용접 공정 모니터링 차트 컴포넌트
 * - 시간 동기화 처리
 * - 전류/진동 임계치 분리 
 * - 데이터 버퍼링 및 통합 표시
 * - 상위 컴포넌트에 상태 전달
 */
const SimpleRealTimeChart = ({ 
  monitoringData = [], 
  maxDataPoints = 20,
  isConnected = false,
  title = "실시간 용접 공정 모니터링",
  onStatusChange // ✨ 새로 추가: 상위 컴포넌트에 상태 변경 알림
}) => {
  
  // ✨ 개선된 상태 관리
  const [chartData, setChartData] = useState([]);
  const [dataBuffer, setDataBuffer] = useState(new Map()); // 시간별 데이터 버퍼
  const [currentStats, setCurrentStats] = useState({
    current: { value: 0, status: 'normal', confidence: 0 },
    vibration: { value: 0, status: 'normal', confidence: 0 }
  });
  
  // ✨ API에서 받아오는 동적 임계치 설정 (전류와 진동 각각)
  const [thresholds, setThresholds] = useState({
    current: 2.8,    // 전류 임계치 (기본값)
    vibration: 2.2   // 진동 임계치 (기본값)
  });

  // ✨ 개선된 WebSocket 데이터 처리 - 시간 동기화 로직
  useEffect(() => {
    if (monitoringData.length === 0) return;

    const latestData = monitoringData[monitoringData.length - 1];
    
    // CONNECTION_ESTABLISHED 메시지는 무시
    if (!latestData.predictionResult) {
      console.log('⌛ 연결 메시지 또는 predictionResult가 없음 - 스킵');
      return;
    }

    // ✨ 시간 동기화를 위한 데이터 처리
    processTimeSynchedData(latestData);
    
  }, [monitoringData, maxDataPoints]);

  // ✨ 새로운 함수: 시간 동기화된 데이터 처리
  const processTimeSynchedData = (data) => {
    const timestamp = data.timestamp;
    const prediction = data.predictionResult;
    const sensorSummary = prediction.sensorValues || {};
    
    // 신호 타입 정규화
    const normalizedSignalType = data.signalType === 'cur' ? 'current' : 
                                 data.signalType === 'vib' ? 'vibration' : 
                                 data.signalType;
    
    // ✨ API에서 받은 임계치로 동적 업데이트
    const apiThreshold = prediction.threshold || 2.5;
    setThresholds(prevThresholds => ({
      ...prevThresholds,
      [normalizedSignalType]: apiThreshold
    }));
    
    console.log(`📊 임계치 업데이트: ${normalizedSignalType} = ${apiThreshold}`);
    
    // ✨ 1분 단위로 시간 버킷 생성 (초 단위 차이 무시)
    const timeKey = Math.floor(timestamp / 60000) * 60000; // 1분 단위로 버킷팅
    const timeString = new Date(timeKey).toLocaleTimeString();
    
    console.log(`📊 데이터 처리: ${normalizedSignalType} at ${timeString} (버킷: ${timeKey})`);
    
    // 버퍼에서 해당 시간대 데이터 가져오기
    setDataBuffer(prevBuffer => {
      const newBuffer = new Map(prevBuffer);
      
      // ✨ 기존 데이터가 있으면 복사해서 새 객체 생성 (불변성 유지)
      let timeData;
      if (newBuffer.has(timeKey)) {
        // 기존 데이터를 복사하여 새 객체 생성
        timeData = { ...newBuffer.get(timeKey) };
      } else {
        // 새로운 데이터 객체 생성
        timeData = {
          time: timeString,
          timestamp: timeKey,
          current: null,
          vibration: null,
          current_threshold: null,
          vibration_threshold: null,
          current_status: 'normal',
          vibration_status: 'normal'
        };
      }
      
      // ✨ 복사된 객체에 데이터 할당 (이제 읽기 전용 에러 없음)
      if (normalizedSignalType === 'current') {
        timeData.current = sensorSummary.average || 0;
        timeData.current_threshold = apiThreshold;
        timeData.current_status = prediction.status || 'normal';
      } else if (normalizedSignalType === 'vibration') {
        timeData.vibration = sensorSummary.average || 0;
        timeData.vibration_threshold = apiThreshold;
        timeData.vibration_status = prediction.status || 'normal';
      }
      
      // ✨ 새로운 객체를 Map에 다시 저장
      newBuffer.set(timeKey, timeData);
      
      console.log(`📊 버퍼 업데이트:`, timeData);
      
      return newBuffer;
    });
    
    // ✨ 현재 상태 업데이트
    setCurrentStats(prev => {
      const newStats = { ...prev };
      
      if (normalizedSignalType === 'current') {
        newStats.current = {
          value: sensorSummary.average || 0,
          status: prediction.status || 'normal',
          confidence: prediction.confidence || 0
        };
      } else if (normalizedSignalType === 'vibration') {
        newStats.vibration = {
          value: sensorSummary.average || 0,
          status: prediction.status || 'normal',
          confidence: prediction.confidence || 0
        };
      }
      
      // ✨ 상위 컴포넌트에 상태 변경 알림
      if (onStatusChange) {
        // 전류 또는 진동 중 하나라도 이상이면 전체 이상으로 처리
        const currentStatus = normalizedSignalType === 'current' ? (prediction.status || 'normal') : newStats.current.status;
        const vibrationStatus = normalizedSignalType === 'vibration' ? (prediction.status || 'normal') : newStats.vibration.status;
        
        const overallStatus = (
          currentStatus === 'ANOMALY' || currentStatus === 'anomaly' ||
          vibrationStatus === 'ANOMALY' || vibrationStatus === 'anomaly'
        ) ? 'anomaly' : 'normal';
        
        onStatusChange({
          current: currentStatus,
          vibration: vibrationStatus,
          overall: overallStatus
        });
        
        console.log(`📊 상태 변경 알림: 전류=${currentStatus}, 진동=${vibrationStatus}, 전체=${overallStatus}`);
      }
      
      return newStats;
    });
  };

  // ✨ 버퍼 데이터를 차트 데이터로 변환
  useEffect(() => {
    // 버퍼에서 차트 데이터 생성
    const sortedData = Array.from(dataBuffer.entries())
      .sort(([a], [b]) => a - b) // 시간순 정렬
      .map(([_, timeData]) => timeData)
      .filter(data => data.current !== null || data.vibration !== null) // 데이터가 있는 것만
      .slice(-maxDataPoints); // 최대 데이터 포인트 수 제한
    
    setChartData(sortedData);
    console.log(`📊 차트 데이터 업데이트: ${sortedData.length}개`);
    
  }, [dataBuffer, maxDataPoints]);

  // ✨ 상태 카드 스타일링을 위한 상태 변환 함수
  const getStatusForCard = (status) => {
    if (status === 'NORMAL' || status === 'normal') return 'normal';
    if (status === 'ANOMALY' || status === 'anomaly') return 'anomaly';
    return 'unknown';
  };

  // ✨ 개선된 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <TooltipContainer>
          <TooltipLabel>{`시간: ${label}`}</TooltipLabel>
          {payload.map((entry, index) => {
            if (entry.dataKey.includes('threshold')) {
              return (
                <TooltipItem key={index} color={entry.color}>
                  {`${entry.name}: ${entry.value?.toFixed(3)}`}
                </TooltipItem>
              );
            } else if (entry.dataKey === 'current' || entry.dataKey === 'vibration') {
              return (
                <TooltipItem key={index} color={entry.color}>
                  {`${entry.name}: ${entry.value?.toFixed(3)}`}
                </TooltipItem>
              );
            }
            return null;
          })}
        </TooltipContainer>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      {/* 헤더 */}
      <ChartHeader>
        <HeaderLeft>
          <ActivityIcon connected={isConnected} />
          <ChartTitle>{title}</ChartTitle>
          {/* <ConnectionBadge connected={isConnected}>
            {isConnected ? '연결됨' : '연결 대기'}
          </ConnectionBadge> */}
        </HeaderLeft>
        
        <DataPointsInfo>
          데이터 포인트: {chartData.length}/{maxDataPoints}
        </DataPointsInfo>
      </ChartHeader>

      {/* 실시간 상태 카드 */}
      <StatusGrid>
        {/* 전류 상태 */}
        <StatusCard status={getStatusForCard(currentStats.current.status)}>
          <StatusCardHeader>
            <StatusLabel>
              <Zap size={20} />
              <span>용접 전류</span>
            </StatusLabel>
            <StatusIcon>
              {currentStats.current.status === 'NORMAL' || currentStats.current.status === 'normal' ? 
                <CheckCircle size={20} color="#10b981" /> : 
                <AlertTriangle size={20} color="#ef4444" />
              }
            </StatusIcon>
          </StatusCardHeader>
          <StatusValue>
            {currentStats.current.value.toFixed(3)}
          </StatusValue>
          <StatusConfidence>
            신뢰도: {(currentStats.current.confidence * 100).toFixed(1)}% | 임계치: {thresholds.current}
          </StatusConfidence>
        </StatusCard>

        {/* 진동 상태 */}
        <StatusCard status={getStatusForCard(currentStats.vibration.status)}>
          <StatusCardHeader>
            <StatusLabel>
              <TrendingUp size={20} />
              <span>진동 레벨</span>
            </StatusLabel>
            <StatusIcon>
              {currentStats.vibration.status === 'NORMAL' || currentStats.vibration.status === 'normal' ? 
                <CheckCircle size={20} color="#10b981" /> : 
                <AlertTriangle size={20} color="#ef4444" />
              }
            </StatusIcon>
          </StatusCardHeader>
          <StatusValue>
            {currentStats.vibration.value.toFixed(3)}
          </StatusValue>
          <StatusConfidence>
            신뢰도: {(currentStats.vibration.confidence * 100).toFixed(1)}% | 임계치: {thresholds.vibration}
          </StatusConfidence>
        </StatusCard>
      </StatusGrid>

      {/* ✨ 개선된 실시간 차트 */}
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            
            {/* ✨ 분리된 임계치 선 */}
            <Line 
              type="monotone" 
              dataKey="current_threshold" 
              stroke="#F59E0B" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="전류 임계치"
            />
            
            <Line 
              type="monotone" 
              dataKey="vibration_threshold" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              strokeDasharray="8 3"
              dot={false}
              name="진동 임계치"
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
              connectNulls={false}
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
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* 차트 하단 정보 */}
      <ChartFooter>
        <LegendContainer>
          <LegendItem>
            <LegendColor color="#ef4444" />
            <span>용접 전류</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#3b82f6" />
            <span>진동 레벨</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#f59e0b" isDashed />
            <span>전류 임계치 ({thresholds.current})</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#8b5cf6" isDashed />
            <span>진동 임계치 ({thresholds.vibration})</span>
          </LegendItem>
        </LegendContainer>
        <LastUpdateInfo>
          마지막 업데이트: {chartData.length > 0 ? chartData[chartData.length - 1]?.time : '-'}
        </LastUpdateInfo>
      </ChartFooter>
    </ChartContainer>
  );
};

export default SimpleRealTimeChart;