import React from 'react';
import styled from '@emotion/styled';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
`;

const Logo = styled.img`
  height: 60px;
  width: auto;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo src="/vector-logo.png" alt="Vector Logo" />
    </HeaderContainer>
  );
};

export default Header; 