// src/services/PaintingWebSocketService.js

class PaintingWebSocketService {
  constructor() {
    // ✨ 모니터링 차트용 WebSocket
    this.monitoringWs = null;
    this.monitoringListeners = [];
    
    // 공통 설정
    this.reconnectInterval = 5000; // 5초마다 재연결 시도
    this.maxReconnectAttempts = 10;
    this.monitoringReconnectAttempts = 0;
    this.isMonitoringConnecting = false;
  }

  /**
   * ✨ 모니터링 차트용 WebSocket 연결
   */
  paintingConnectMonitoring(url) {
    if (this.monitoringWs && this.monitoringWs.readyState === WebSocket.OPEN) {
      console.log('⚠️ 모니터링 WebSocket이 이미 연결되어 있습니다.');
      return;
    }

    if (this.isMonitoringConnecting) {
      console.log('⚠️ 모니터링 WebSocket 연결 시도 중입니다.');
      return;
    }

    this.isMonitoringConnecting = true;
    this.monitoringUrl = url;
    
    try {
      // Spring Boot 모니터링 WebSocket 엔드포인트에 연결
      this.monitoringWs = new WebSocket(url);
      
      this.monitoringWs.onopen = this.onPaintingMonitoringOpen.bind(this);
      this.monitoringWs.onmessage = this.onPaintingMonitoringMessage.bind(this);
      this.monitoringWs.onclose = this.onPaintingMonitoringClose.bind(this);
      this.monitoringWs.onerror = this.onPaintingMonitoringError.bind(this);
      
    } catch (error) {
      console.error('❌ 모니터링 WebSocket 연결 실패:', error);
      this.isMonitoringConnecting = false;
    }
  }

  /**
   * ✨ 모니터링 WebSocket 연결 성공
   */
  onPaintingMonitoringOpen() {
    console.log('✅ 모니터링 WebSocket 연결 성공!');
    this.isMonitoringConnecting = false;
    this.monitoringReconnectAttempts = 0;
    
    // 연결 성공 이벤트 전파
    this.notifyPaintingMonitoringListeners({
      type: 'CONNECTION_STATUS',
      data: { connected: true, message: '모니터링 WebSocket 연결 성공' }
    });
  }

  /**
   * ✨ 모니터링 WebSocket 메시지 수신
   */
  onPaintingMonitoringMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      // 모든 모니터링 리스너에게 메시지 전파
      this.notifyPaintingMonitoringListeners({
        type: 'MONITORING_DATA',
        data: data
      });
      
    } catch (error) {
      console.error('❌ 모니터링 메시지 파싱 오류:', error);
    }
  }

  /**
   * ✨ 모니터링 WebSocket 연결 종료
   */
  onPaintingMonitoringClose(event) {
    console.log('🔌 모니터링 WebSocket 연결 종료:', event.code, event.reason);
    this.isMonitoringConnecting = false;
    
    // 연결 종료 이벤트 전파
    this.notifyPaintingMonitoringListeners({
      type: 'CONNECTION_STATUS',
      data: { connected: false, message: '모니터링 WebSocket 연결 종료' }
    });
    
    // 자동 재연결 시도
    this.attemptPaintingMonitoringReconnect();
  }

  /**
   * ✨ 모니터링 WebSocket 오류 발생
   */
  onPaintingMonitoringError(error) {
    console.error('❌ 모니터링 WebSocket 오류:', error);
    this.isMonitoringConnecting = false;
    
    // 오류 이벤트 전파
    this.notifyPaintingMonitoringListeners({
      type: 'ERROR',
      data: { error: error, message: '모니터링 WebSocket 연결 오류' }
    });
  }

  /**
   * ✨ 모니터링 WebSocket 자동 재연결 시도
   */
  attemptPaintingMonitoringReconnect() {
    if (this.monitoringReconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ 모니터링 WebSocket 재연결 포기 (최대 시도 횟수 초과)');
      return;
    }

    this.monitoringReconnectAttempts++;
    console.log(`🔄 모니터링 WebSocket 재연결 시도 ${this.monitoringReconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      this.paintingConnectMonitoring(this.monitoringUrl);
    }, this.reconnectInterval);
  }

  /**
   * ✨ 모니터링 메시지 리스너 등록
   */
  paintingAddMonitoringListener(callback) {
    this.monitoringListeners.push(callback);
    
    // 리스너 제거 함수 반환
    return () => {
      this.monitoringListeners = this.monitoringListeners.filter(listener => listener !== callback);
    };
  }

  /**
   * ✨ 모든 모니터링 리스너에게 이벤트 전파
   */
  notifyPaintingMonitoringListeners(event) {
    this.monitoringListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('❌ 모니터링 리스너 오류:', error);
      }
    });
  }

  /**
   * ✨ 모니터링 WebSocket 연결 해제
   */
  paintingDisconnectMonitoring() {
    if (this.monitoringWs) {
      this.monitoringWs.close();
      this.monitoringWs = null;
    }
    this.monitoringListeners = [];
    this.monitoringReconnectAttempts = 0;
    console.log('🔌 모니터링 WebSocket 연결 해제');
  }
}

// 싱글톤 인스턴스 생성
const paintingWebSocketService = new PaintingWebSocketService();

export default paintingWebSocketService;
