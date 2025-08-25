import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

const PressFaultChartDashboard = ({ 
  currentStatus, 
  reconstructionErrorData 
}) => {
  const getRecentData = () => {
    return reconstructionErrorData.slice(-10);
  };

  const recentData = getRecentData();
  const THRESHOLD = 0.002746;

  return (
    <>
      <h2 style={{ fontSize: '32px', fontWeight: '600', color: '#111827', marginBottom: '24px', paddingBottom: '8px', textAlign: 'center' }}>
        유압 펌프 실시간 현황
      </h2>
      {/* 상단 상태 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>현재 상태</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: currentStatus.isFault ? '#DC2626' : '#059669' }}>
                {currentStatus.isFault ? '고장 예상' : '정상'}
              </p>
            </div>
            {currentStatus.isFault ? (
              <AlertCircle style={{ width: '32px', height: '32px', color: '#EF4444' }} />
            ) : (
              <CheckCircle style={{ width: '32px', height: '32px', color: '#10B981' }} />
            )}
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>재구성 오차 (평균)</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: currentStatus.reconstructionError > THRESHOLD ? '#DC2626' : '#2563EB' }}>
                {currentStatus.reconstructionError.toFixed(4)}
              </p>
            </div>
            <Activity style={{ width: '32px', height: '32px', color: '#3B82F6' }} />
          </div>
        </div>
      </div>

      {/* 재구성 오차 실시간 차트 */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', padding: '24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>실시간 재구성 오차 및 고장 확률 추이</h3>
        <ResponsiveContainer width="80%" height={400}>
          <LineChart data={recentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => value.toFixed(3)}
              domain={[0, 0.1]}
            />
            {/* <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => value.toFixed(2)}
              domain={[0, 0.5]}
            /> */}
            <Tooltip 
              formatter={(value, name) => {
                if (name === '임계값') return [value.toFixed(6), '임계값'];
                if (name === '고장 확률') return [value.toFixed(4), '고장 확률'];
                return [value.toFixed(4), '재구성 오차'];
              }}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB', 
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            {/* 임계값 라인 */}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey={() => THRESHOLD}
              stroke="#EF4444" 
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              name="임계값"
            />
            {/* 재구성 오차 라인 */}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="reconstructionError" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={4} 
                    fill={payload.isFault ? '#EF4444' : '#3B82F6'} 
                    strokeWidth={2}
                    stroke="#fff"
                  />
                );
              }}
              name="재구성 오차"
            />
            {/* 고장 확률 라인 */}
            {/* <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="faultProbability" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={4} 
                    fill={payload.isFault ? '#EF4444' : '#10B981'} 
                    strokeWidth={2}
                    stroke="#fff"
                  />
                );
              }}
              name="고장 확률"
            /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default PressFaultChartDashboard;