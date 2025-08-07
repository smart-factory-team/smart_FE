import styled from 'styled-components';

export const ChatWindow = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen'].includes(prop),
})`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 400px;
  max-height: 80vh;
  height: auto;
  min-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
  
  @media (max-height: 700px) {
    max-height: 70vh;
    min-height: 400px;
  }
  
  @media (max-height: 600px) {
    bottom: 20px;
    max-height: calc(100vh - 100px);
    min-height: 350px;
  }
`;

// 다른 컴포넌트들은 그대로 유지
export const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1500;
`;

export const ChatBotButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const BotIcon = styled.div`
  font-size: 24px;
  color: white;
`;

export const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

export const SessionInfo = styled.div`
  padding: 10px 20px;
  background-color: #e8f2ff;
  border-bottom: 1px solid #b8d4f0;
  font-size: 12px;
  color: #1976d2;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #667eea;
  font-size: 14px;
  padding: 15px;
  margin-top: 10px;
  background-color: #f8f9ff;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  
  &:after {
    content: '●●●';
    animation: loading 1.4s infinite;
    font-size: 8px;
  }
  
  @keyframes loading {
    0%, 60%, 100% { opacity: 1; }
    30% { opacity: 0.3; }
  }
`;

export const BackButton = styled.button`
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
  align-self: flex-start;
  
  &:hover {
    background: #5a6268;
  }
`;