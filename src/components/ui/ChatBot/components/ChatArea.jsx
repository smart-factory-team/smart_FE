import React, { useRef, useEffect } from 'react';
import {
  ChatContent,
  MessagesArea,
  MessageBubble,
  ChatInputArea,
  ChatInput,
  SendButton,
  TypingIndicator
} from '../styles/ChatStyles';

export const ChatArea = ({ 
  messages, 
  inputValue, 
  isLoading,
  onInputChange, 
  onSendMessage, 
  onKeyPress 
}) => {
  // 🔧 스크롤 참조 추가
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);

  // 🔧 자동 스크롤 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  // 🔧 메시지가 변경될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 🔧 컴포넌트가 마운트될 때도 스크롤
  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <ChatContent>
      <MessagesArea ref={messagesAreaRef}>
        {messages.map((message) => (
          <MessageBubble key={message.id} isUser={message.isUser}>
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-time">
              {new Date(message.timestamp || Date.now()).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </MessageBubble>
        ))}
        
        {isLoading && (
          <MessageBubble isUser={false} className="loading-message">
            <TypingIndicator>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              응답을 생성하고 있습니다...
            </TypingIndicator>
          </MessageBubble>
        )}
        
        {/* 🔧 스크롤 타겟 - 항상 맨 아래에 위치 */}
        <div ref={messagesEndRef} />
      </MessagesArea>

      <ChatInputArea>
        <ChatInput
          type="text"
          placeholder="메시지를 입력하세요..."
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          disabled={isLoading}
          autoComplete="off"
        />
        <SendButton
          onClick={onSendMessage}
          disabled={isLoading || !inputValue.trim()}
          title="메시지 전송"
        >
          ➤
        </SendButton>
      </ChatInputArea>
    </ChatContent>
  );
};