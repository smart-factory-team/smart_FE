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
 * 실시간 용접 공정 모니터링 차트 컴포넌트
 * WebSocket으로부터 받은 예측 데이터를 실시간으로 시각화
 */
const SimpleRealTimeChart = ({ 
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

  // WebSocket 데이터 처리 - 단순화된 버전
  useEffect(() => {
    if (monitoringData.length === 0) return;

    const latestData = monitoringData[monitoringData.length - 1];
    
    // CONNECTION_ESTABLISHED 메시지는 무시
    if (!latestData.predictionResult) {
      console.log('❌ 연결 메시지 또는 predictionResult가 없음 - 스킵');
      return;
    }

    const processedData = processMonitoringData(latestData);
    
    if (processedData) {
      console.log('🔧 처리된 데이터를 차트에 추가:', processedData);
      
      setChartData(prev => {
        const newData = [...prev, processedData].slice(-maxDataPoints);
        console.log('📊 차트 데이터 업데이트:', newData.length, '개');
        return newData;
      });

      // 현재 상태 업데이트
      setCurrentStats(prev => {
        const newStats = { ...prev };
        
        if (processedData.signalType === 'current') {
          newStats.current = {
            value: processedData.value,
            status: processedData.status,
            confidence: processedData.confidence
          };
        } else if (processedData.signalType === 'vibration') {
          newStats.vibration = {
            value: processedData.value,
            status: processedData.status,
            confidence: processedData.confidence
          };
        }
        
        console.log('📊 상태 업데이트:', newStats);
        return newStats;
      });
    }
  }, [monitoringData, maxDataPoints]);

  // 모니터링 데이터 처리 함수 - 개선된 버전
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
      signalType: normalizedSignalType,
      value: sensorSummary.average || 0,
      confidence: prediction.confidence || 0,
      status: prediction.status || 'normal',
      
      // 임계값과 이상 점수
      threshold: prediction.threshold || 2.5,
      anomalyScore: prediction.anomalyScore || 0,
      
      // 장비 정보
      equipmentId: data.equipmentId,
      isAnomalous: prediction.isAnomalous || false
    };
    
    console.log('✅ 파싱된 차트 데이터:', processedData);
    return processedData;
  };

  // 차트 데이터 통합 - 전류와 진동을 따로 라인으로 표시
  const getIntegratedChartData = () => {
    console.log('📊 차트 데이터 가져오기:', chartData.length, '개');
    
    if (chartData.length === 0) {
      console.log('📊 차트 데이터가 없음 - 빈 배열 반환');
      return [];
    }

    // 시간별로 데이터 그룹화하여 전류/진동 분리 표시
    const timeGroups = {};
    
    chartData.forEach(item => {
      const timeKey = item.time;
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = { 
          time: timeKey, 
          timestamp: item.timestamp,
          threshold: item.threshold || 2.5
        };
      }
      
      // 신호 타입에 따라 데이터 추가
      if (item.signalType === 'current') {
        timeGroups[timeKey].current = item.value;
        timeGroups[timeKey].current_status = item.status;
      } else if (item.signalType === 'vibration') {
        timeGroups[timeKey].vibration = item.value;
        timeGroups[timeKey].vibration_status = item.status;
      }
    });

    const result = Object.values(timeGroups).sort((a, b) => a.timestamp - b.timestamp);
    console.log('📊 통합된 차트 데이터:', result.length, '개');
    return result;
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <TooltipContainer>
          <TooltipLabel>{`시간: ${label}`}</TooltipLabel>
          {payload.map((entry, index) => (
            <TooltipItem key={index} color={entry.color}>
              {`${entry.name}: ${entry.value?.toFixed(3)}`}
              {entry.dataKey.includes('status') && (
                <TooltipStatus status={entry.value}>
                  {entry.value === 'normal' ? '정상' : '이상'}
                </TooltipStatus>
              )}
            </TooltipItem>
          ))}
        </TooltipContainer>
      );
    }
    return null;
  };

  const integratedData = getIntegratedChartData();

  return (
    <ChartContainer>
      {/* 헤더 */}
      <ChartHeader>
        <HeaderLeft>
          <ActivityIcon connected={isConnected} />
          <ChartTitle>{title}</ChartTitle>
          <ConnectionBadge connected={isConnected}>
            {isConnected ? '연결됨' : '연결 대기'}
          </ConnectionBadge>
        </HeaderLeft>
        
        <DataPointsInfo>
          데이터 포인트: {integratedData.length}/{maxDataPoints}
        </DataPointsInfo>
      </ChartHeader>

      {/* 실시간 상태 카드 */}
      <StatusGrid>
        {/* 전류 상태 */}
        <StatusCard status={currentStats.current.status}>
          <StatusCardHeader>
            <StatusLabel>
              <Zap size={20} />
              <span>용접 전류</span>
            </StatusLabel>
            <StatusIcon>
              {currentStats.current.status === 'normal' ? 
                <CheckCircle size={20} color="#10b981" /> : 
                <AlertTriangle size={20} color="#ef4444" />
              }
            </StatusIcon>
          </StatusCardHeader>
          <StatusValue>
            {currentStats.current.value.toFixed(3)}
          </StatusValue>
          <StatusConfidence>
            신뢰도: {(currentStats.current.confidence * 100).toFixed(1)}%
          </StatusConfidence>
        </StatusCard>

        {/* 진동 상태 */}
        <StatusCard status={currentStats.vibration.status}>
          <StatusCardHeader>
            <StatusLabel>
              <TrendingUp size={20} />
              <span>진동 레벨</span>
            </StatusLabel>
            <StatusIcon>
              {currentStats.vibration.status === 'normal' ? 
                <CheckCircle size={20} color="#10b981" /> : 
                <AlertTriangle size={20} color="#ef4444" />
              }
            </StatusIcon>
          </StatusCardHeader>
          <StatusValue>
            {currentStats.vibration.value.toFixed(3)}
          </StatusValue>
          <StatusConfidence>
            신뢰도: {(currentStats.vibration.confidence * 100).toFixed(1)}%
          </StatusConfidence>
        </StatusCard>
      </StatusGrid>

      {/* 실시간 차트 */}
      <ChartWrapper>
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
            <span>임계값</span>
          </LegendItem>
        </LegendContainer>
        <LastUpdateInfo>
          마지막 업데이트: {integratedData.length > 0 ? integratedData[integratedData.length - 1]?.time : '-'}
        </LastUpdateInfo>
      </ChartFooter>
    </ChartContainer>
  );
};

export default SimpleRealTimeChart;