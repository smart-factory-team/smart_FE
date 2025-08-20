import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostForm } from './PostForm';
import { posts_list } from './test_posts';

export const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 실제 구현에서는 API 호출
        // const response = await fetch(`/api/posts/${id}`);
        // const post = await response.json();
        
        // 더미 데이터에서 게시글 찾기
        const post = posts_list.find(p => p.id === id);
        
        if (!post) {
          alert('게시글을 찾을 수 없습니다.');
          navigate('/board');
          return;
        }

        // 기존 PDF 파일 정보도 함께 가져오기 (예시)
        const postData = {
          title: post.title,
          content: post.content,
          category: post.category,
          userId: post.userId,
          existingFile: {
            fileName: 'existing_report.pdf',
            fileSize: '2.5MB'
          }
        };

        setInitialData(postData);
        
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글을 불러오는데 실패했습니다.');
        navigate('/board');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // 실제 API 호출
      // const response = await fetch(`/api/posts/${id}`, {
      //   method: 'PUT',
      //   body: formData
      // });

      // 성공 시 상세 페이지로 이동
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/board/${id}`);
      
    } catch (error) {
      throw error; // PostForm에서 에러 처리
    }
  };

  const handleCancel = () => {
    navigate(`/board/${id}`);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        로딩 중...
      </div>
    );
  }

  if (!initialData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <PostForm 
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};