// src/api/client.js
// 환경변수에서 API 베이스 URL 가져오기
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    // baseURL 처리 개선
    const url = endpoint;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('API 요청:', options.method || 'GET', url);
      console.log('환경:', process.env.NODE_ENV);
      console.log('Base URL:', this.baseURL);
      
      const response = await fetch(url, config);
      
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      console.log('API 응답 성공:', url, response.status);
      
      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // 나머지 메서드들은 그대로 유지...
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  async postFormData(endpoint, formData) {
    const token = localStorage.getItem('authToken');
    const headers = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// API 클라이언트 인스턴스 생성 및 내보내기
export const apiClient = new ApiClient(API_BASE_URL);

// 나머지 tokenUtils는 그대로...
export const tokenUtils = {
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },
  
  getToken: () => {
    return localStorage.getItem('authToken');
  },
  
  removeToken: () => {
    localStorage.removeItem('authToken');
  },
  
  isTokenValid: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      return true;
    } catch (error) {
      return false;
    }
  }
};