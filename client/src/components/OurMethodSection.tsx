import React from 'react';
import styled, { keyframes } from 'styled-components';
import COLORS from '../../assets/colors';

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

const Section = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, #111111 0%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: left;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(90deg, ${COLORS.gogo_blue}, ${COLORS.gogo_teal});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.15rem;
  line-height: 1.6;
  max-width: 900px;
`;

const Grid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 1rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1rem 1rem;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, background 0.25s ease,
    border-color 0.25s ease;
  position: relative;

  &:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const IconWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${COLORS.gogo_blue}, ${COLORS.gogo_teal});
  color: white;
  animation: ${float} 6s ease-in-out infinite;

  // Normalize icon sizing and strokes for consistency
  svg {
    width: 24px;
    height: 24px;
    display: block;
  }
  svg,
  svg * {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
`;

const CardTitle = styled.div`
  color: white;
  font-weight: 800;
  letter-spacing: 0.01em;
`;

const Narrative = styled.div`
  margin-top: 2.25rem;
  background: linear-gradient(
    135deg,
    ${COLORS.gogo_purple} 0%,
    ${COLORS.gogo_blue} 100%
  );
  border-radius: 16px;
  padding: 1.25rem 1.25rem;
`;

const NarrativeInner = styled.div`
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 1.25rem 1.25rem;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.65;
  font-size: 1rem;
`;

function HandshakeIcon() {
  return (
    // Use a clearer users icon to represent trusting relationships
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M5 15.13A4 4 0 0 0 2 19v2" />
      <path d="M19 7a4 4 0 0 1-1.17 2.83" />
      <path d="M7 9.83A4 4 0 0 1 5.83 7" />
    </svg>
  );
}

function EducationIcon() {
  return (
    // Open book icon for a clearer education metaphor
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5h6a4 4 0 0 1 4 4v10a4 4 0 0 0-4-4H3z" />
      <path d="M21 5h-6a4 4 0 0 0-4 4v10a4 4 0 0 1 4-4h6z" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12c.6.6 1 1.3 1 2h6c0-.7.4-1.4 1-2A7 7 0 0012 2z" />
    </svg>
  );
}

function CogIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a7.97 7.97 0 00.1-2l2-1-2-3-2 1a8.1 8.1 0 00-1.7-1l-.3-2.3h-4l-.3 2.3a8.1 8.1 0 00-1.7 1l-2-1-2 3 2 1a7.97 7.97 0 000 2l-2 1 2 3 2-1a8.1 8.1 0 001.7 1l.3 2.3h4l.3-2.3a8.1 8.1 0 001.7-1l2 1 2-3-2-1z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10v1a7 7 0 0014 0v-1M12 21v-3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function OurMethodSection(): JSX.Element {
  const items = [
    {
      icon: <HandshakeIcon />,
      text: 'Trusting relationships with caring adults',
    },
    {
      icon: <EducationIcon />,
      text: 'High-quality, no-cost arts education during typically unsupervised hours',
    },
    {
      icon: <LightbulbIcon />,
      text: 'Enriching, safe activities that foster self-esteem & creative self-expression',
    },
    { icon: <CogIcon />, text: 'Skill Development' },
    { icon: <MicIcon />, text: 'Performance' },
    { icon: <HeartIcon />, text: 'Trauma-informed mental health support' },
  ];

  return (
    <Section>
      <Container>
        <Header>
          <Title>Our Method</Title>
          <Subtitle>
            Our mentoring-centric approach is delivered by paid, professional
            musician mentors and helps alleviate primary challenges faced by
            youth in vulnerable communities by providing:
          </Subtitle>
        </Header>
        <Grid>
          {items.map((it) => (
            <Card
              key={it.text}
              className="animate-child"
              style={{ opacity: 0 }}
            >
              <IconWrap aria-hidden>{it.icon}</IconWrap>
              <CardTitle>{it.text}</CardTitle>
            </Card>
          ))}
        </Grid>

        <Narrative>
          <NarrativeInner>
            Our successful model pairs youth with a caring adult mentor, the
            unparalleled power of music, and trauma-informed mental health
            support. Separately, these interventions increase academic and
            social-emotional development as well as future employability and
            economic potential. We uniquely combine these to maximize their
            collective effectiveness. Through weekly after-school music and art
            instruction, mentoring, trauma-informed care, and performance
            opportunities across Miami, Chicago, Los Angeles, and New York, GOGO
            is a platform for youth to learn, grow and unleash their leadership
            potential.
          </NarrativeInner>
        </Narrative>
      </Container>
    </Section>
  );
}

export default OurMethodSection;
