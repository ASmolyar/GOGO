import React, { useEffect, useRef, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';

const Section = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, #171717 0%, #121212 100%);
  position: relative;
  overflow: hidden;
`;

// Musical ambience
const floatUp = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.6; }
  100% { transform: translateY(-140px) translateX(18px); opacity: 0; }
`;

const equalize = keyframes`
  0% { transform: scaleY(0.6); }
  50% { transform: scaleY(1.2); }
  100% { transform: scaleY(0.6); }
`;

const StaffBlock = styled.div<{ $top: string }>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${(p) => p.$top};
  height: 140px;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    #ffffff,
    #ffffff 1px,
    transparent 1px,
    transparent 28px
  );
`;

const NoteCloud = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

const Note = styled.span<{ $left: string; $delay: number; $color?: string }>`
  position: absolute;
  bottom: -40px;
  left: ${(p) => p.$left};
  color: ${(p) => p.$color ?? 'rgba(255, 255, 255, 0.45)'};
  font-size: clamp(12px, 2.2vw, 20px);
  animation: ${floatUp} 8s linear infinite;
  animation-delay: ${(p) => p.$delay}s;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.2));
`;

const Glow = styled.div<{
  $color: string;
  $top: string;
  $left?: string;
  $right?: string;
}>`
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(100px);
  background: ${(p) => p.$color}14;
  top: ${(p) => p.$top};
  left: ${(p) => p.$left ?? 'auto'};
  right: ${(p) => p.$right ?? 'auto'};
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.6rem;
  font-weight: 900;
  margin: 0 0 1rem;
  background: linear-gradient(90deg, ${COLORS.gogo_blue}, ${COLORS.gogo_teal});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.02em;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.78);
  margin: 0 auto;
  max-width: 820px;
`;

const EqRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
  margin-top: 1rem;
  opacity: 0.7;
`;

const EqBar = styled.div<{ $h: number; $d: number; $c: string }>`
  width: 3px;
  height: ${(p) => p.$h}px;
  background: ${(p) => p.$c};
  border-radius: 2px;
  transform-origin: bottom center;
  animation: ${equalize} 1.6s ease-in-out infinite;
  animation-delay: ${(p) => p.$d}s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.6rem;
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, background 0.3s ease;
  opacity: 0;
  transform: translateY(20px);

  &:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 0.6rem;
  font-size: 1.2rem;
  color: white;
  font-weight: 800;
`;

const CardText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 0.98rem;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1rem;
`;

const Badge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${(p) => p.$color ?? 'rgba(255, 255, 255, 0.08)'};
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: white;
`;

const Timeline = styled.div`
  margin-top: 2.5rem;
  position: relative;
  padding-left: 1.5rem;

  &:before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0.2rem;
    bottom: 0.2rem;
    width: 3px;
    background: linear-gradient(${COLORS.gogo_blue}, ${COLORS.gogo_purple});
    border-radius: 2px;
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 1.2rem;
`;

const Dot = styled.div`
  position: absolute;
  left: -1.03rem;
  top: 0.35rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${COLORS.gogo_blue};
  box-shadow: 0 0 0 4px ${COLORS.gogo_blue}33;
`;

const TimelineText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

function CurriculumSection(): JSX.Element {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const notes = useMemo(
    () => [
      { ch: '♪', left: '6%', delay: 0.1, color: `${COLORS.gogo_blue}aa` },
      { ch: '♫', left: '18%', delay: 0.6, color: `${COLORS.gogo_teal}aa` },
      { ch: '♩', left: '28%', delay: 1.2 },
      { ch: '♬', left: '38%', delay: 0.3, color: `${COLORS.gogo_purple}aa` },
      { ch: '♪', left: '52%', delay: 0.9 },
      { ch: '♩', left: '63%', delay: 1.4, color: `${COLORS.gogo_pink}aa` },
      { ch: '♫', left: '74%', delay: 0.2 },
      { ch: '♬', left: '86%', delay: 1.1, color: `${COLORS.gogo_green}aa` },
    ],
    [],
  );

  useEffect(() => {
    if (headerRef.current) {
      const nodes = headerRef.current.querySelectorAll('.animate');
      if (nodes && nodes.length > 0) {
        animate(nodes, {
          opacity: [0, 1],
          translateY: [20, 0],
          delay: stagger(120),
          duration: 700,
          easing: 'easeOutCubic',
        });
      }
    }
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length) {
      animate(cards, {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(80, { start: 300 }),
        duration: 700,
        easing: 'easeOutCubic',
      });
    }
  }, []);

  const setCardRef = (el: HTMLDivElement | null, idx: number) => {
    if (el) {
      while (cardRefs.current.length <= idx) cardRefs.current.push(null as any);
      cardRefs.current[idx] = el;
    }
  };

  return (
    <Section>
      <StaffBlock $top="10%" />
      <StaffBlock $top="72%" />
      <NoteCloud>
        {notes.map((n, i) => (
          <Note
            key={`note-${i}`}
            $left={n.left}
            $delay={n.delay}
            $color={n.color}
          >
            {n.ch}
          </Note>
        ))}
      </NoteCloud>
      <Glow $color={COLORS.gogo_blue} $top="-10%" $left="-5%" />
      <Glow $color={COLORS.gogo_purple} $top="60%" $right="-10%" />
      <Container>
        <Header ref={headerRef}>
          <Title className="animate">Curriculum & Program Model</Title>
          <Subtitle className="animate">
            Every session runs like a band practice: we soundcheck together,
            pick from a shared setlist, and co‑arrange the music. Students lead
            artistic choices—from song selection and structure to visuals and
            performance planning.
          </Subtitle>
          <EqRow className="animate">
            {[5, 10, 16, 22, 18, 12, 8, 14, 20, 9, 6].map((h, i) => (
              <EqBar
                key={`eq-${i}`}
                $h={8 + h}
                $d={i * 0.08}
                $c={
                  i % 3 === 0
                    ? COLORS.gogo_blue
                    : i % 3 === 1
                    ? COLORS.gogo_purple
                    : COLORS.gogo_teal
                }
              />
            ))}
          </EqRow>
        </Header>

        <Grid>
          <Card ref={(el) => setCardRef(el, 0)}>
            <CardTitle>Opening Chorus</CardTitle>
            <CardText>
              We start with an opening circle and a shared song to tune the
              room—building community, voice, and confidence. Mentors and
              students shape the groove together.
            </CardText>
            <BadgeRow>
              <Badge>Soundcheck</Badge>
              <Badge>House Setlist</Badge>
              <Badge>Band‑Led</Badge>
            </BadgeRow>
          </Card>

          <Card ref={(el) => setCardRef(el, 1)}>
            <CardTitle>Weekly Setlist</CardTitle>
            <CardText>
              After‑school programs rehearse twice weekly; community sites run
              3‑hour jam blocks. Instruments and backline are provided at no
              cost.
            </CardText>
            <BadgeRow>
              <Badge $color={`${COLORS.gogo_blue}33`}>2 rehearsals/week</Badge>
              <Badge $color={`${COLORS.gogo_purple}33`}>3h jam blocks</Badge>
              <Badge $color={`${COLORS.gogo_teal}33`}>Backline provided</Badge>
            </BadgeRow>
          </Card>

          <Card ref={(el) => setCardRef(el, 2)}>
            <CardTitle>Culminating Releases</CardTitle>
            <CardText>
              Learning crescendos with live shows, studio sessions, exhibitions,
              and drops— students take the lead on and off stage and celebrate
              growth.
            </CardText>
            <BadgeRow>
              <Badge>Live Shows</Badge>
              <Badge>Studio Sessions</Badge>
              <Badge>Release Parties</Badge>
            </BadgeRow>
          </Card>
        </Grid>

        <Timeline>
          <TimelineItem>
            <Dot />
            <TimelineText>
              Soundcheck & Opening Circle → Community agreements and vibe check
            </TimelineText>
          </TimelineItem>
          <TimelineItem>
            <Dot />
            <TimelineText>
              Rehearsal & Groove → Skill‑building through ensemble practice
            </TimelineText>
          </TimelineItem>
          <TimelineItem>
            <Dot />
            <TimelineText>
              Arrangement & Reflection → Student‑led decisions and goal‑setting
            </TimelineText>
          </TimelineItem>
        </Timeline>
      </Container>
    </Section>
  );
}

export default CurriculumSection;
