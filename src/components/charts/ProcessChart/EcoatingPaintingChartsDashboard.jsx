import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

const EcoatingPaintingChartsDashboard = ({ stats }) => {

  // 전체 통계 계산
  const calculateOverallStats = () => {
    const totalOperations = Object.values(stats).reduce((sum, s) => sum + s.totalOps, 0);
    const totalDefects = Object.values(stats).reduce((sum, s) => sum + s.totalDefects, 0);
    const goodOperations = totalOperations - totalDefects;
    const avgQuality = totalOperations > 0 ? (goodOperations / totalOperations * 100) : 0;
    
    return { 
      totalProducts: totalOperations, 
      totalDefects, 
      avgQuality: avgQuality.toFixed(1),
      goodProducts: goodOperations
    };
  };


  // 장비별 최신 데이터
  const getLatestDataByMachine = () => {
    return ['PAINT-MCH-001', 'PAINT-MCH-002'].map((machineId, index) => {
      const machineName = [`전착조 1`, `전착조 2`][index];
      
      const machineData = stats[machineId] || {
        totalOps: 0,
        totalDefects: 0
      }

      const totalOperations = machineData.totalOps || 0;
      const totalDefects = machineData.totalDefects || 0;
      const goodOperations = totalOperations - totalDefects;
      const qualityRate = totalOperations > 0 ? ((goodOperations / totalOperations) * 100) : 100;
      
      return {
        name: machineName,
        machineId,
        qualityRate: qualityRate,
        production: totalOperations,
        defects: totalDefects,
        goodProducts: goodOperations
      };
    });
  };

  const overallStats = calculateOverallStats();
  const machineData = getLatestDataByMachine();

  const styles = {
    container: {
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    },
    maxWidth: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '32px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      padding: '24px'
    },
    statCardFlex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '30px',
      fontWeight: 'bold',
      margin: 0
    },
    statValueProduction: {
      color: '#111827'
    },
    statValueQuality: {
      color: '#059669'
    },
    statValueDefects: {
      color: '#dc2626'
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '32px',
      marginBottom: '32px'
    },
    chartCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      padding: '24px'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px'
    },
    tableContainer: {
      marginTop: '32px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      overflow: 'hidden'
    },
    tableHeader: {
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb'
    },
    tableTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    tableWrapper: {
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    thead: {
      backgroundColor: '#f9fafb'
    },
    th: {
      padding: '12px 24px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    tbody: {
      backgroundColor: 'white'
    },
    tr: {
      borderBottom: '1px solid #e5e7eb'
    },
    trEven: {
      backgroundColor: '#f9fafb'
    },
    td: {
      padding: '16px 24px',
      whiteSpace: 'nowrap',
      fontSize: '14px'
    },
    tdName: {
      fontWeight: '500',
      color: '#111827'
    },
    tdNumber: {
      color: '#111827',
      fontWeight: '500'
    },
    tdGreen: {
      color: '#059669',
      fontWeight: '500'
    },
    tdRed: {
      color: '#dc2626',
      fontWeight: '500'
    },
    badge: {
      display: 'inline-flex',
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '9999px'
    },
    badgeGreen: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    badgeYellow: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    badgeRed: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        
        {/* 상단 통계 카드 */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statCardFlex}>
              <div>
                <p style={styles.statLabel}>총 작업 수</p>
                <p style={{...styles.statValue, ...styles.statValueProduction}}>{overallStats.totalProducts}</p>
              </div>
              <Activity size={32} color="#3b82f6" />
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statCardFlex}>
              <div>
                <p style={styles.statLabel}>평균 양품률</p>
                <p style={{...styles.statValue, ...styles.statValueQuality}}>{overallStats.avgQuality}%</p>
              </div>
              <CheckCircle size={32} color="#10b981" />
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statCardFlex}>
              <div>
                <p style={styles.statLabel}>총 결함 수</p>
                <p style={{...styles.statValue, ...styles.statValueDefects}}>{overallStats.totalDefects}</p>
              </div>
              <AlertCircle size={32} color="#ef4444" />
            </div>
          </div>
        </div>



        <div style={styles.chartsGrid}>
          {/* 장비별 작업 현황 */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>장비별 작업 현황</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={machineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="goodProducts" fill="#10B981" name="양품" />
                <Bar dataKey="defects" fill="#EF4444" name="결함" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 장비별 상세 현황 테이블 */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>장비별 상세 현황</h3>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>장비명</th>
                  <th style={styles.th}>양품률</th>
                  <th style={styles.th}>작업 수</th>
                  <th style={styles.th}>양품</th>
                  <th style={styles.th}>결함</th>
                  <th style={styles.th}>상태</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {machineData.map((machine, index) => (
                  <tr key={machine.machineId} style={{...styles.tr, ...(index % 2 === 1 ? styles.trEven : {})}}>
                    <td style={{...styles.td, ...styles.tdName}}>
                      {machine.name}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...(machine.qualityRate >= 95 ? styles.badgeGreen : 
                            machine.qualityRate >= 85 ? styles.badgeYellow : styles.badgeRed)
                      }}>
                        {machine.qualityRate.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{...styles.td, ...styles.tdNumber}}>
                      {machine.production}회
                    </td>
                    <td style={{...styles.td, ...styles.tdGreen}}>
                      {machine.goodProducts}회
                    </td>
                    <td style={{...styles.td, ...styles.tdRed}}>
                      {machine.defects}회
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...(machine.qualityRate >= 95 ? styles.badgeGreen : 
                            machine.qualityRate >= 85 ? styles.badgeYellow : styles.badgeRed)
                      }}>
                        {machine.qualityRate >= 80 ? '정상' : machine.qualityRate >= 60 ? '주의' : '이상'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoatingPaintingChartsDashboard;
