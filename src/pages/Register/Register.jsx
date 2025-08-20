import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { authAPI } from '../../api';

const StyledScreen = styled.div`
  align-items: center;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 40px 0px 0px;
  position: relative;

  .section {
    align-items: center;
    align-self: stretch;
    border: 0.3px solid;
    border-color: #dbe0e5;
    display: flex;
    height: 254px;
    justify-content: center;
    overflow: hidden;
    padding: 70px 0px 60px 200px;
    position: relative;
    width: 100%;
  }

  .container {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    padding: 10px 0px;
    position: relative;
    width: 510px;
  }

  .title-2 {
    align-self: stretch;
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 40px;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 48px;
    margin-top: -1.00px;
    position: relative;
  }

  .description {
    align-self: stretch;
    color: #607289;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 24px;
    position: relative;
  }

  .vector {
    height: 1px;
    left: 0;
    object-fit: cover;
    position: absolute;
    top: 254px;
    width: 1440px;
  }

  .image {
    height: 254px;
    margin-bottom: -60.00px;
    margin-left: -94px;
    margin-top: -70.00px;
    object-fit: cover;
    position: relative;
    width: 822px;
  }

  .form {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex: 0 0 auto;
    gap: 60px;
    justify-content: center;
    overflow: hidden;
    padding: 60px 170px 63px;
    position: relative;
    width: 100%;
  }

  .container-2 {
    align-items: flex-start;
    display: flex;
    flex: 1;
    flex-direction: column;
    flex-grow: 1;
    gap: 24px;
    position: relative;
  }

  .description-2 {
    align-self: stretch;
    color: #7f7f7f;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 24px;
    position: relative;
  }

  .register-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 400px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 20px;
  }

  .form-input {
    align-items: center;
    border: 1px solid #0000001a;
    border-radius: 6px;
    display: flex;
    padding: 12px 16px;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    background-color: #ffffff;
    transition: border-color 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #607289;
    box-shadow: 0 0 0 2px rgba(96, 114, 137, 0.1);
  }

  .form-input::placeholder {
    color: #00000080;
  }

  .submit-button {
    background-color: #000000;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 12px 24px;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex: 1;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #333333;
  }

  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 10px;
  }

  .error-message {
    background-color: #fee;
    color: #c92a2a;
    padding: 12px 16px;
    border-radius: 6px;
    border: 1px solid #ffc9c9;
    font-size: 14px;
    text-align: center;
    margin-bottom: 10px;
  }

  .success-message {
    background-color: #f0fff4;
    color: #22c55e;
    padding: 12px 16px;
    border-radius: 6px;
    border: 1px solid #bbf7d0;
    font-size: 14px;
    text-align: center;
    margin-bottom: 10px;
  }

  .img {
    height: 1px;
    left: 0;
    object-fit: cover;
    position: absolute;
    top: 450px;
    width: 1440px;
  }

  .container-wrapper {
    align-items: center;
    align-self: stretch;
    display: flex;
    gap: 60px;
    height: 190px;
    justify-content: center;
    padding: 60px;
    position: relative;
    width: 100%;
  }

  .container-3 {
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 60px;
    height: 100px;
    justify-content: center;
    margin-bottom: -15.00px;
    margin-top: -15.00px;
    position: relative;
  }

  .title-3 {
    align-self: stretch;
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 28px;
    margin-top: -1.00px;
    position: relative;
    text-align: center;
    width: 74px;
    cursor: pointer;
  }

  .title-4 {
    align-self: stretch;
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 28px;
    margin-top: -1.00px;
    position: relative;
    text-align: center;
    width: 148px;
    cursor: pointer;
  }
`;

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // 기본 유효성 검증
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      setError('모든 필드를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // 비밀번호 길이 검증
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      // 실제 회원가입 API 호출
      console.log('회원가입 요청 시작:', formData);
      
      const result = await authAPI.register(formData);
      
      if (result.success) {
        // 성공 처리
        console.log('회원가입 성공:', result.data);
        setSuccess(result.message);
        
        // 폼 초기화
        setFormData({
          name: '',
          email: '',
          password: '',
          department: ''
        });
      } else {
        // 에러 처리
        console.error('회원가입 실패:', result.error);
        setError(result.error);
      }
      
    } catch (err) {
      // 예상치 못한 에러 처리
      console.error('회원가입 중 예외 발생:', err);
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/home');
  };

  return (
    <StyledScreen data-model-id="register-page">
 
      <div className="section">
        <div className="container">
          <div className="title-2">회원가입</div>
          <p className="description">
            회원가입으로 AI 기반 공정 관리 서비스를 이용을 요청하세요.
          </p>
        </div>

        <img
          className="vector"
          alt="Vector"
          src="https://c.animaapp.com/0vnVVfRX/img/vector-200-1.svg"
        />

        <img
          className="image"
          alt="Image"
          src="https://c.animaapp.com/0vnVVfRX/img/-------.png"
        />
      </div>

      <div className="form">
        <div className="container-2">
          <div className="title-2">사용자 정보 입력</div>
          <div className="description-2">
            회원가입 후 관리자 승인을 받으면 시스템을 이용할 수 있습니다.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
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

          <div className="form-group">
            <label className="form-label" htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="홍길동"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@company.com"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="최소 6자 이상"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="department">부서 *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="생산관리팀"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? '가입 요청 중...' : '회원가입 요청'}
            </button>
          </div>
        </form>

        <img
          className="img"
          alt="Vector"
          src="https://c.animaapp.com/0vnVVfRX/img/vector-200-1.svg"
        />
      </div>

      <div className="container-wrapper">
        <div className="container-3">
          <div className="title-3">문의하기</div>
          <div className="title-4">개인정보처리방침</div>
          <div className="title-3">이용약관</div>
        </div>
      </div>
    </StyledScreen>
  );
};