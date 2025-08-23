// src/api/index.js
export { apiClient, tokenUtils } from './client';
export { authAPI } from './auth';
export {userAPI} from './user'; 
export { paintingSurfaceDefectAPI } from './paintingSurfaceDefect';  // 추가
// 필요한 경우 다른 API 모듈들도 여기서 export
// export { monitoringAPI } from './monitoring';
// export { boardAPI } from './board';
// export { settingsAPI } from './settings';