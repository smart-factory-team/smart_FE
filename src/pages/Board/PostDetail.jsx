import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { posts_list } from './test_posts';

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;

  &:hover {
    background: #e9ecef;
  }
`;

const Header = styled.div`
  border-bottom: 2px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const CategoryTag = styled.span`
  padding: 4px 12px;
  background: #007bff;
  color: white;
  border-radius: 12px;
  font-size: 12px;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  background: ${props => props.$solved ? '#28a745' : '#f02400ff'};
  color: white;
  border-radius: 12px;
  font-size: 12px;
`;

const Content = styled.div`
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  line-height: 1.6;
  font-size: 16px;
  color: #333;
`;

const AttachmentSection = styled.div`
  margin-bottom: 30px;
`;

const AttachmentHeader = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
  background: #e9ecef;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
`;

const PDFViewerContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const PDFControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
`;

const PDFIframe = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
  background: white;
`;

const PDFErrorMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
`;

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 12px;
  
  &:hover {
    background: #218838;
    color: white;
  }
`;

const CommentSection = styled.div`
  border-top: 2px solid #eee;
  padding-top: 30px;
`;

const CommentHeader = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
`;

const CommentForm = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const CommentButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &.primary {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
  
  &.secondary {
    background: white;
    color: #666;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CommentItem = styled.div`
  padding: 20px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
`;

const CommentContent = styled.div`
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
  font-size: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

export const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [pdfAttachments, setPdfAttachments] = useState([]);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'user02',
      content: '같은 문제 발생했습니다. 해결 방법 공유 부탁드립니다.',
      createdAt: '2025-08-18T09:30:00Z'
    },
    {
      id: 2,
      author: 'user03',
      content: '센서 교체 후 정상 작동 확인했습니다.',
      createdAt: '2025-08-18T10:15:00Z'
    }
  ]);

  useEffect(() => {
    const foundPost = posts_list.find(p => p.id === id);
    setPost(foundPost);
    
    // PDF 첨부파일 조회 (실제로는 API 호출)
    fetchPDFAttachments(id);
  }, [id]);

  const fetchPDFAttachments = async (postId) => {
    // 실제 구현에서는 API 호출
    // const response = await fetch(`/api/posts/${postId}/attachments`);
    // const pdfs = await response.json();
    
    // 더미 데이터 (예시) - 특정 게시글에만 PDF 첨부
    const dummyPDFs = [
      {
        id: '1',
        postId: '1',
        filePath: '/기업분석보고서_(주)LG에너지솔루션.pdf', // public 폴더의 PDF
      }
    ];
    
    const postPDFs = dummyPDFs.filter(pdf => pdf.postId === postId);
    setPdfAttachments(postPDFs);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString); 
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      'PRESS': '프레스 공정',
      'WELDING': '차체 공정',
      'PAINTING': '도장 공정',
      'ASSEMBLY': '의장 조립 공정'
    };
    return categoryMap[category] || category;
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'current_user',
        content: newComment,
        createdAt: new Date().toISOString()
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        // 실제 구현에서는 API 호출
        // await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        
        alert('게시글이 삭제되었습니다.');
        navigate('/board');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  if (!post) {
    return <Container>게시글을 찾을 수 없습니다.</Container>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/board')}>
        ← 목록으로
      </BackButton>

      <Header>
        <Title>{post.title}</Title>
        <PostInfo>
          <span>{post.userId}</span>
          <span>|</span>
          <span>{formatDate(post.createdAt)}</span>
          <CategoryTag>{getCategoryName(post.category)}</CategoryTag>
          <StatusBadge $solved={post.isSolved}>
            {post.isSolved ? '✅ 해결됨' : '⚠️ 미해결'}
          </StatusBadge>
        </PostInfo>
      </Header>

      <Content>
        {post.content}
      </Content>

      {/* PDF 첨부파일 섹션 */}
      {pdfAttachments.length > 0 && (
        <AttachmentSection>
          <AttachmentHeader>
            📎 첨부파일
          </AttachmentHeader>
          
          {pdfAttachments.map(pdf => (
            <div key={pdf.id}>
              <FileInfo>
                <span>📄 {pdf.fileName}</span>
                <span>({pdf.fileSize})</span>
                <DownloadButton href={pdf.filePath} download target="_blank">
                  ⬇️ 다운로드
                </DownloadButton>
              </FileInfo>
              
              <PDFViewerContainer>
                <PDFControls>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    PDF 미리보기
                  </span>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    전체화면으로 보려면 우클릭 후 '새 탭에서 열기'를 선택하세요
                  </span>
                </PDFControls>
                
                <PDFIframe
                  src={`${pdf.filePath}#toolbar=1&navpanes=1&scrollbar=1`}
                  title={`PDF 뷰어 - ${pdf.fileName}`}
                  onError={() => {
                    console.log('PDF 로드 실패');
                  }}
                />
              </PDFViewerContainer>
            </div>
          ))}
        </AttachmentSection>
      )}

      <CommentSection>
        <CommentHeader>💬 댓글 ({comments.length})</CommentHeader>
        
        <CommentForm>
          <CommentTextarea
            placeholder="댓글을 작성해주세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <CommentButtons>
            <Button 
              className="secondary"
              onClick={() => setNewComment('')}
            >
              취소
            </Button>
            <Button 
              className="primary"
              onClick={handleAddComment}
            >
              등록
            </Button>
          </CommentButtons>
        </CommentForm>

        <CommentList>
          {comments.map(comment => (
            <CommentItem key={comment.id}>
              <CommentAuthor>
                <strong>{comment.author}</strong>
                <span>|</span>
                <span>{formatDate(comment.createdAt)}</span>
              </CommentAuthor>
              <CommentContent>
                {comment.content}
              </CommentContent>
              <CommentActions>
                <ActionButton>삭제</ActionButton>
              </CommentActions>
            </CommentItem>
          ))}
        </CommentList>
      </CommentSection>
    </Container>
  );
};