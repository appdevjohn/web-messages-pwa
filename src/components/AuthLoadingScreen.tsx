import styled, { keyframes } from 'styled-components'

const Screen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), #f9f9fb);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, rgba(18, 18, 18, 0.98), #0f0f0f);
  }
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid rgba(64, 61, 88, 0.18);
  border-top-color: var(--accent-color);
  animation: ${spin} 0.8s linear infinite;

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.14);
    border-top-color: #a39dc9;
  }
`

export default function AuthLoadingScreen() {
  return (
    <Screen>
      <Spinner aria-label='Loading' />
    </Screen>
  )
}
