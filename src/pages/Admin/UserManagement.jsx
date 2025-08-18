import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { userAPI } from '../../api';

const StyledPage = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;

  .page-header {
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
  }

  .page-description {
    color: #6c757d;
    margin: 0;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .filter-tabs {
    display: flex;
    gap: 0.5rem;
  }

  .filter-tab {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .filter-tab.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .filter-tab:hover:not(.active) {
    background: #f8f9fa;
  }

  .refresh-button {
    padding: 0.5rem 1rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-weight: 500;
  }

  .refresh-button:hover:not(:disabled) {
    background: #218838;
  }

  .refresh-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .table-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th {
    background: #f8f9fa;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
    font-size: 0.9rem;
  }

  .table td {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    vertical-align: middle;
  }

  .table tbody tr:hover {
    background: #f8f9fa;
  }

  .table tbody tr:last-child td {
    border-bottom: none;
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-approved {
    background: #d4edda;
    color: #155724;
  }

  .status-rejected {
    background: #f8d7da;
    color: #721c24;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .approve-button {
    background: #28a745;
    color: white;
  }

  .approve-button:hover:not(:disabled) {
    background: #218838;
  }

  .reject-button {
    background: #dc3545;
    color: white;
  }

  .reject-button:hover:not(:disabled) {
    background: #c82333;
  }

  .action-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .date-cell {
    font-size: 0.85rem;
    color: #6c757d;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }

  .empty-state-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .loading-state {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    border: 1px solid #f5c6cb;
  }

  .success-message {
    background: #d4edda;
    color: #155724;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    border: 1px solid #c3e6cb;
  }

  .stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-item {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
    flex: 1;
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #6c757d;
    margin: 0;
  }
`;

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalCount: 0
  });

  // 사용자 목록 조회
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      let result;
      
      // 필터에 따라 다른 API 호출
      switch (filter) {
        case 'pending':
          result = await userAPI.getPendingUsers();
          break;
        case 'approved':
          result = await userAPI.getApprovedUsers();
          break;
        case 'rejected':
          result = await userAPI.getRejectedUsers();
          break;
        case 'all':
        default:
          result = await userAPI.getAllUsers();
          break;
      }
      
      if (result.success) {
        setUsers(result.data || []);
        console.log('사용자 목록 조회 성공:', result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('사용자 목록 조회 중 오류가 발생했습니다.');
      console.error('사용자 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 통계 데이터 조회
  const fetchStatistics = async () => {
    try {
      const result = await userAPI.getApprovalStatistics();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('통계 조회 실패:', err);
    }
  };

  // 필터 변경 시 데이터 새로 불러오기
  useEffect(() => {
    fetchUsers();
  }, [filter]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchUsers();
    fetchStatistics();
    
    // 30초마다 자동 새로고침
    const interval = setInterval(() => {
      fetchUsers();
      fetchStatistics();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 승인 처리
  const handleApprove = async (userId, userName) => {
    const reason = window.prompt(`${userName} 님의 승인 사유를 입력해주세요 (선택사항):`, '');
    
    if (reason === null) return; // 취소

    setActionLoading(prev => ({ ...prev, [userId]: 'approving' }));
    setError('');
    setSuccess('');

    try {
      const result = await userAPI.approveUser(userId, '관리자', reason);
      
      if (result.success) {
        setSuccess(result.message || `${userName} 님의 회원가입이 승인되었습니다.`);
        fetchUsers(); // 목록 새로고침
        fetchStatistics(); // 통계 새로고침
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('승인 처리 중 오류가 발생했습니다.');
      console.error('승인 실패:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  // 거절 처리
  const handleReject = async (userId, userName) => {
    const reason = window.prompt(`${userName} 님의 회원가입을 거절하는 이유를 입력해주세요:`, '');
    
    if (reason === null) return; // 취소
    if (reason.trim() === '') {
      alert('거절 사유는 필수입니다.');
      return;
    }
    
    setActionLoading(prev => ({ ...prev, [userId]: 'rejecting' }));
    setError('');
    setSuccess('');

    try {
      const result = await userAPI.rejectUser(userId, reason, '관리자');
      
      if (result.success) {
        setSuccess(result.message || `${userName} 님의 회원가입이 거절되었습니다.`);
        fetchUsers(); // 목록 새로고침
        fetchStatistics(); // 통계 새로고침
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('거절 처리 중 오류가 발생했습니다.');
      console.error('거절 실패:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 상태별 개수는 API에서 받은 통계 사용
  const displayStats = {
    pending: stats.pendingCount || 0,
    approved: stats.approvedCount || 0,
    rejected: stats.rejectedCount || 0,
    total: stats.totalCount || 0
  };

  return (
    <StyledPage>
      <div className="page-header">
        <h1 className="page-title">사용자 관리</h1>
        <p className="page-description">
          회원가입 요청을 관리하고 승인/거절을 처리할 수 있습니다.
        </p>
        
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{displayStats.pending}</div>
            <p className="stat-label">대기 중</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">{displayStats.approved}</div>
            <p className="stat-label">승인됨</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">{displayStats.rejected}</div>
            <p className="stat-label">거절됨</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">{displayStats.total}</div>
            <p className="stat-label">전체</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="controls">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            대기 중 ({displayStats.pending})
          </button>
          <button 
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            승인됨 ({displayStats.approved})
          </button>
          <button 
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            거절됨 ({displayStats.rejected})
          </button>
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체 ({displayStats.total})
          </button>
        </div>

        <button 
          className="refresh-button"
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? '새로고침 중...' : '새로고침'}
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div>📋 사용자 목록을 불러오는 중...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div>
              {filter === 'pending' && '대기 중인 회원가입 요청이 없습니다.'}
              {filter === 'approved' && '승인된 사용자가 없습니다.'}
              {filter === 'rejected' && '거절된 사용자가 없습니다.'}
              {filter === 'all' && '등록된 사용자가 없습니다.'}
            </div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>부서</th>
                <th>직급</th>
                <th>신청일</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>{user.role}</td>
                  <td className="date-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td>
                    <span className={`status-badge status-${user.status?.toLowerCase() || 'pending'}`}>
                      {user.status === 'PENDING' && '대기 중'}
                      {user.status === 'APPROVED' && '승인됨'}
                      {user.status === 'REJECTED' && '거절됨'}
                      {!user.status && '대기 중'}
                    </span>
                  </td>
                  <td>
                    {(user.status === 'PENDING' || user.pending || !user.status) && (
                      <div className="action-buttons">
                        <button
                          className="action-button approve-button"
                          onClick={() => handleApprove(user.id, user.name)}
                          disabled={actionLoading[user.id]}
                        >
                          {actionLoading[user.id] === 'approving' ? '승인 중...' : '승인'}
                        </button>
                        <button
                          className="action-button reject-button"
                          onClick={() => handleReject(user.id, user.name)}
                          disabled={actionLoading[user.id]}
                        >
                          {actionLoading[user.id] === 'rejecting' ? '거절 중...' : '거절'}
                        </button>
                      </div>
                    )}
                    {(user.status === 'APPROVED' || user.approved) && (
                      <span style={{ color: '#28a745', fontWeight: '500' }}>완료</span>
                    )}
                    {(user.status === 'REJECTED' || user.rejected) && (
                      <span style={{ color: '#dc3545', fontWeight: '500' }}>처리 완료</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </StyledPage>
  );
};