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
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(5deg);
  }
`;

const Line = styled.div<{ isOpen: boolean, position: 'top' | 'middle' | 'bottom' }>`
  width: 30px;
  height: 3px;
  background-color: #ff0000;
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  
  ${({ isOpen, position }) => {
    if (position === 'top') {
      return isOpen ? `
        transform: rotate(45deg) translate(5px, 5px);
        width: 28px;
      ` : '';
    }
    if (position === 'middle') {
      return isOpen ? `
        opacity: 0;
        transform: translateX(-15px);
      ` : '';
    }
    if (position === 'bottom') {
      return isOpen ? `
        transform: rotate(-45deg) translate(5px, -5px);
        width: 28px;
      ` : '';
    }
  }}
`;

const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  overflow: hidden;
  width: ${props => props.isOpen ? '180px' : '160px'};
`;

const MenuItem = styled(Link)<{ delay: number }>`
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  transform-origin: right;
  animation: ${({ delay }) => `slideIn 0.3s ease-out ${delay}s forwards`};
  opacity: 0;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:hover {
    background-color: #f5f5f5;
    transform: scale(1.05);
    color: #ff0000;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    width: 0;
    height: 2px;
    background-color: #ff0000;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: calc(100% - 32px);
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
        <Line isOpen={isOpen} position="top" />
        <Line isOpen={isOpen} position="middle" />
        <Line isOpen={isOpen} position="bottom" />
      </MenuButton>
      <Menu isOpen={isOpen}>
        <MenuItem to="/" onClick={handleMenuItemClick} delay={0.05}>Dashboard</MenuItem>
        <MenuItem to="/media" onClick={handleMenuItemClick} delay={0.1}>Media Upload</MenuItem>
        <MenuItem to="/maintenance" onClick={handleMenuItemClick} delay={0.15}>Maintenance</MenuItem>
      </Menu>
    </NavContainer>
  );
};

export default Navbar; 