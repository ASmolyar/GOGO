import React from 'react';
import styled from 'styled-components';
import { Reveal } from '../../animations';
import COLORS from '../../assets/colors';

const Wrapper = styled.section`
  padding: 5rem 0;
  background: #0f0f0f;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Split = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.div<{ $bg: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 0.8rem;
  background: ${(p) => p.$bg};
  color: #111;
`;

const Title = styled.h2`
  margin: 12px 0 16px;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.05;
  color: #fff;
`;

const Copy = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0 0 1rem;
`;

const Subhead = styled.h3`
  margin: 0.25rem 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.02em;
`;

const BulletList = styled.ul`
  margin: 0.25rem 0 1rem 1.25rem;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    margin: 0 0 0.5rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
  }

  li::before {
    content: '';
    position: absolute;
    left: -1.25rem;
    top: 0.6rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${COLORS.gogo_purple};
  }
`;

const Quote = styled.blockquote`
  margin: 0.75rem 0 1rem;
  padding: 0.25rem 0 0.25rem 1rem;
  border-left: 4px solid ${COLORS.gogo_purple};
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
`;

const SplitBox = styled.div`
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
`;

const SplitImage = styled.div<{ $src: string }>`
  border-radius: 16px;
  min-height: 380px;
  background: url('${(p) => p.$src}') center/cover no-repeat;
`;

function FlexB(): JSX.Element {
  return (
    <Wrapper>
      <Container>
        <Reveal variant="fade-up">
          <Split>
            <SplitBox>
              <Label $bg={COLORS.gogo_purple}>Program Spotlight</Label>
              <Title style={{ marginTop: 12 }}>
                A Different Outlook on Life
              </Title>
              <Subhead>Restorative storytelling</Subhead>
              <Copy>
                Youth involved in the justice system often have stories told
                about them, but don't always have the chance to tell their own.
                Through songwriting, production, and performance, students
                author counter-narratives that center healing and agency.
              </Copy>
              <Copy>
                Sessions balance technical craft with reflection. Each project
                includes time for setting intentions, peer feedback, and
                celebrating milestones so students see progress and possibility.
              </Copy>
              <BulletList>
                <li>
                  Weekly studio time with mentor co-writing and production
                </li>
                <li>
                  Peer circles for feedback and collaborative problem solving
                </li>
                <li>Community showcases to build pride and confidence</li>
              </BulletList>
              <Quote>
                “I didn’t think anyone wanted to hear me. Now I know my voice
                matters—and I’ve got the track to prove it.”
              </Quote>
            </SplitBox>
            <SplitImage $src={'https://picsum.photos/1000/1200?random=22'} />
          </Split>
        </Reveal>
      </Container>
    </Wrapper>
  );
}

export default FlexB;
