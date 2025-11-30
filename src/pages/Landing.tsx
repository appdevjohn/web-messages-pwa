import styled from 'styled-components'
import LoginSignup from '../components/LoginSignup'

const LandingHeader = styled.header`
  position: relative;
  z-index: 2;
  padding: 1.5rem 1rem 0.75rem;
  text-align: center;

  @media (min-width: 40rem) {
    padding: 2rem 1rem 1rem;
  }
`

const LogoBadge = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 24px rgba(64, 61, 88, 0.25);
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @media (min-width: 40rem) {
    width: 72px;
    height: 72px;
    margin: 0 auto 1.5rem;
    border-radius: 20px;
    font-size: 2.5rem;
    box-shadow: 0 10px 30px rgba(64, 61, 88, 0.25);

    @keyframes float {
      0%,
      100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #78729f 0%, #5a5479 100%);
    box-shadow: 0 8px 24px rgba(120, 114, 159, 0.3);

    @media (min-width: 40rem) {
      box-shadow: 0 10px 30px rgba(120, 114, 159, 0.3);
    }
  }
`

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  @media (min-width: 40rem) {
    font-size: 3.5rem;
    margin: 0 0 1rem 0;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #a39dc9 0%, #78729f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

const Tagline = styled.p`
  font-size: 1.05rem;
  line-height: 1.5;
  margin: 0 auto 1.5rem;
  color: #555;
  font-weight: 400;
  max-width: 42rem;

  @media (min-width: 40rem) {
    font-size: 1.3rem;
    line-height: 1.6;
    margin: 0 auto 2.5rem;
  }

  @media (prefers-color-scheme: dark) {
    color: #bbb;
  }
`

const LandingContainer = styled.div`
  box-sizing: border-box;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  position: relative;
  z-index: 2;

  @media (min-width: 40rem) {
    padding: 0 1rem 4rem;
  }
`

export default function Landing() {
  return (
    <>
      <LandingHeader>
        <LogoBadge>O</LogoBadge>
        <Title>OneTimeChat</Title>
        <Tagline>
          Create a chat, send a link. No account needed to join.
        </Tagline>
      </LandingHeader>
      <LandingContainer>
        <LoginSignup />
      </LandingContainer>
    </>
  )
}
