import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 8px;
  font-size: 32px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
`;

const CategoryButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#007bff' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #0056b3;
  }
`;

const PostList = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
`;

const PostItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const PostLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const PostTitle = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
`;

const CategoryTag = styled.span`
  padding: 3px 8px;
  background: #007bff;
  color: white;
  border-radius: 10px;
  font-size: 12px;
`;

const PostRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 120px;
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  background: ${props => props.$solved ? '#28a745' : '#f02400ff'};
  color: white;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: ${props => props.$active ? '#007bff' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${props => props.$active ? '#0056b3' : '#f8f9fa'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CreateButton = styled.button`
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;

  &:hover {
    background: #218838;
  }
`;

const BoardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  font-size: 16px;
  color: #666;
`;

export const Board = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.REACT_APP_API_BASE_URL;
  
  const categories = ['전체', '프레스 공정', '차체 공정', '도장 공정', '의장 조립 공정'];
  
  // 카테고리 매핑
  const categoryMap = {
    '전체': null,
    '프레스 공정': 'PRESS',
    '차체 공정': 'WELDING',
    '도장 공정': 'PAINTING',
    '의장 조립 공정': 'ASSEMBLY'
  };

  // API에서 게시글 목록 가져오기
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/posts');
      // API 응답이 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
      const postsData = Array.isArray(response.data._embedded.posts) ? response.data._embedded.posts : [];
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // 에러 발생 시 빈 배열로 설정
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 필터링된 게시물
  const filteredPosts = posts.filter(post => {
    const categoryFilter = activeCategory === '전체' || post.category === categoryMap[activeCategory];
    const searchFilter = (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
                        (post.userId && post.userId.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryFilter && searchFilter;
  });

  // 페이지네이션
  const postsPerPage = 10;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
  };

  // 카테고리명 변환 함수
  const getCategoryName = (category) => {
    const categoryMap = {
      'PRESS': '프레스 공정',
      'WELDING': '차체 공정', 
      'PAINTING': '도장 공정',
      'ASSEMBLY': '의장 조립 공정'
    };
    return categoryMap[category] || category;
  };

  return (
    <Container>
      <Header>
        <Title>📊 게시판</Title>
        <Subtitle>공지사항 및 시스템 로그를 확인할 수 있습니다.</Subtitle>
      </Header>

      <FilterSection>
        
        <CategoryButtons>
          {categories.map(category => (
            <CategoryButton
              key={category}
              $active={activeCategory === category}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryButtons>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>🔍</SearchButton>
        </SearchContainer>
      </FilterSection>

      {loading ? (
        <LoadingContainer>
          게시글을 불러오는 중...
        </LoadingContainer>
      ) : (
        <PostList>
          {currentPosts.map(post => (
          <PostItem key={post.id}
          onClick={() => navigate(`/board/${post.id}`)}>
            <PostLeft>
              <PostTitle>{post.title}</PostTitle>
              <PostMeta>
                <CategoryTag>{getCategoryName(post.category)}</CategoryTag>
                <span>{post.userId}</span>
                <span>|</span>
                <span>{formatDate(post.createdAt)}</span>
              </PostMeta>
            </PostLeft>
            <PostRight>
              <StatusBadge $solved={post.isSolved}>
                {post.isSolved ? '해결완료' : '해결중'}
              </StatusBadge>
            </PostRight>
          </PostItem>
        ))}
      </PostList>
      )}

      {!loading && (
        <Pagination>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <PageButton
            key={page}
            $active={currentPage === page}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PageButton>
        ))}
        </Pagination>
      )}
        <BoardActions>
          <CreateButton onClick={() => navigate('/board/create')}>
            ✍️ 게시글 작성
          </CreateButton>
        </BoardActions>
    </Container>
  );
};