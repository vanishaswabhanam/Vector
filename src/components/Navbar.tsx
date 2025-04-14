import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const NavContainer = styled.nav`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Line = styled.div`
  width: 30px;
  height: 3px;
  background-color: #ff0000;
  transition: all 0.3s ease;
`;

const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 10px;
`;

const MenuItem = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  return (
    <NavContainer>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <Line />
        <Line />
        <Line />
      </MenuButton>
      <Menu isOpen={isOpen}>
        <MenuItem to="/" onClick={handleMenuItemClick}>Dashboard</MenuItem>
        <MenuItem to="/media" onClick={handleMenuItemClick}>Media Upload</MenuItem>
        <MenuItem to="/maintenance" onClick={handleMenuItemClick}>Maintenance</MenuItem>
      </Menu>
    </NavContainer>
  );
};

export default Navbar; 