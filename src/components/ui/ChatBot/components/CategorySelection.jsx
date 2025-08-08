import React from 'react';
import {
  CategorySelection as StyledCategorySelection,
  CategoryTitle,
  CategorySubtitle,
  CategoryList,
  CategoryOption,
  CategoryIcon,
  CategoryName,
  CategoryDesc
} from '../styles/CategoryStyles';
import { LoadingIndicator } from '../styles/ChatBotStyles';
import { categories } from '../data/chatBotData';

export const CategorySelection = ({ 
  onCategorySelect, 
  isLoading = false 
}) => {
  return (
    <StyledCategorySelection>
      <CategoryTitle>🤖 AI 상담 서비스</CategoryTitle>
      <CategorySubtitle>
        문의 유형을 선택하면 해당 전문가가<br />
        맞춤형 상담을 제공해드립니다.
      </CategorySubtitle>
      
      <CategoryList>
        {categories.map((category) => (
          <CategoryOption
            key={category.id}
            onClick={() => onCategorySelect(category)}
            disabled={isLoading}
          >
            <CategoryIcon>{category.icon}</CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
            <CategoryDesc>{category.description}</CategoryDesc>
          </CategoryOption>
        ))}
      </CategoryList>

      {isLoading && (
        <LoadingIndicator>
          세션을 준비하고 있습니다
        </LoadingIndicator>
      )}
    </StyledCategorySelection>
  );
};