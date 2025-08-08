import styled, { keyframes, css } from 'styled-components';

// 🎨 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const typing = keyframes`
  0%, 60%, 100% {
    transform: initial;
  }
  30% {
    transform: translateY(-10px);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  height: 100%;
  max-height: 500px; /* 🔧 최대 높이 설정 */
`;

export const MessagesArea = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px; /* 🔧 최소 높이 설정 */
  max-height: 400px; /* 🔧 최대 높이 설정 */
  
  /* 🎨 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
  
  /* 🔧 스크롤 동작 최적화 */
  scroll-behavior: smooth;
`;

export const MessageBubble = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isUser'].includes(prop),
})`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  white-space: pre-wrap;
  animation: ${fadeIn} 0.3s ease-out; /* 🎨 등장 애니메이션 */
  position: relative;
  
  /* 🎨 메시지 시간 스타일 */
  .message-content {
    margin-bottom: 4px;
    line-height: 1.4;
  }
  
  .message-time {
    font-size: 11px;
    opacity: 0.7;
    text-align: ${props => props.isUser ? 'right' : 'left'};
    margin-top: 4px;
  }
  
  ${props => props.isUser ? css`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    align-self: flex-end;
    margin-left: auto;
    border-bottom-right-radius: 4px;
    
    /* 🎨 말풍선 꼬리 효과 */
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -8px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-left-color: #764ba2;
      border-bottom: none;
      border-right: none;
    }
  ` : css`
    background: white;
    color: #333;
    align-self: flex-start;
    border: 1px solid #e1e5e9;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    animation: ${slideIn} 0.3s ease-out;
    
    /* 🎨 말풍선 꼬리 효과 */
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -8px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-right-color: white;
      border-bottom: none;
      border-left: none;
    }
  `}
  
  /* 🎨 로딩 메시지 스타일 */
  &.loading-message {
    background: #f1f3f4;
    border: 1px dashed #9aa0a6;
    animation: ${fadeIn} 0.5s ease-out;
    
    &::after {
      border-right-color: #f1f3f4;
    }
  }
`;

export const ChatInputArea = styled.div`
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e1e5e9;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05); /* 🎨 상단 그림자 */
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 1px solid #e1e5e9;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
  
  &::placeholder {
    color: #9aa0a6;
  }
  
  &:disabled {
    background: #f1f3f4;
    color: #9aa0a6;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

/* 🎨 타이핑 인디케이터 스타일 */
export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  
  .typing-dots {
    display: flex;
    gap: 4px;
    
    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #9aa0a6;
      animation: ${typing} 1.4s infinite ease-in-out;
      
      &:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      &:nth-child(2) {
        animation-delay: -0.16s;
      }
      
      &:nth-child(3) {
        animation-delay: 0s;
      }
    }
  }
`;

/* 🎨 메시지 상태 인디케이터 */
export const MessageStatus = styled.div`
  font-size: 12px;
  color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.7)' : '#9aa0a6'};
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  .status-icon {
    font-size: 10px;
  }
`;