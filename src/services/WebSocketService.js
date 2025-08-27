// src/services/WebSocketService.js

class WebSocketService {
  constructor() {
    // ✅ 기존: 이상 알림용 WebSocket (그대로 유지)
    this.defectWs = null;
    this.defectListeners = [];
    
    // ✨ 새로 추가: 모니터링 차트용 WebSocket
    this.monitoringWs = null;
    this.monitoringListeners = [];
    
    // 공통 설정
    this.reconnectInterval = 5000; // 5초마다 재연결 시도
    this.maxReconnectAttempts = 10;
    this.defectReconnectAttempts = 0;
    this.monitoringReconnectAttempts = 0;
    this.isDefectConnecting = false;
    this.isMonitoringConnecting = false;
  }

  /**
   * ✅ 기존: 이상 알림용 WebSocket 연결 (그대로 유지)
   */
  connect() {
    this.connectDefectNotifications();
  }

  /**
   * ✨ 새로 추가: 모니터링 차트용 WebSocket 연결
   */
  connectMonitoring() {
    if (this.monitoringWs && this.monitoringWs.readyState === WebSocket.OPEN) {
      console.log('⚠️ 모니터링 WebSocket이 이미 연결되어 있습니다.');
      return;
    }

    if (this.isMonitoringConnecting) {
      console.log('⚠️ 모니터링 WebSocket 연결 시도 중입니다.');
      return;
    }

    this.isMonitoringConnecting = true;
    
    try {
      // Spring Boot 모니터링 WebSocket 엔드포인트에 연결
      this.monitoringWs = new WebSocket('ws://localhost:8089/ws/monitoring-data');
      
      this.monitoringWs.onopen = this.onMonitoringOpen.bind(this);
      this.monitoringWs.onmessage = this.onMonitoringMessage.bind(this);
      this.monitoringWs.onclose = this.onMonitoringClose.bind(this);
      this.monitoringWs.onerror = this.onMonitoringError.bind(this);
      
    } catch (error) {
      console.error('❌ 모니터링 WebSocket 연결 실패:', error);
      this.isMonitoringConnecting = false;
    }
  }

  /**
   * ✅ 기존: 이상 알림용 WebSocket 연결 (그대로 유지)
   */
  connectDefectNotifications() {
    if (this.defectWs && this.defectWs.readyState === WebSocket.OPEN) {
      console.log('⚠️ 이상 알림 WebSocket이 이미 연결되어 있습니다.');
      return;
    }

    if (this.isDefectConnecting) {
      console.log('⚠️ 이상 알림 WebSocket 연결 시도 중입니다.');
      return;
    }

    this.isDefectConnecting = true;
    
    try {
      // Spring Boot 이상 알림 WebSocket 엔드포인트에 연결
      this.defectWs = new WebSocket('ws://localhost:8089/ws/defect-notifications');
      
      this.defectWs.onopen = this.onDefectOpen.bind(this);
      this.defectWs.onmessage = this.onDefectMessage.bind(this);
      this.defectWs.onclose = this.onDefectClose.bind(this);
      this.defectWs.onerror = this.onDefectError.bind(this);
      
    } catch (error) {
      console.error('❌ 이상 알림 WebSocket 연결 실패:', error);
      this.isDefectConnecting = false;
    }
  }

  /**
   * ✨ 모니터링 WebSocket 연결 성공
   */
  onMonitoringOpen() {
    console.log('✅ 모니터링 WebSocket 연결 성공!');
    this.isMonitoringConnecting = false;
    this.monitoringReconnectAttempts = 0;
    
    // 연결 성공 이벤트 전파
    this.notifyMonitoringListeners({
      type: 'CONNECTION_STATUS',
      data: { connected: true, message: '모니터링 WebSocket 연결 성공' }
    });
  }

  /**
   * ✅ 기존: 이상 알림 WebSocket 연결 성공 (그대로 유지)
   */
  onDefectOpen() {
    console.log('✅ 이상 알림 WebSocket 연결 성공!');
    this.isDefectConnecting = false;
    this.defectReconnectAttempts = 0;
    
    // 연결 성공 이벤트 전파
    this.notifyDefectListeners({
      type: 'CONNECTION_STATUS',
      data: { connected: true, message: '이상 알림 WebSocket 연결 성공' }
    });
  }

  /**
   * ✨ 모니터링 WebSocket 메시지 수신
   */
  onMonitoringMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('📊 모니터링 데이터 수신:', data);
      
      // 모든 모니터링 리스너에게 메시지 전파
      this.notifyMonitoringListeners({
        type: 'MONITORING_DATA',
        data: data
      });
      
    } catch (error) {
      console.error('❌ 모니터링 메시지 파싱 오류:', error);
    }
  }

  /**
   * ✅ 기존: 이상 알림 WebSocket 메시지 수신 (그대로 유지)
   */
  onDefectMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('📨 이상 알림 메시지 수신:', data);
      
      // 모든 이상 알림 리스너에게 메시지 전파
      this.notifyDefectListeners({
        type: 'MESSAGE',
        data: data
      });
      
    } catch (error) {
      console.error('❌ 이상 알림 메시지 파싱 오류:', error);
    }
  }

  /**
   * ✨ 모니터링 WebSocket 연결 종료
   */
  onMonitoringClose(event) {
    console.log('🔌 모니터링 WebSocket 연결 종료:', event.code, event.reason);
    this.isMonitoringConnecting = false;
    
    // 연결 종료 이벤트 전파
    this.notifyMonitoringListeners({
      type: 'CONNECTION_STATUS',
      data: { connected: false, message: '모니터링 WebSocket 연결 종료' }
    });
    
    // 자동 재연결 시도
    this.attemptMonitoringReconnect();
  }

  /**
   * ✅ 기존: 이상 알림 WebSocket 연결 종료 (그대로 유지)
   */
  onDefectClose(event) {
    console.log('🔌 이상 알림 WebSocket 연결 종료:', event.code, event.reason);
    this.isDefectConnecting = false;
    
    // 연결 종료 이벤트 전파
    this.notifyDefectListeners({
      type: 'CONNECTION_STATUS',
      data: { connected: false, message: '이상 알림 WebSocket 연결 종료' }
    });
    
    // 자동 재연결 시도
    this.attemptDefectReconnect();
  }

  /**
   * ✨ 모니터링 WebSocket 오류 발생
   */
  onMonitoringError(error) {
    console.error('❌ 모니터링 WebSocket 오류:', error);
    this.isMonitoringConnecting = false;
    
    // 오류 이벤트 전파
    this.notifyMonitoringListeners({
      type: 'ERROR',
      data: { error: error, message: '모니터링 WebSocket 연결 오류' }
    });
  }

  /**
   * ✅ 기존: 이상 알림 WebSocket 오류 발생 (그대로 유지)
   */
  onDefectError(error) {
    console.error('❌ 이상 알림 WebSocket 오류:', error);
    this.isDefectConnecting = false;
    
    // 오류 이벤트 전파
    this.notifyDefectListeners({
      type: 'ERROR',
      data: { error: error, message: '이상 알림 WebSocket 연결 오류' }
    });
  }

  /**
   * ✨ 모니터링 WebSocket 자동 재연결 시도
   */
  attemptMonitoringReconnect() {
    if (this.monitoringReconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ 모니터링 WebSocket 재연결 포기 (최대 시도 횟수 초과)');
      return;
    }

    this.monitoringReconnectAttempts++;
    console.log(`🔄 모니터링 WebSocket 재연결 시도 ${this.monitoringReconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      this.connectMonitoring();
    }, this.reconnectInterval);
  }

  /**
   * ✅ 기존: 이상 알림 WebSocket 자동 재연결 시도 (그대로 유지)
   */
  attemptDefectReconnect() {
    if (this.defectReconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ 이상 알림 WebSocket 재연결 포기 (최대 시도 횟수 초과)');
      return;
    }

    this.defectReconnectAttempts++;
    console.log(`🔄 이상 알림 WebSocket 재연결 시도 ${this.defectReconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      this.connectDefectNotifications();
    }, this.reconnectInterval);
  }

  /**
   * ✨ 모니터링 메시지 리스너 등록
   */
  addMonitoringListener(callback) {
    this.monitoringListeners.push(callback);
    
    // 리스너 제거 함수 반환
    return () => {
      this.monitoringListeners = this.monitoringListeners.filter(listener => listener !== callback);
    };
  }

  /**
   * ✅ 기존: 이상 알림 메시지 리스너 등록 (그대로 유지)
   */
  addListener(callback) {
    this.defectListeners.push(callback);
    
    // 리스너 제거 함수 반환
    return () => {
      this.defectListeners = this.defectListeners.filter(listener => listener !== callback);
    };
  }

  /**
   * ✨ 모든 모니터링 리스너에게 이벤트 전파
   */
  notifyMonitoringListeners(event) {
    this.monitoringListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('❌ 모니터링 리스너 오류:', error);
      }
    });
  }

  /**
   * ✅ 기존: 모든 이상 알림 리스너에게 이벤트 전파 (그대로 유지)
   */
  notifyDefectListeners(event) {
    this.defectListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('❌ 이상 알림 리스너 오류:', error);
      }
    });
  }

  /**
   * ✨ 모니터링 WebSocket 연결 해제
   */
  disconnectMonitoring() {
    if (this.monitoringWs) {
      this.monitoringWs.close();
      this.monitoringWs = null;
    }
    this.monitoringListeners = [];
    this.monitoringReconnectAttempts = 0;
    console.log('🔌 모니터링 WebSocket 연결 해제');
  }

  /**
   * ✅ 기존: 이상 알림 WebSocket 연결 해제 (그대로 유지)
   */
  disconnect() {
    if (this.defectWs) {
      this.defectWs.close();
      this.defectWs = null;
    }
    this.defectListeners = [];
    this.defectReconnectAttempts = 0;
    console.log('🔌 이상 알림 WebSocket 연결 해제');
  }

  /**
   * ✨ 모든 WebSocket 연결 해제
   */
  disconnectAll() {
    this.disconnect();
    this.disconnectMonitoring();
  }

  /**
   * ✨ 모니터링 WebSocket 연결 상태 확인
   */
  isMonitoringConnected() {
    return this.monitoringWs && this.monitoringWs.readyState === WebSocket.OPEN;
  }

  /**
   * ✅ 기존: 이상 알림 WebSocket 연결 상태 확인 (그대로 유지)
   */
  isConnected() {
    return this.defectWs && this.defectWs.readyState === WebSocket.OPEN;
  }

  /**
   * ✨ 모니터링 메시지 전송 (필요시)
   */
  sendMonitoringMessage(message) {
    if (this.isMonitoringConnected()) {
      this.monitoringWs.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ 모니터링 WebSocket이 연결되지 않음. 메시지 전송 실패');
    }
  }

  /**
   * ✅ 기존: 이상 알림 메시지 전송 (그대로 유지)
   */
  send(message) {
    if (this.isConnected()) {
      this.defectWs.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ 이상 알림 WebSocket이 연결되지 않음. 메시지 전송 실패');
    }
  }

  /**
   * ✨ 전체 연결 상태 확인
   */
  getConnectionStatus() {
    return {
      defectNotifications: this.isConnected(),
      monitoring: this.isMonitoringConnected(),
      allConnected: this.isConnected() && this.isMonitoringConnected()
    };
  }
}

// 싱글톤 인스턴스 생성
const webSocketService = new WebSocketService();

export default webSocketService;