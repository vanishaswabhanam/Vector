import React from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 2rem;
  width: 90%;
  max-width: 1200px;
  margin-top: 2rem;
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
      <Header />
      <Content>
        <Title>Media Upload</Title>
        <p>Upload your media files here.</p>
        <UploadArea>
          <p>Click or drag files here to upload</p>
        </UploadArea>
      </Content>
    </Container>
  );
};

export default MediaUpload; 