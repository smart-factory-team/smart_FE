import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledList = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-height: 328px;  /* height를 min-height로 변경 */
  justify-content: center;
  position: relative;
  width: 520px;

  & .row {
    align-items: flex-start;
    align-self: stretch;
    display: flex;
    flex: 0 0 auto;
    gap: 80px;
    position: relative;
    width: 100%;
  }

  & .input {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
    position: relative;
    width: 520px;
  }

  & .title {
    align-self: stretch;
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 20px;
    margin-top: -1.00px;
    position: relative;
  }

  & .textfield {
    align-items: center;
    align-self: stretch;
    background-color: #ffffff;
    border: 1px solid;
    border-color: #0000001a;
    border-radius: 6px;
    display: flex;
    flex: 0 0 auto;
    gap: 4px;
    padding: 8px 12px;
    position: relative;
    width: 100%;
  }

  & .text-input {
    flex: 1;
    border: none;
    outline: none;
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    background: transparent;
  }

  & .text-input::placeholder {
    color: #00000080;
  }

  & .login-button {
    all: unset;
    align-items: flex-start;
    align-self: stretch;
    box-sizing: border-box;
    display: flex;
    gap: 12px;
    height: 48px;
    position: relative;
    width: 100%;
    cursor: pointer;
  }

  & .primary {
    align-items: center;
    background-color: #000000;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;
    position: relative;
    width: 520px;
    transition: background-color 0.2s ease;
  }

  & .primary:hover {
    background-color: #333333;
  }

  & .primary:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  & .text-wrapper {
    color: #ffffff;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 24px;
    margin-top: -1.00px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
  }

  & .footer-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 508px;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 24px;
  }

  & .link-text {
    color: #8f8f8f;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  & .link-text:hover {
    color: #000000;
  }

  & .divider {
    color: #8f8f8f;
  }

  & .register-button {
    color: #000000;
    cursor: pointer;
    transition: color 0.2s ease;
    font-weight: 600;
  }

  & .register-button:hover {
    color: #607289;
  }

  & .error-message {
    background-color: #fee;
    color: #c92a2a;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ffc9c9;
    font-size: 14px;
    text-align: center;
    margin-bottom: 10px;  /* margin-top 제거 */
    width: 100%;
    box-sizing: border-box;
  }

  & .success-message {
    background-color: #e6fffa;
    color: #047857;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #a7f3d0;
    font-size: 14px;
    text-align: center;
    margin-bottom: 10px;  /* margin-top 제거 */
    width: 100%;
    box-sizing: border-box;
  }

  & .admin-hint {
    background-color: #f0f9ff;
    color: #0369a1;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #bae6fd;
    font-size: 12px;
    text-align: center;
    margin-bottom: 10px;  /* margin-top 제거 */
    width: 100%;
    box-sizing: border-box;
  }
`;

export const List = ({ className }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 하드코딩된 관리자 계정
  const ADMIN_CREDENTIALS = {
    email: 'admin',
    password: 'admin123'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 메시지 초기화
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // 기본 유효성 검증
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // 관리자 계정 확인 (하드코딩)
      if (formData.email === ADMIN_CREDENTIALS.email && 
          formData.password === ADMIN_CREDENTIALS.password) {
        
        setSuccess('관리자로 로그인 중...');
        
        // 토큰 저장 (관리자용)
        localStorage.setItem('authToken', 'admin-token-12345');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', 'admin');
        
        // 잠시 대기 후 관리자 페이지로 리다이렉트
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('관리자 로그인 성공!');
        navigate('/admin/users');
        return;
      }

      // 일반 사용자 로그인 (나중에 실제 API로 교체)
      console.log('일반 사용자 로그인 시도:', formData);
      
      // Mock 로그인 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 일반 사용자 로그인 성공 시 대시보드로 이동
      setSuccess('로그인 성공!');
      
      // 토큰 저장 (일반 사용자용)
      localStorage.setItem('authToken', 'user-token-67890');
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userEmail', formData.email);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/dashboard');
      
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    // TODO: 비밀번호 찾기 기능 구현
    console.log('비밀번호 찾기');
    alert('비밀번호 찾기 기능은 추후 구현 예정입니다.');
  };

  return (
    <StyledList className={`list ${className}`}>
      {/* 관리자 계정 힌트 */}
      {/* <div className="admin-hint">
        💡 관리자 테스트: admin / admin123
      </div> */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="row">
        <div className="input">
          <div className="title">이메일</div>
          <div className="textfield">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일 또는 아이디를 입력하세요"
              className="text-input"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="input">
          <div className="title">비밀번호</div>
          <div className="textfield">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              className="text-input"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <button 
        className="login-button" 
        onClick={handleLogin}
        disabled={isLoading}
      >
        <div className="primary">
          <div className="text-wrapper">
            {isLoading ? '로그인 중...' : '로그인'}
          </div>
        </div>
      </button>

      <div className="footer-links">
        <span 
          className="link-text"
          onClick={handleForgotPassword}
        >
          비밀번호 찾기
        </span>
        <span className="divider">|</span>
        <span 
          className="register-button"
          onClick={handleRegisterClick}
        >
          회원가입
        </span>
      </div>
    </StyledList>
  );
};