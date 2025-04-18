import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 1rem 2rem;
  margin: 0.5rem;
  border-radius: 4px;
  background-color: #f5f5f5;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Home: React.FC = () => {
  return (
    <Container>
      <Title>Welcome to Vector</Title>
      <NavLink to="/dashboard">Go to Dashboard</NavLink>
      <NavLink to="/media">Media Upload</NavLink>
      <NavLink to="/maintenance">Maintenance</NavLink>
    </Container>
  );
};

export default Home; 