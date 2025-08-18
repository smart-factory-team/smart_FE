// src/api/user.js
import { apiClient } from './client';

// 사용자 관리 관련 API 함수들
export const userAPI = {
  // 대기 중인 회원가입 승인 목록 조회
  getPendingUsers: async () => {
    try {
      const response = await apiClient.get('/api/approvals/pending');
      
      return {
        success: true,
        data: response.data || []  // 직접 배열이므로 _embedded 불필요
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '대기 중인 사용자 목록 조회 중 오류가 발생했습니다.',
      };
    }
  },

  // 승인된 사용자 목록 조회
  getApprovedUsers: async () => {
    try {
      const response = await apiClient.get('/api/approvals/approved');
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '승인된 사용자 목록 조회 중 오류가 발생했습니다.',
      };
    }
  },

  // 거절된 사용자 목록 조회
  getRejectedUsers: async () => {
    try {
      const response = await apiClient.get('/api/approvals/rejected');
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '거절된 사용자 목록 조회 중 오류가 발생했습니다.',
      };
    }
  },

  // 모든 사용자 목록 조회 (통합)
  getAllUsers: async () => {
    try {
      // 병렬로 모든 상태의 사용자 조회
      const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
        userAPI.getPendingUsers(),
        userAPI.getApprovedUsers(), 
        userAPI.getRejectedUsers()
      ]);

      const allUsers = [
        ...(pendingResult.success ? pendingResult.data : []),
        ...(approvedResult.success ? approvedResult.data : []),
        ...(rejectedResult.success ? rejectedResult.data : [])
      ];

      return {
        success: true,
        data: allUsers
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '전체 사용자 목록 조회 중 오류가 발생했습니다.',
      };
    }
  },

  // 승인 통계 조회
  getApprovalStatistics: async () => {
    try {
      const response = await apiClient.get('/api/approvals/statistics');
      
      return {
        success: true,
        data: response.data  // { pendingCount, approvedCount, rejectedCount, totalCount }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '승인 통계 조회 중 오류가 발생했습니다.',
      };
    }
  },

  // 회원가입 승인
  approveUser: async (userId, processedBy = '관리자', reason = '') => {
    try {
      const response = await apiClient.put(`/api/approvals/${userId}/approve`, {
        processedBy,
        reason
      });
      
      return {
        success: response.data.success !== false,  // API 응답의 success 필드 확인
        data: response.data.data,
        message: response.data.message || '사용자가 승인되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '사용자 승인 중 오류가 발생했습니다.',
      };
    }
  },

  // 회원가입 거절
  rejectUser: async (userId, reason = '', processedBy = '관리자') => {
    try {
      const response = await apiClient.put(`/api/approvals/${userId}/reject`, {
        processedBy,
        reason
      });
      
      return {
        success: response.data.success !== false,  // API 응답의 success 필드 확인
        data: response.data.data,
        message: response.data.message || '사용자가 거절되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '사용자 거절 중 오류가 발생했습니다.',
      };
    }
  }
};