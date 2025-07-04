import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
    outline: none;
  }
`;

// Color palette
export const colors = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  secondary: '#64748b',
  success: '#059669',
  danger: '#dc2626',
  warning: '#d97706',
  light: '#f8fafc',
  dark: '#1e293b',
  white: '#ffffff',
  border: '#e2e8f0',
  text: '#334155',
  textLight: '#64748b',
};

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

export const Card = styled.div`
  background: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid ${colors.border};
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}>`
  padding: ${props => 
    props.size === 'sm' ? '0.5rem 1rem' :
    props.size === 'lg' ? '0.875rem 1.5rem' :
    '0.75rem 1.25rem'
  };
  border-radius: 6px;
  font-weight: 500;
  font-size: ${props => 
    props.size === 'sm' ? '0.875rem' :
    props.size === 'lg' ? '1.125rem' :
    '1rem'
  };
  transition: all 0.2s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  background-color: ${props => {
    switch (props.variant) {
      case 'secondary':
        return colors.secondary;
      case 'danger':
        return colors.danger;
      case 'success':
        return colors.success;
      default:
        return colors.primary;
    }
  }};
  
  color: ${colors.white};
  
  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'secondary':
          return '#475569';
        case 'danger':
          return '#b91c1c';
        case 'success':
          return '#047857';
        default:
          return colors.primaryHover;
      }
    }};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${colors.border};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: ${colors.textLight};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${colors.border};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: ${colors.textLight};
  }
`;

export const Grid = styled.div<{ cols?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 1}, 1fr);
  gap: ${props => props.gap || '1rem'};

  @media (min-width: 768px) {
    grid-template-columns: repeat(${props => Math.min(props.cols || 1, 2)}, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(${props => props.cols || 1}, 1fr);
  }
`;

export const Flex = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => {
    switch (props.justify) {
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      default: return 'flex-start';
    }
  }};
  align-items: ${props => {
    switch (props.align) {
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'stretch': return 'stretch';
      default: return 'flex-start';
    }
  }};
  gap: ${props => props.gap || '0'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.dark};
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: 1.5rem;
`;

export const Text = styled.p<{ size?: 'sm' | 'md' | 'lg'; color?: string }>`
  font-size: ${props => 
    props.size === 'sm' ? '0.875rem' :
    props.size === 'lg' ? '1.125rem' :
    '1rem'
  };
  color: ${props => props.color || colors.text};
  line-height: 1.6;
`;

export const Badge = styled.span<{ variant?: 'success' | 'danger' | 'warning' | 'info' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'success':
        return '#dcfce7';
      case 'danger':
        return '#fee2e2';
      case 'warning':
        return '#fef3c7';
      case 'info':
        return '#dbeafe';
      default:
        return '#f1f5f9';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return '#166534';
      case 'danger':
        return '#991b1b';
      case 'warning':
        return '#92400e';
      case 'info':
        return '#1e40af';
      default:
        return '#475569';
    }
  }};
`;