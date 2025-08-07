import React from 'react';
import {
  IssueSelection as StyledIssueSelection,
  IssueTitle,
  IssueSubtitle,
  FilterSection,
  FilterTitle,
  FilterRow,
  FilterLabel,
  FilterButton,
  IssueList,
  IssueCard,
  IssueHeader,
  IssueIcon,
  IssueName,
  SeverityBadge,
  IssueDetails,
  IssueDesc,
  IssueTags,
  IssueTag,
  UrgencyText
} from '../styles/IssueStyles';
import { LoadingIndicator, BackButton } from '../styles/ChatBotStyles';

export const IssueSelection = ({ 
  selectedCategory,
  filteredIssues,
  issueFilters,
  isLoading,
  onBack,
  onIssueFilter,
  onIssueSelect
}) => {
  return (
    <StyledIssueSelection>
      <BackButton onClick={onBack}>
        ← 카테고리 선택으로 돌아가기
      </BackButton>
      
      <IssueTitle>🔍 감지된 이슈 선택</IssueTitle>
      <IssueSubtitle>
        {selectedCategory?.name} 전문가가 분석할<br />
        이슈를 선택해주세요.
      </IssueSubtitle>

      {/* 필터 섹션 */}
      <FilterSection>
        <FilterTitle>🔧 필터 옵션</FilterTitle>
        
        <FilterRow>
          <FilterLabel>공정:</FilterLabel>
          <FilterButton 
            active={issueFilters.process === 'all'} 
            onClick={() => onIssueFilter('process', 'all')}
          >
            전체
          </FilterButton>
          <FilterButton 
            active={issueFilters.process === '용접 공정'} 
            onClick={() => onIssueFilter('process', '용접 공정')}
          >
            용접 공정
          </FilterButton>
        </FilterRow>

        <FilterRow>
          <FilterLabel>감지유형:</FilterLabel>
          <FilterButton 
            active={issueFilters.detectionType === 'all'} 
            onClick={() => onIssueFilter('detectionType', 'all')}
          >
            전체
          </FilterButton>
          <FilterButton 
            active={issueFilters.detectionType === '전류'} 
            onClick={() => onIssueFilter('detectionType', '전류')}
          >
            전류
          </FilterButton>
          <FilterButton 
            active={issueFilters.detectionType === '진동'} 
            onClick={() => onIssueFilter('detectionType', '진동')}
          >
            진동
          </FilterButton>
          <FilterButton 
            active={issueFilters.detectionType === '전류+진동'} 
            onClick={() => onIssueFilter('detectionType', '전류+진동')}
          >
            복합
          </FilterButton>
        </FilterRow>

        <FilterRow>
          <FilterLabel>심각도:</FilterLabel>
          <FilterButton 
            active={issueFilters.severity === 'all'} 
            onClick={() => onIssueFilter('severity', 'all')}
          >
            전체
          </FilterButton>
          <FilterButton 
            active={issueFilters.severity === '매우높음'} 
            onClick={() => onIssueFilter('severity', '매우높음')}
          >
            매우높음
          </FilterButton>
          <FilterButton 
            active={issueFilters.severity === '높음'} 
            onClick={() => onIssueFilter('severity', '높음')}
          >
            높음
          </FilterButton>
        </FilterRow>
      </FilterSection>

      {/* 이슈 목록 */}
      <IssueList>
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              onClick={() => onIssueSelect(issue)}
              disabled={isLoading}
            >
              <IssueHeader>
                <IssueIcon>{issue.icon}</IssueIcon>
                <IssueName>{issue.name}</IssueName>
                <SeverityBadge severity={issue.severity}>
                  {issue.severity}
                </SeverityBadge>
              </IssueHeader>

              <IssueDetails>
                <IssueDesc>{issue.description}</IssueDesc>
                <IssueTags>
                  <IssueTag>{issue.category}</IssueTag>
                  <IssueTag>{issue.process}</IssueTag>
                  <IssueTag>{issue.detectionType}</IssueTag>
                </IssueTags>
                <UrgencyText>{issue.urgency}</UrgencyText>
              </IssueDetails>
            </IssueCard>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            선택한 조건에 해당하는 이슈가 없습니다.
          </div>
        )}
      </IssueList>

      {isLoading && (
        <LoadingIndicator>
          이슈 분석을 시작하고 있습니다
        </LoadingIndicator>
      )}
    </StyledIssueSelection>
  );
};