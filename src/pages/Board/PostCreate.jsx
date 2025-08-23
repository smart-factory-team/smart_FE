import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostForm } from './PostForm';
import axios from 'axios';

export const PostCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (postData, pdfFile) => {
    try {
      console.log('게시글 데이터:', postData);
      console.log('PDF 파일:', pdfFile);
      
      // 1. 게시글 생성
      const postResponse = await axios.post('/posts', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('게시글 생성 응답:', postResponse.data);
      
      // 2. PDF 파일이 있으면 reports API로 업로드
      if (pdfFile) {
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('postId', postResponse.data.id); // 생성된 게시글 ID 연결
        
        console.log('PDF 업로드 FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        
        const reportResponse = await axios.post('/reports/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('PDF 업로드 응답:', reportResponse.data);
      }
      
      // 성공 시 게시판으로 이동
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate(`/board/${postResponse.data.id}`);

    } catch (error) {
      console.error('게시글 작성 실패:', error);
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