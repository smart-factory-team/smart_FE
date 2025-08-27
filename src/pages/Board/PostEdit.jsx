import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostForm } from './PostForm';
import axios from 'axios';

export const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        const post = response.data;
        
        if (!post) {
          alert('게시글을 찾을 수 없습니다.');
          navigate('/board');
          return;
        }

        // 기존 PDF 파일 정보도 함께 가져오기
        let existingFile = null;
        try {
          const pdfResponse = await axios.get(`/reports/post/${id}`);
          if (pdfResponse.data) {
            existingFile = pdfResponse.data;
          }
        } catch (pdfError) {
          console.log('기존 PDF 파일 없음:', pdfError.response?.status);
        }

        const postData = {
          title: post.title,
          content: post.content,
          category: post.category,
          userId: post.userId,
          existingFile: existingFile
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
      let postData, pdfFile;
      
      if (formData instanceof FormData) {
        postData = {
          title: formData.get('title'),
          content: formData.get('content'),
          category: formData.get('category'),
          userId: formData.get('userId')
        };
        pdfFile = formData.get('pdfFile');
      } else {
        postData = {
          title: formData.title,
          content: formData.content,
          category: formData.category,
          userId: formData.userId
        };
        pdfFile = formData.pdfFile;
      }

      const postResponse = await axios.patch(`/posts/${id}`, postData);
      console.log('게시글 수정 응답:', postResponse.data);

      if (pdfFile && pdfFile.size > 0) {
        console.log('PDF 파일 업로드 시도:', { fileName: pdfFile.name, size: pdfFile.size, postId: id });
        
        // 기존 PDF가 있고 새로운 PDF로 교체될 때만 삭제
        if (initialData.existingFile) {
          try {
            await axios.delete(`/reports/post/${id}`);
            console.log('기존 PDF 삭제 완료');
          } catch (deleteError) {
            console.log('기존 PDF 삭제 실패:', deleteError.response?.status);
          }
        }
        
        const pdfFormData = new FormData();
        pdfFormData.append('file', pdfFile);
        pdfFormData.append('postId', String(id));
        
        try {
          const uploadResponse = await axios.post('/reports/upload', pdfFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('PDF 업로드 성공:', uploadResponse.data);
          
          // 업로드 직후 DB 확인
          setTimeout(async () => {
            try {
              const checkResponse = await axios.get(`/reports/post/${id}`);
              console.log('PDF DB 저장 확인:', checkResponse.status);
            } catch (checkError) {
              console.error('PDF DB 저장 확인 실패:', checkError.response?.status);
            }
          }, 1000);
          
        } catch (uploadError) {
          console.error('PDF 업로드 실패:', uploadError);
          console.error('PDF 업로드 응답:', uploadError.response?.data);
          alert('PDF 파일 업로드에 실패했습니다. 게시글은 수정되었습니다.');
        }
      }

      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/board/${id}`);
      
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw error;
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