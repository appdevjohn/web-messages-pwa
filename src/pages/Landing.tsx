import { Link } from 'react-router-dom'
import styled from 'styled-components'
import LoginSignup from '../components/LoginSignup'
import {
  IconContainer,
  gradientTextStyle,
} from '../components/shared/StyledComponents'

const LandingHeader = styled.header`
  position: relative;
  z-index: 2;
  padding: 2.25rem 1rem 0.75rem;
  text-align: center;

  @media (min-width: 40rem) {
    padding: 3rem 1rem 1rem;
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
      transform: translateY(4px);
    }
    50% {
      transform: translateY(-4px);
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
  margin: 0 auto 0.5rem;
  color: #555;
  font-weight: 400;
  max-width: 42rem;

  @media (min-width: 40rem) {
    font-size: 1.3rem;
    line-height: 1.6;
    margin: 0 auto 0.75rem;
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

const AboutLink = styled(Link)`
  display: inline-block;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--accent-color);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.7;
    text-decoration: underline;
  }

  @media (prefers-color-scheme: dark) {
    color: #a39dc9;
  }

  @media (min-width: 40rem) {
    margin-bottom: 3rem;
  }
`

export default function Landing() {
  const appName = import.meta.env.VITE_APP_NAME || "Web Messages"

  return (
    <>
      <LandingHeader>
        <LogoBadge as="img" src="/icon.png" alt={`${appName} logo`} />
        <Title>{appName}</Title>
        <Tagline>
          Create a chat, send a link. No account needed to join.
        </Tagline>
        <AboutLink to="/about">Learn More →</AboutLink>
      </LandingHeader>
      <LandingContainer>
        <LoginSignup />
      </LandingContainer>
    </>
  )
}
