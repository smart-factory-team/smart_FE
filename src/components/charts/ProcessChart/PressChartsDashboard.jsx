import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

const PressChartsDashboard = ({ pressStats }) => {

  // pressStats 구조 확인을 위한 디버깅
  console.log('📊 pressStats 데이터:', pressStats);
  
  // 전체 통계 계산
  const calculateOverallStats = () => {
    // 각 프레스의 최신 production과 defects만 합산
    const totalProducts = pressStats[0].totalProducts
    const totalDefects = pressStats[0].totalDefects
    const goodProducts = totalProducts - totalDefects;
    const avgQuality = totalProducts > 0 ? ((goodProducts) / totalProducts * 100) : 0;
    
    return { 
      totalProducts, 
      totalDefects, 
      avgQuality: avgQuality.toFixed(1),
      goodProducts
    };
  };

  // 프레스별 최신 데이터 - 검사 라인 1, 2만
  const getLatestDataByPress = () => {
    // ID 1, 2만 사용 (메인에서 매핑해서 전달됨)
    return [1, 2].map(pressId => {
      const pressName = `검사 라인 ${pressId}`;
      
      const pressData = pressStats[pressId] || {
        totalProducts: 0,
        totalDefects: 0,
        newProducts: 0
      }

      const totalProducts = pressData.totalProducts || 0;
      const totalDefects = pressData.totalDefects || 0;
      const goodProducts = totalProducts - totalDefects;
      const qualityRate = totalProducts > 0 ? ((goodProducts / totalProducts) * 100) : 100;
      
      return {
        name: pressName,
        pressId,
        qualityRate: qualityRate,
        production: totalProducts,
        defects: totalDefects,
        goodProducts: goodProducts
      };
    });
  };

  const stats = calculateOverallStats();
  const pressData = getLatestDataByPress();

  console.log('📋 최종 차트 데이터:', pressData);

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
                <p style={styles.statLabel}>전체 검사량</p>
                <p style={{...styles.statValue, ...styles.statValueProduction}}>{stats.totalProducts}</p>
              </div>
              <Activity size={32} color="#3b82f6" />
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statCardFlex}>
              <div>
                <p style={styles.statLabel}>평균 품질률</p>
                <p style={{...styles.statValue, ...styles.statValueQuality}}>{stats.avgQuality}%</p>
              </div>
              <CheckCircle size={32} color="#10b981" />
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statCardFlex}>
              <div>
                <p style={styles.statLabel}>총 불량품</p>
                <p style={{...styles.statValue, ...styles.statValueDefects}}>{stats.totalDefects}</p>
              </div>
              <AlertCircle size={32} color="#ef4444" />
            </div>
          </div>
        </div>

        <div style={styles.chartsGrid}>
          {/* 프레스별 생산량 비교 */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>라인별 검사량 비교</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="goodProducts" fill="#10B981" name="양품" />
                <Bar dataKey="defects" fill="#EF4444" name="불량품" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 프레스별 상세 현황 테이블 */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>검사 라인별 상세 현황</h3>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>검사 라인</th>
                  <th style={styles.th}>품질률</th>
                  <th style={styles.th}>검사량</th>
                  <th style={styles.th}>양품</th>
                  <th style={styles.th}>불량품</th>
                  <th style={styles.th}>상태</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {pressData.map((press, index) => (
                  <tr key={press.pressId} style={{...styles.tr, ...(index % 2 === 1 ? styles.trEven : {})}}>
                    <td style={{...styles.td, ...styles.tdName}}>
                      {press.name}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...(press.qualityRate >= 90 ? styles.badgeGreen : 
                            press.qualityRate >= 80 ? styles.badgeYellow : styles.badgeRed)
                      }}>
                        {press.qualityRate.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{...styles.td, ...styles.tdNumber}}>
                      {press.production}개
                    </td>
                    <td style={{...styles.td, ...styles.tdGreen}}>
                      {press.goodProducts}개
                    </td>
                    <td style={{...styles.td, ...styles.tdRed}}>
                      {press.defects}개
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        ...(press.qualityRate >= 90 ? styles.badgeGreen : 
                            press.qualityRate >= 80 ? styles.badgeYellow : styles.badgeRed)
                      }}>
                        {press.qualityRate >= 90 ? '정상' : press.qualityRate >= 80 ? '주의' : '이상'}
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

export default PressChartsDashboard;