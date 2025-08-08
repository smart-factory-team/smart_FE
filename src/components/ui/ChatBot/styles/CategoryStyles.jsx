import styled from 'styled-components';

export const CategorySelection = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(80vh - 120px);
  
  @media (max-height: 600px) {
    padding: 15px;
    max-height: calc(100vh - 200px);
  }
`;

export const CategoryTitle = styled.h2`
  color: #333;
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
`;

export const CategorySubtitle = styled.p`
  color: #666;
  margin: 0 0 25px 0;
  text-align: center;
  line-height: 1.4;
  font-size: 14px;
`;

export const CategoryList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

export const CategoryOption = styled.button`
  width: 100%;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    border-color: #667eea;
    background-color: #f8f9ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const CategoryIcon = styled.div`
  font-size: 20px;
  margin-bottom: 6px;
`;

export const CategoryName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

export const CategoryDesc = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.3;
`;