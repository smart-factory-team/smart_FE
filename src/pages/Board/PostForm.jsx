import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const Form = styled.form`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const RequiredMark = styled.span`
  color: #dc3545;
  margin-left: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &.error {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &.error {
    border-color: #dc3545;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &.error {
    border-color: #dc3545;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  transition: border-color 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #007bff;
  }

  &.dragover {
    border-color: #007bff;
    background-color: #f8f9fa;
  }

  &.error {
    border-color: #dc3545;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadText = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
`;

const FileUploadIcon = styled.div`
  font-size: 48px;
  color: #ccc;
  margin-bottom: 15px;
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 10px;
`;

const FileIcon = styled.span`
  color: #dc3545;
  font-size: 18px;
`;

const FileName = styled.span`
  flex: 1;
  font-size: 14px;
  color: #333;
`;

const FileSize = styled.span`
  font-size: 12px;
  color: #666;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 16px;
  padding: 0;

  &:hover {
    color: #c82333;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &.primary {
    background: #007bff;
    color: white;
    border-color: #007bff;

    &:hover {
      background: #0056b3;
      border-color: #0056b3;
    }

    &:disabled {
      background: #6c757d;
      border-color: #6c757d;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: white;
    color: #666;

    &:hover {
      background: #f8f9fa;
    }
  }
`;

const ExistingFileInfo = styled.div`
  padding: 10px 15px;
  background: #e9f7ef;
  border: 1px solid #d4edda;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #155724;
`;

export const PostForm = ({ 
  mode = 'create', // 'create' 또는 'edit'
  initialData = {},
  onSubmit,
  onCancel
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    userId: 'current_user',
    ...initialData
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [existingFile, setExistingFile] = useState(initialData.existingFile || null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'PRESS', label: '프레스 공정' },
    { value: 'WELDING', label: '차체 공정' },
    { value: 'PAINTING', label: '도장 공정' },
    { value: 'ASSEMBLY', label: '의장 조립 공정' }
  ];

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        title: '',
        content: '',
        category: '',
        userId: 'current_user',
        ...initialData
      }));
    }
  }, [initialData.title, initialData.content, initialData.category]); // 특정 값만 의존성으로 설정

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      if (errors.pdfFile) {
        setErrors(prev => ({
          ...prev,
          pdfFile: ''
        }));
      }
    } else {
      setErrors(prev => ({
        ...prev,
        pdfFile: 'PDF 파일만 업로드 가능합니다.'
      }));
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const removeFile = () => {
    setPdfFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    // 작성 모드에서는 PDF 필수, 수정 모드에서는 기존 파일이 있으면 선택사항
    if (mode === 'create' && !pdfFile) {
      newErrors.pdfFile = 'PDF 파일을 업로드해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('userId', formData.userId);
      
      if (pdfFile) {
        submitData.append('pdfFile', pdfFile);
      }

      await onSubmit(submitData);
      
    } catch (error) {
      console.error(`게시글 ${mode === 'create' ? '작성' : '수정'} 실패:`, error);
      alert(`게시글 ${mode === 'create' ? '작성' : '수정'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/board');
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          {mode === 'create' ? '✍️ 게시글 작성' : '✏️ 게시글 수정'}
        </Title>
        <Subtitle>
          {mode === 'create' ? '새로운 게시글을 작성합니다.' : '게시글을 수정합니다.'}
        </Subtitle>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            제목<RequiredMark>*</RequiredMark>
          </Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="게시글 제목을 입력하세요"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>
            카테고리<RequiredMark>*</RequiredMark>
          </Label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
          {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>
            내용<RequiredMark>*</RequiredMark>
          </Label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="게시글 내용을 입력하세요"
            className={errors.content ? 'error' : ''}
          />
          {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>
            PDF 첨부파일
            {mode === 'create' && <RequiredMark>*</RequiredMark>}
          </Label>

          {/* 기존 파일 정보 표시 (수정 모드) */}
          {mode === 'edit' && existingFile && !pdfFile && (
            <ExistingFileInfo>
              📄 현재 파일: {existingFile.fileName} ({existingFile.fileSize})
            </ExistingFileInfo>
          )}

          <FileUploadArea
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('pdfFileInput').click()}
            className={errors.pdfFile ? 'error' : ''}
          >
            <FileUploadIcon>📄</FileUploadIcon>
            <FileUploadText>
              클릭하거나 파일을 드래그하여 PDF를 업로드하세요
            </FileUploadText>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {mode === 'create' 
                ? 'PDF 파일만 업로드 가능합니다 (필수)' 
                : 'PDF 파일만 업로드 가능합니다 (기존 파일 교체 시에만)'
              }
            </div>
          </FileUploadArea>
          
          <FileInput
            id="pdfFileInput"
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
          />

          {pdfFile && (
            <SelectedFile>
              <FileIcon>📄</FileIcon>
              <FileName>{pdfFile.name}</FileName>
              <FileSize>{formatFileSize(pdfFile.size)}</FileSize>
              <RemoveFileButton type="button" onClick={removeFile}>
                ✕
              </RemoveFileButton>
            </SelectedFile>
          )}
          
          {errors.pdfFile && <ErrorMessage>{errors.pdfFile}</ErrorMessage>}
        </FormGroup>

        <ButtonGroup>
          <Button 
            type="button" 
            className="secondary"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button 
            type="submit" 
            className="primary"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? `${mode === 'create' ? '작성' : '수정'} 중...` 
              : `게시글 ${mode === 'create' ? '작성' : '수정'}`
            }
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};