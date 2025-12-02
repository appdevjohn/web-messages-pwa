import styled, { css } from 'styled-components'

// Common gradient mixins
export const primaryGradient = css`
  background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #78729f 0%, #5a5479 100%);
  }
`

export const gradientTextStyle = css`
  background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #a39dc9 0%, #78729f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

// Card container with consistent styling
export const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    background: #2a2a2a;
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
`

// Gradient text for titles and headings
export const GradientText = styled.span`
  ${gradientTextStyle}
`

// Primary button with gradient background
export const PrimaryButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  ${primaryGradient}
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(64, 61, 88, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    &:hover:not(:disabled) {
      box-shadow: 0 8px 20px rgba(120, 114, 159, 0.3);
    }
  }
`

// Secondary button with outline style
export const SecondaryButton = styled.button`
  appearance: none;
  border: 2px solid var(--accent-color);
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  background: transparent;
  color: var(--accent-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--accent-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 61, 88, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    border-color: #78729f;
    color: #a39dc9;

    &:hover:not(:disabled) {
      background: #78729f;
      color: white;
      box-shadow: 0 4px 12px rgba(120, 114, 159, 0.2);
    }
  }
`

// Text input with consistent styling
export const TextInput = styled.input`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  background-color: #f5f5f5;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: white;
    box-shadow: 0 0 0 4px rgba(64, 61, 88, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #2a2a2a;
    color: white;
    border-color: transparent;

    &::placeholder {
      color: #666;
    }

    &:focus {
      background-color: #333;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 4px rgba(120, 114, 159, 0.15);
    }
  }
`

// Icon container with gradient background
export const IconContainer = styled.div`
  ${primaryGradient}
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(64, 61, 88, 0.25);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 8px 24px rgba(120, 114, 159, 0.3);
  }
`

// Error text styling
export const ErrorText = styled.div`
  font-size: 0.875rem;
  color: #c72c41;
  font-weight: 500;
  padding: 0.75rem 1rem;
  background-color: rgba(199, 44, 65, 0.1);
  border-radius: 8px;
  border-left: 3px solid #c72c41;
`

// Helper/secondary text
export const HelperText = styled.div`
  font-size: 0.95rem;
  text-align: center;
  color: #666;

  @media (prefers-color-scheme: dark) {
    color: #999;
  }
`

// Glassmorphism container for overlays
export const GlassmorphicContainer = styled.div`
  background: color-mix(in srgb, var(--page-background) 70%, transparent);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
`

// Secondary text colors as a styled component
export const SecondaryText = styled.span`
  color: #666;

  @media (prefers-color-scheme: dark) {
    color: #999;
  }
`

// Link display container (for showing URLs)
export const LinkDisplayContainer = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1rem;
  word-break: break-all;
  font-size: 0.9rem;
  color: var(--accent-color);
  font-family: monospace;
  border: 2px solid transparent;
  transition: all 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: #1a1a1a;
    color: #a39dc9;
  }
`
