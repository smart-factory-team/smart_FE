import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostForm } from './PostForm';

export const PostCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // 실제 API 호출
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   body: formData
      // });

      // 성공 시 게시판으로 이동
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate('/board');
      
    } catch (error) {
      throw error; // PostForm에서 에러 처리
    }
  };

  return (
    <PostForm 
      mode="create"
      onSubmit={handleSubmit}
    />
  );
};