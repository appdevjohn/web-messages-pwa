import styled from 'styled-components'
import LoginSignup from '../components/LoginSignup'
import {
  IconContainer,
  gradientTextStyle,
} from '../components/shared/StyledComponents'

const LandingHeader = styled.header`
  position: relative;
  z-index: 2;
  padding: 1.5rem 1rem 0.75rem;
  text-align: center;

  @media (min-width: 40rem) {
    padding: 2rem 1rem 1rem;
  }
`

const LogoBadge = styled(IconContainer)`
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem;
  font-size: 2rem;
  font-weight: 700;
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
`

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  ${gradientTextStyle}
  line-height: 1.2;

  @media (min-width: 40rem) {
    font-size: 3.5rem;
    margin: 0 0 1rem 0;
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
