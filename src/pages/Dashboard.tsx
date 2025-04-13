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

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Title>Dashboard</Title>
      <p>Welcome to your dashboard. This is a clean, minimalistic view of your data.</p>
    </Container>
  );
};

export default Dashboard; 