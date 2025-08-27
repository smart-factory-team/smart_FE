// ===============================
// useIssueFilter.jsx - 이슈 필터링 훅
// src/components/ui/ChatBot/hooks/useIssueFilter.jsx
// ===============================

import { useState, useMemo } from 'react';
import { allIssues } from '../data/chatBotData'; // 전체 이슈 사용

export const useIssueFilter = (selectedCategory) => {
  // 필터 상태
  const [issueFilters, setIssueFilters] = useState({
    process: 'all',
    detectionType: 'all',
    severity: 'all'
  });

  // 필터 변경 핸들러
  const handleIssueFilter = (filterType, value) => {
    setIssueFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // 필터링된 이슈 목록
  const filteredIssues = useMemo(() => {
    if (!selectedCategory) return [];
    
    let issues = [...allIssues]; // 🔧 전체 이슈 사용
    
    // 공정 필터
    if (issueFilters.process !== 'all') {
      issues = issues.filter(issue => issue.process === issueFilters.process);
    }
    
    // 감지 유형 필터
    if (issueFilters.detectionType !== 'all') {
      issues = issues.filter(issue => issue.detectionType === issueFilters.detectionType);
    }
    
    // 심각도 필터
    if (issueFilters.severity !== 'all') {
      issues = issues.filter(issue => issue.severity === issueFilters.severity);
    }
    
    return issues;
  }, [selectedCategory, issueFilters]);

  return {
    filteredIssues,
    issueFilters,
    handleIssueFilter
  };
};