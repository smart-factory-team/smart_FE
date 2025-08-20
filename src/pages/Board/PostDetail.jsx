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
  background: ${props => props.solved ? '#28a745' : '#dc3545'};
  color: white;
  border-radius: 12px;
  font-size: 12px;
`;

const IssueCode = styled.div`
  font-family: monospace;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  margin-top: 10px;
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
    }, [id]);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const getCategoryName = (category) => {
        const categoryMap = {
            'PRESS': '프레스 공정',
            'CHASSIS': '차체 공정',
            'PAINT': '도장 공정',
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
                    <StatusBadge solved={post.isSolved}>
                        {post.isSolved ? '✅ 해결됨' : '🔴 미해결'}
                    </StatusBadge>
                </PostInfo>
                <IssueCode>
                    이슈 코드: {post.issue}
                </IssueCode>
            </Header>

            <Content>
                {post.content}
            </Content>

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
                                <ActionButton>답글</ActionButton>
                                <ActionButton>삭제</ActionButton>
                            </CommentActions>
                        </CommentItem>
                    ))}
                </CommentList>
            </CommentSection>
        </Container>
    );
};