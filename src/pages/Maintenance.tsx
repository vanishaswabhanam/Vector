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

const StatusCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Maintenance: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Title>Maintenance</Title>
        <p>System maintenance and configuration options.</p>
        <StatusCard>
          <h2>System Status</h2>
          <p>All systems are operational</p>
        </StatusCard>
      </Content>
    </Container>
  );
};

export default Maintenance; 