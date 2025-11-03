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
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

const BigImage = styled.div<{ $src: string }>`
  border-radius: 16px;
  background: url('${(p) => p.$src}') center/cover no-repeat;
  width: 100%;
  height: 420px;
`;

const Band = styled.div`
  background: linear-gradient(90deg, ${COLORS.gogo_teal}, ${COLORS.gogo_blue});
  border-radius: 18px;
  padding: 2rem;
`;

const BandInner = styled.div`
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const BandItem = styled.div`
  color: #fff;
`;

const ImageCaption = styled.div`
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
`;

const Quote = styled.blockquote`
  margin: 0.75rem 0 1rem;
  padding: 0.25rem 0 0.25rem 1rem;
  border-left: 4px solid ${COLORS.gogo_teal};
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
`;

function FlexC(): JSX.Element {
  return (
    <Wrapper>
      <Container>
        <Reveal variant="fade-up">
          <div>
            <Label $bg={COLORS.gogo_teal}>New York City</Label>
            <Title>Mini Documentary</Title>
            <Copy>
              Capturing the work being done during our New York launch was
              essential. The film follows students and mentors across
              rehearsals, studio sessions, and the culminating performance at a
              community venue.
            </Copy>
            <Copy>
              Between scenes, students share the why behind their art—stories of
              perseverance, family, and joy. The result is a portrait of a
              creative community in motion.
            </Copy>
            <BigImage $src={'https://picsum.photos/1400/700?random=23'} />
            <ImageCaption>
              Still from the documentary: final mix session
            </ImageCaption>
            <Quote>
              “When the beat drops and the crowd responds, you can feel a whole
              neighborhood breathing together.”
            </Quote>
            <Band style={{ marginTop: '1.25rem' }}>
              <BandInner>
                <BandItem>
                  <strong>
                    “Transformative power of music is undeniable.”
                  </strong>
                </BandItem>
                <BandItem>
                  <strong>48 mentors</strong>
                  <div>collaborated across sites</div>
                </BandItem>
                <BandItem>
                  <strong>120+ students</strong>
                  <div>featured in media</div>
                </BandItem>
                <BandItem>
                  <strong>Scan to watch</strong>
                  <div>(placeholder QR area)</div>
                </BandItem>
                <BandItem>
                  <strong>3 boroughs</strong>
                  <div>represented across filming</div>
                </BandItem>
                <BandItem>
                  <strong>9 tracks</strong>
                  <div>featured on the soundtrack</div>
                </BandItem>
              </BandInner>
            </Band>
          </div>
        </Reveal>
      </Container>
    </Wrapper>
  );
}

export default FlexC;
