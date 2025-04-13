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
      <Title>Maintenance</Title>
      <StatusCard>
        <h2>System Status</h2>
        <p>All systems are operational</p>
      </StatusCard>
    </Container>
  );
};

export default Maintenance; 