import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Car, Settings, LogOut } from 'lucide-react';
import { colors, Container, Flex, Button } from '../styles/GlobalStyles';
import { useAuth } from '../context/AuthContext';

const HeaderWrapper = styled.header`
  background: linear-gradient(135deg, ${colors.dark} 0%, #2d3748 100%);
  color: ${colors.white};
  padding: 1rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.white};
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    color: ${colors.primary};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: ${colors.white};
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &.active {
    background-color: ${colors.primary};
  }
`;

const AdminButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  border: 2px solid ${colors.white};
  color: ${colors.white};

  &:hover {
    background-color: ${colors.white};
    color: ${colors.dark};
  }
`;

export const Header: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderWrapper>
      <Container>
        <Flex justify="between" align="center">
          {/* Logo */}
          <Logo to="/">
            <Car size={28} />
            JB's Tire & Auto
          </Logo>

          {/* Navigation */}
          <Nav>
            <NavLink to="/">Shop</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            
            {/* Admin Controls */}
            {isAdmin ? (
              <Flex gap="0.5rem">
                <AdminButton onClick={handleAdminClick} size="sm">
                  <Settings size={16} />
                  Admin
                </AdminButton>
                <AdminButton onClick={handleLogout} size="sm" variant="danger">
                  <LogOut size={16} />
                  Logout
                </AdminButton>
              </Flex>
            ) : (
              <AdminButton onClick={handleAdminClick} size="sm">
                <Settings size={16} />
                Admin
              </AdminButton>
            )}
          </Nav>
        </Flex>
      </Container>
    </HeaderWrapper>
  );
};