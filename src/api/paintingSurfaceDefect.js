// src/api/paintingSurfaceDefect.js
import { apiClient } from './client';

// 도장표면결함탐지 전용 API 엔드포인트 - 모든 요청을 백엔드를 통해 우회
const PAINTING_SURFACE_API_BASE = process.env.REACT_APP_PAINTING_SURFACE_API_BASE_URL || 'http://localhost:8080';

export const paintingSurfaceDefectAPI = {
  // 도장 표면 결함 탐지 결과 조회
  getDefectDetectionResults: async (params = {}) => {
    try {
      const response = await apiClient.get(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection-logs`, params);
      return response.data;
    } catch (error) {
      console.error('도장표면 결함 탐지 결과 조회 실패:', error);
      throw error;
    }
  },

  // 도장 표면 결함 통계 조회
  getDefectStatistics: async (timeRange = '24h') => {
    try {
      const response = await apiClient.get(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection/statistics`, {
        timeRange
      });
      return response.data;
    } catch (error) {
      console.error('도장표면 결함 통계 조회 실패:', error);
      throw error;
    }
  },

  // 기계별 결함 통계 조회
  getMachineStatistics: async () => {
    try {
      const response = await apiClient.get(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection/machine-statistics`);
      return response.data;
    } catch (error) {
      console.error('기계별 결함 통계 조회 실패:', error);
      throw error;
    }
  },

  // AI 모델 서비스 헬스 체크 (백엔드를 통해 우회)
  checkModelServiceHealth: async () => {
    try {
      const response = await apiClient.get(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection/model-health`);
      return response.data;
    } catch (error) {
      console.error('도장표면 AI 모델 서비스 헬스 체크 실패:', error);
      return { status: 'unhealthy', error: error.message };
    }
  },

  // 시뮬레이터 서비스 상태 조회 (백엔드를 통해 우회)
  getSimulatorStatus: async () => {
    try {
      const response = await apiClient.get(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection/simulator-status`);
      return response.data;
    } catch (error) {
      console.error('도장표면 시뮬레이터 상태 조회 실패:', error);
      return { is_running: false, error: error.message };
    }
  },

  // 시뮬레이터 시작 (백엔드를 통해 우회)
  startSimulator: async () => {
    try {
      const response = await apiClient.post(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection/simulator/start`);
      return response.data;
    } catch (error) {
      console.error('도장표면 시뮬레이터 시작 실패:', error);
      throw error;
    }
  },

  // 시뮬레이터 중지 (백엔드를 통해 우회)
  stopSimulator: async () => {
    try {
      const response = await apiClient.post(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection/simulator/stop`);
      return response.data;
    } catch (error) {
      console.error('도장표면 시뮬레이터 중지 실패:', error);
      throw error;
    }
  },

  // Azure Storage 연결 테스트 (백엔드를 통해 우회)
  testAzureStorageConnection: async () => {
    try {
      const response = await apiClient.post(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection/test/azure-storage`);
      return response.data;
    } catch (error) {
      console.error('Azure Storage 연결 테스트 실패:', error);
      throw error;
    }
  },

  // 모델 서비스 연결 테스트 (백엔드를 통해 우회)
  testModelServiceConnection: async () => {
    try {
      const response = await apiClient.post(`${PAINTING_SURFACE_API_BASE}/api/painting-surface/defect-detection/test/model-service`);
      return response.data;
    } catch (error) {
      console.error('모델 서비스 연결 테스트 실패:', error);
      throw error;
    }
  }
};
