import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const UploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  margin-top: 20px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff0000;
    background-color: #fff;
  }
`;

const MediaUpload: React.FC = () => {
  return (
    <Container>
      <Title>Media Upload</Title>
      <UploadArea>
        <p>Click or drag files here to upload</p>
      </UploadArea>
    </Container>
  );
};

export default MediaUpload; 