import React, { useEffect, useMemo, useRef, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';
import photo1 from '../../assets/missionPhotos/Photo1.jpg';
import photo2 from '../../assets/missionPhotos/Photo2.jpg';
import photo3 from '../../assets/missionPhotos/Photo3.jpg';
import photo4 from '../../assets/missionPhotos/Photo4.jpg';
import photo5 from '../../assets/missionPhotos/Photo5.jpg';
import photo6 from '../../assets/missionPhotos/Photo6.jpg';
import photo7 from '../../assets/missionPhotos/Photo7.jpg';
import photo8 from '../../assets/missionPhotos/Photo8.jpg';

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

const Section = styled.section`
  padding: 7rem 0;
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 50%, #121212 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(25, 70, 245, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(190, 43, 147, 0.08) 0%,
      transparent 50%
    );
`;

const SoundWaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 36px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  opacity: 0.4;
  z-index: 0;
`;

const soundwave = keyframes`
  0% { height: 3px; }
  50% { height: 18px; }
  100% { height: 3px; }
`;

const SoundWaveLine = styled.div<{ $delay: number }>`
  width: 3px;
  background: linear-gradient(to top, ${COLORS.gogo_blue}, ${COLORS.gogo_teal});
  border-radius: 3px;
  height: 3px;
  animation: ${soundwave} ${(props) => 0.8 + props.$delay * 0.2}s ease-in-out
    infinite;
  animation-delay: ${(props) => props.$delay * 0.1}s;
`;

const shimmer = keyframes`
  0% { transform: translateX(-120%); opacity: 0; }
  10% { opacity: 1; }
  60% { opacity: 1; }
  100% { transform: translateX(120%); opacity: 0; }
`;

// Removed cursor-tracking spotlight for performance

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h2`
  font-size: 2.6rem;
  font-weight: 900;
  background: linear-gradient(
    to right,
    ${COLORS.gogo_green},
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  margin: 0.25rem 0 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
`;

const CTAWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const DonateButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 999px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #0e0e0e;
  text-decoration: none;
  background: linear-gradient(
    90deg,
    ${COLORS.gogo_green},
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple}
  );
  box-shadow: 0 8px 20px rgba(25, 70, 245, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(25, 70, 245, 0.35);
    filter: brightness(1.05);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem 1.75rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  display: grid;
  grid-template-rows: 1fr auto;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
  }
`;

const ThumbWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  isolation: isolate;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 40%,
      rgba(255, 255, 255, 0.18) 50%,
      rgba(255, 255, 255, 0.08) 60%,
      transparent 100%
    );
    transform: translateX(-120%);
    opacity: 0;
    pointer-events: none;
  }

  ${Card}:hover &::after {
    animation: ${shimmer} 1.2s ease-out forwards;
  }
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.03);
  }
`;

const Caption = styled.div`
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  line-height: 1.45;
  padding: 0.9rem 1rem 1.1rem;
  text-align: center;
`;

const levels = [
  { img: photo1, text: '$75 provides one mentoring session' },
  { img: photo2, text: '$100 provides an acoustic guitar' },
  { img: photo3, text: '$250 provides a drum set' },
  { img: photo4, text: '$500 provides a keyboard' },
  { img: photo5, text: '$1,000 supports a music video' },
  { img: photo6, text: '$2,500 supports a recording session' },
  { img: photo7, text: '$5,000 supports a summer scholarship' },
  { img: photo8, text: '$10,000 supports national mental health programming' },
  // New higher tiers
  { img: photo1, text: '$25,000 supports Mentor Leadership Development' },
  { img: photo2, text: '$50,000 supports a school program' },
];

function ImpactLevelsSection(): JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    reducedMotionRef.current = prefersReduced;

    const el = sectionRef.current;
    if (!el) return undefined;

    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.willChange = 'opacity, transform';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!prefersReduced) {
              animate(el, {
                opacity: [0, 1],
                translateY: [16, 0],
                duration: 600,
                easing: 'easeOutCubic',
              });

              const children = el.querySelectorAll('.animate-child');
              if (children && children.length > 0) {
                animate(children, {
                  opacity: [0, 1],
                  translateY: [12, 0],
                  scale: [0.98, 1],
                  duration: 480,
                  delay: stagger(80),
                  easing: 'easeOutCubic',
                });
              }
            } else {
              el.setAttribute('style', 'opacity: 1; transform: none;');
              const children = el.querySelectorAll('.animate-child');
              children.forEach((child) => {
                const childEl = child as HTMLElement;
                childEl.style.opacity = '1';
                childEl.style.transform = 'none';
              });
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '200px 0px -10% 0px',
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Removed mousemove handlers for performance

  const waveLineIds = useMemo(() => {
    return Array.from({ length: 140 }).map(
      (_, i) => `lvl-wave-${i.toString().padStart(3, '0')}`,
    );
  }, []);

  return (
    <Section ref={sectionRef}>
      <BackgroundDecoration />
      <SoundWaveContainer>
        {waveLineIds.map((id, i) => (
          <SoundWaveLine key={id} $delay={i % 10} />
        ))}
      </SoundWaveContainer>
      <Container>
        <Header>
          <Title>Impact Levels</Title>
          <Subtitle>Your gift powers real moments like these.</Subtitle>
          <CTAWrapper>
            <DonateButton
              href="https://www.classy.org/give/352794/#!/donation/checkout"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Donate to support GOGO"
            >
              Donate Now
            </DonateButton>
          </CTAWrapper>
        </Header>
        <Grid>
          {levels.map((l) => (
            <Card key={l.text} className="animate-child" style={{ opacity: 0 }}>
              <ThumbWrap>
                <Thumb
                  src={l.img}
                  alt={l.text}
                  loading="lazy"
                  decoding="async"
                />
              </ThumbWrap>
              <Caption>{l.text}</Caption>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default memo(ImpactLevelsSection);
