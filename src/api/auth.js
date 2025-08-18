// src/api/auth.js
import { apiClient, tokenUtils } from './client';

// 인증 관련 API 함수들
export const authAPI = {
  // 회원가입
  register: async (userData) => {
    try {
      const response = await apiClient.post('/userRegisterations', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        department: userData.department,
        role: "EMPLOYEE" // 고정값
      });
      
      return {
        success: true,
        data: response.data,
        message: '회원가입 요청이 완료되었습니다. 관리자 승인을 기다려주세요.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '회원가입 중 오류가 발생했습니다.',
      };
    }
  },

  // 로그인
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', {
        email,
        password
      });
      
      // 로그인 성공 시 토큰 저장
      if (response.data.token) {
        tokenUtils.setToken(response.data.token);
      }
      
      return {
        success: true,
        data: response.data,
        message: '로그인 성공'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
      };
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      // 서버에 로그아웃 요청 (필요한 경우)
      await apiClient.post('/logout');
      
      // 로컬 토큰 제거
      tokenUtils.removeToken();
      
      return {
        success: true,
        message: '로그아웃 되었습니다.'
      };
    } catch (error) {
      // 에러가 발생해도 로컬 토큰은 제거
      tokenUtils.removeToken();
      
      return {
        success: true,
        message: '로그아웃 되었습니다.'
      };
    }
  },

  // 토큰 검증 및 사용자 정보 가져오기
  getCurrentUser: async () => {
    try {
      if (!tokenUtils.isTokenValid()) {
        throw new Error('토큰이 유효하지 않습니다.');
      }
      
      const response = await apiClient.get('/user/me');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      tokenUtils.removeToken();
      
      return {
        success: false,
        error: error.message || '인증에 실패했습니다.',
      };
    }
  },

  // 비밀번호 재설정 요청
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post('/password/reset-request', {
        email
      });
      
      return {
        success: true,
        data: response.data,
        message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.',
      };
    }
  },

  // 비밀번호 재설정
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/password/reset', {
        token,
        newPassword
      });
      
      return {
        success: true,
        data: response.data,
        message: '비밀번호가 성공적으로 변경되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || '비밀번호 재설정 중 오류가 발생했습니다.',
      };
    }
  }
};