import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Card,
  Button,
  Input,
  Flex,
  Text,
  colors,
  PageTitle
} from '../styles/GlobalStyles';

const LoginWrapper = styled.div`
  padding: 4rem 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginCard = styled(Card)`
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.textLight};
`;

const StyledInput = styled(Input)`
  padding-left: 3rem;
  padding-right: ${props => props.type === 'password' ? '3rem' : '1rem'};
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${colors.textLight};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${colors.text};
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
  text-align: center;
`;

const InfoBox = styled.div`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #bfdbfe;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
`;

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = login(username, password);
      
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginWrapper>
      <Container>
        <LoginCard>
          <Flex direction="column" align="center" gap="1rem" style={{ marginBottom: '2rem' }}>
            <div style={{ 
              background: colors.primary, 
              padding: '1rem', 
              borderRadius: '50%',
              color: colors.white 
            }}>
              <Lock size={24} />
            </div>
            <PageTitle style={{ marginBottom: 0, fontSize: '1.875rem' }}>
              Admin Login
            </PageTitle>
            <Text color={colors.textLight} style={{ textAlign: 'center' }}>
              Access the admin dashboard to manage products
            </Text>
          </Flex>

          <InfoBox>
            <Text size="sm" style={{ margin: 0 }}>
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: jbstire2024
            </Text>
          </InfoBox>

          <LoginForm onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <InputGroup>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <StyledInput
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <StyledInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <PasswordToggle
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputGroup>

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={loading || !username || !password}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </LoginForm>

          <Text 
            size="sm" 
            color={colors.textLight} 
            style={{ textAlign: 'center', marginTop: '1.5rem' }}
          >
            Secure admin access for JB's Tire & Auto
          </Text>
        </LoginCard>
      </Container>
    </LoginWrapper>
  );
};