import { useState } from 'react';
import { weldingIssues } from '../data/chatBotData';

export const useIssueFilter = () => {
  const [filteredIssues, setFilteredIssues] = useState(weldingIssues);
  const [issueFilters, setIssueFilters] = useState({
    process: 'all',
    detectionType: 'all', 
    severity: 'all'
  });

  const handleIssueFilter = (filterType, value) => {
    const newFilters = { ...issueFilters, [filterType]: value };
    setIssueFilters(newFilters);
    
    let filtered = weldingIssues;
    
    if (newFilters.process !== 'all') {
      filtered = filtered.filter(issue => issue.process === newFilters.process);
    }
    if (newFilters.detectionType !== 'all') {
      filtered = filtered.filter(issue => issue.detectionType.includes(newFilters.detectionType));
    }
    if (newFilters.severity !== 'all') {
      filtered = filtered.filter(issue => issue.severity === newFilters.severity);
    }
    
    setFilteredIssues(filtered);
  };

  return {
    filteredIssues,
    issueFilters,
    handleIssueFilter
  };
};