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

  /* 약관 동의 관련 스타일 추가 */
  .terms-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid #0000001a;
    border-radius: 6px;
    padding: 20px;
    background-color: #fafafa;
  }

  .terms-title {
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 24px;
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .checkbox-input {
    width: 18px;
    height: 18px;
    accent-color: #000000;
    cursor: pointer;
  }

  .checkbox-label {
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 20px;
    cursor: pointer;
    flex: 1;
  }

  .checkbox-label.required::after {
    content: " *";
    color: #e03131;
  }

  .terms-link {
    color: #607289;
    text-decoration: underline;
    cursor: pointer;
  }

  .terms-link:hover {
    color: #000000;
  }

  /* 모달 스타일 추가 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #ffffff;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    padding: 20px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    color: #000000;
    font-family: "Roboto", Helvetica;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 24px;
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    color: #000;
  }

  .modal-body {
    padding: 20px;
    overflow-y: auto;
    max-height: calc(80vh - 120px);
    color: #333;
    font-family: "Roboto", Helvetica;
    font-size: 14px;
    line-height: 1.6;
  }

  .modal-body h3 {
    color: #000;
    font-weight: 600;
    margin: 20px 0 10px 0;
  }

  .modal-body p {
    margin: 10px 0;
  }

  .modal-body ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  .modal-body li {
    margin: 5px 0;
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
  
  // 약관 동의 상태 추가
  const [agreements, setAgreements] = useState({
    serviceTerms: false,
    privacyPolicy: false
  });
  
  // 모달 상태 추가
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'terms' 또는 'privacy'
  
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

  // 약관 동의 체크박스 핸들러 추가
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({
      ...prev,
      [name]: checked
    }));
    // 체크 시 메시지 초기화
    if (error) setError('');
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

    // 약관 동의 검증 추가
    if (!agreements.serviceTerms || !agreements.privacyPolicy) {
      setError('필수 약관에 동의해주세요.');
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
      console.log('약관 동의 정보:', agreements);
      
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
        setAgreements({
          serviceTerms: false,
          privacyPolicy: false
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

  // 약관 페이지로 이동하는 함수를 모달 열기로 변경
  const handleTermsClick = () => {
    setModalType('terms');
    setModalOpen(true);
  };

  const handlePrivacyClick = () => {
    setModalType('privacy');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalType('');
  };

  // 모달 컨텐츠 렌더링
  const renderModalContent = () => {
    if (modalType === 'terms') {
      return (
        <div>
          <h3>제1조 (목적)</h3>
          <p>이 약관은 AI 기반 자동차 스마트 팩토리 공정별 결함 탐지 및 모니터링 서비스(이하 "서비스")를 제공하는 회사(이하 "회사")와 이용자 간의 서비스 이용에 관한 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
          
          <h3>제2조 (정의)</h3>
          <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
          <ul>
            <li>"서비스"라 함은 회사가 제공하는 AI 기반 공정 관리 시스템을 말합니다.</li>
            <li>"이용자"라 함은 회사의 약관에 동의하고 서비스를 이용하는 회원을 말합니다.</li>
            <li>"회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 서비스의 정보를 지속적으로 제공받으며 서비스를 계속 이용할 수 있는 자를 말합니다.</li>
          </ul>
          
          <h3>제3조 (서비스의 제공)</h3>
          <p>회사는 다음과 같은 서비스를 제공합니다:</p>
          <ul>
            <li>AI 기반 공정 관리 및 모니터링 서비스</li>
            <li>데이터 분석 및 리포트 제공 서비스</li>
            <li>기타 회사가 정하는 서비스</li>
          </ul>
          
          <h3>제4조 (회원가입)</h3>
          <p>서비스 이용을 희망하는 자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</p>
          
          <h3>제5조 (개인정보보호)</h3>
          <p>회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력하며, 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.</p>
          
          <h3>제6조 (서비스 이용제한)</h3>
          <p>회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다:</p>
          <ul>
            <li>타인의 정보를 도용하여 가입한 경우</li>
            <li>서비스의 안정적 운영을 방해한 경우</li>
            <li>기타 관련 법령을 위반한 경우</li>
          </ul>
        </div>
      );
    } else if (modalType === 'privacy') {
      return (
        <div>
          <h3>1. 개인정보의 처리 목적</h3>
          <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
          <ul>
            <li>서비스 제공 및 계약의 이행</li>
            <li>회원 관리 및 본인 확인</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
            <li>고충처리 및 문의사항 응답</li>
          </ul>
          
          <h3>2. 처리하는 개인정보의 항목</h3>
          <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
          <ul>
            <li>필수항목: 이름, 이메일, 비밀번호, 소속 부서</li>
            <li>자동 수집항목: 접속 IP 정보, 쿠키, 접속 로그, 서비스 이용기록</li>
          </ul>
          
          <h3>3. 개인정보의 처리 및 보유기간</h3>
          <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다:</p>
          <ul>
            <li>회원가입 및 관리: 회원탈퇴 시까지</li>
            <li>서비스 제공: 서비스 제공계약 완료 시까지</li>
            <li>관계법령에 따른 보존: 해당 법령에서 정한 기간</li>
          </ul>
          
          <h3>4. 개인정보의 제3자 제공</h3>
          <p>회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
          <ul>
            <li>정보주체가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
          
          <h3>5. 개인정보처리의 위탁</h3>
          <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
          <ul>
            <li>위탁받는 자: 클라우드 서비스 제공업체</li>
            <li>위탁하는 업무의 내용: 데이터 저장 및 백업</li>
          </ul>
          
          <h3>6. 정보주체의 권리·의무 및 행사방법</h3>
          <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
          <ul>
            <li>개인정보 처리정지 요구권</li>
            <li>개인정보 열람요구권</li>
            <li>개인정보 정정·삭제요구권</li>
            <li>개인정보 처리정지 요구권</li>
          </ul>
        </div>
      );
    }
    return null;
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

          {/* 약관 동의 섹션 추가 */}
          <div className="terms-section">
            <div className="terms-title">약관 동의</div>
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="serviceTerms"
                  name="serviceTerms"
                  checked={agreements.serviceTerms}
                  onChange={handleAgreementChange}
                  className="checkbox-input"
                  disabled={isLoading}
                />
                <label htmlFor="serviceTerms" className="checkbox-label required">
                  <span className="terms-link" onClick={handleTermsClick}>
                    서비스 이용약관
                  </span>
                  에 동의합니다
                </label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="privacyPolicy"
                  name="privacyPolicy"
                  checked={agreements.privacyPolicy}
                  onChange={handleAgreementChange}
                  className="checkbox-input"
                  disabled={isLoading}
                />
                <label htmlFor="privacyPolicy" className="checkbox-label required">
                  <span className="terms-link" onClick={handlePrivacyClick}>
                    개인정보 처리방침
                  </span>
                  에 동의합니다
                </label>
              </div>
            </div>
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

      {/* 모달 추가 */}
      {modalOpen && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalType === 'terms' ? '서비스 이용약관' : '개인정보 처리방침'}
              </h2>
              <button className="modal-close" onClick={handleModalClose}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </StyledScreen>
  );
};