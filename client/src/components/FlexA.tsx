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
  margin: 0.25rem 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.02em;
`;

const Quote = styled.blockquote`
  margin: 1rem 0 1.25rem;
  padding: 0.25rem 0 0.25rem 1rem;
  border-left: 4px solid ${COLORS.gogo_blue};
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
`;

const QuoteAuthor = styled.cite`
  display: block;
  margin-top: 0.35rem;
  color: rgba(255, 255, 255, 0.65);
  font-style: normal;
  font-weight: 700;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
`;

const StatLabel = styled.div`
  margin-top: 0.25rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
`;

const BigImage = styled.div<{ $src: string }>`
  margin-top: 1.75rem;
  border-radius: 16px;
  background: url('${(p) => p.$src}') center/cover no-repeat;
  width: 100%;
  height: 440px;
`;

function FlexA(): JSX.Element {
  return (
    <Wrapper>
      <Container>
        <Reveal variant="fade-up">
          <div>
            <Label $bg={COLORS.gogo_yellow}>Program Spotlight</Label>
            <Title>Overtown Youth Center</Title>
            <Copy>
              A staple of Miami's historic Overtown neighborhood, OYC is a hub
              for community empowerment and enrichment. With a program launch in
              December 2023, mentors now facilitate programming both after
              school and during the summer.
            </Copy>
            <Copy>
              During GOGO's summer camp at OYC, students created original songs
              and emboldened one another through friendly competition. The
              process culminated in two of the catchiest hits of the summer.
            </Copy>
            <Quote>
              “The studio became our safe space. It's where we learned to listen
              to each other, to lead, and to be heard.”
              <QuoteAuthor>— OYC Student, Class of 2024</QuoteAuthor>
            </Quote>
            <Copy>
              Alongside songwriting and performance fundamentals, mentors embed
              social-emotional learning throughout sessions. Students practice
              goal-setting, collaboration, and reflective critique—skills that
              transfer beyond music into classrooms and communities.
            </Copy>
            <BigImage $src={'https://picsum.photos/1400/800?random=21'} />
            <Subhead>By the numbers</Subhead>
            <StatsGrid>
              <StatCard>
                <StatNumber>18</StatNumber>
                <StatLabel>Active mentors</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>42</StatNumber>
                <StatLabel>Original songs produced</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>12</StatNumber>
                <StatLabel>Showcase performances</StatLabel>
              </StatCard>
            </StatsGrid>
          </div>
        </Reveal>
      </Container>
    </Wrapper>
  );
}

export default FlexA;
