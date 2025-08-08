import styled from 'styled-components';

export const IssueSelection = styled.div`
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

export const IssueTitle = styled.h2`
  color: #333;
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`;

export const IssueSubtitle = styled.p`
  color: #666;
  margin: 0 0 20px 0;
  text-align: center;
  line-height: 1.4;
  font-size: 14px;
`;

export const FilterSection = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
`;

export const FilterTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
`;

export const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
  align-items: center;
`;

export const FilterLabel = styled.span`
  font-size: 12px;
  color: #6c757d;
  min-width: 60px;
  font-weight: 500;
`;

export const FilterButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})`
  padding: 4px 12px;
  border: 1px solid #dee2e6;
  border-radius: 16px;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#495057'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#5a67d8' : '#e9ecef'};
  }
`;

export const IssueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
`;

export const IssueCard = styled.button`
  width: 100%;
  padding: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    border-color: #667eea;
    background-color: #f8f9ff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const IssueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const IssueIcon = styled.div`
  font-size: 24px;
`;

export const IssueName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

export const SeverityBadge = styled.div.withConfig({
  shouldForwardProp: (prop) => !['severity'].includes(prop),
})`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: ${props => {
    switch(props.severity) {
      case '매우높음': return '#dc3545';
      case '높음': return '#fd7e14';
      case '보통': return '#ffc107';
      case '낮음': return '#28a745';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

export const IssueDetails = styled.div`
  margin-bottom: 12px;
`;

export const IssueDesc = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 8px;
`;

export const IssueTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const IssueTag = styled.div`
  padding: 2px 6px;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 4px;
  font-size: 11px;
`;

export const UrgencyText = styled.div`
  font-size: 12px;
  color: #dc3545;
  font-weight: 600;
  margin-top: 8px;
`;