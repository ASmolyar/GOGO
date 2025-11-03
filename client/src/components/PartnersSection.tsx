import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import COLORS from '../../assets/colors.ts';

const PartnersSectionWrapper = styled.section`
  position: relative;
  padding: 6rem 0;
  background: radial-gradient(
      80rem 60rem at 10% -10%,
      rgba(79, 70, 229, 0.35),
      transparent
    ),
    radial-gradient(
      70rem 50rem at 110% 10%,
      rgba(16, 185, 129, 0.25),
      transparent
    ),
    linear-gradient(180deg, #121212 0%, #0f0f10 100%);
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    inset: -20% -10% auto -10%;
    height: 40rem;
    background: radial-gradient(
      closest-side,
      rgba(56, 189, 248, 0.15),
      transparent
    );
    filter: blur(40px);
    pointer-events: none;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
`;

const Heading = styled.div`
  text-align: center;
  margin-bottom: 2.25rem;
`;

// Eyebrow removed to avoid redundancy in title

const Title = styled.h2`
  margin: 0.9rem 0 0.4rem;
  font-size: 2.8rem;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: 0.01em;
  color: ${COLORS.gogo_blue};
`;

const SubTitle = styled.p`
  margin: 0 auto;
  max-width: 760px;
  color: #e5e7eb;
  font-size: 1.05rem;
`;

const GridLabel = styled.p`
  margin: 1rem 0 0;
  text-align: left;
  color: #cbd5e1;
  font-size: 0.95rem;
  font-weight: 700;
`;

// (Removed unused Tabs/Tab controls)

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
`;

const Badge = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  color: #f3f4f6;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(99, 102, 241, 0.35);
    background: linear-gradient(
      180deg,
      rgba(79, 70, 229, 0.14),
      rgba(255, 255, 255, 0.04)
    );
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  }
`;

const Dot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06) inset;
`;

const BadgeText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BadgeTitle = styled.span`
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.01em;
`;

const BadgeSub = styled.span`
  font-size: 0.85rem;
  color: #cbd5e1;
`;

// (Removed CTA buttons)

// (Removed unused StatsBar/StatPill controls)

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const TickerWrapper = styled.div`
  overflow: hidden;
  margin-top: 0.75rem;
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 8%,
    #000 92%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 8%,
    #000 92%,
    transparent 100%
  );
`;

const TickerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const ViewAllLink = styled.a`
  color: ${COLORS.gogo_blue};
  text-decoration: none;
  font-weight: 800;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  transition: all 0.2s ease;

  &:hover {
    color: #f8fafc;
    background: rgba(79, 70, 229, 0.2);
    border-color: rgba(99, 102, 241, 0.35);
  }
`;

const DonateButton = styled.a`
  color: #0b1020;
  text-decoration: none;
  font-weight: 800;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  background: ${COLORS.gogo_blue};
  transition: all 0.2s ease;
  margin-left: 0.5rem;

  &:hover {
    color: #f8fafc;
    background: ${COLORS.gogo_purple};
    border-color: rgba(99, 102, 241, 0.35);
  }
`;

const BetweenNote = styled.p`
  margin: 1rem 0 0.5rem;
  color: #cbd5e1;
  font-size: 0.95rem;
`;

const TickerTrack = styled.div`
  display: flex;
  width: max-content;
  gap: 0.75rem;
  padding: 0.15rem 0;
  animation: ${scroll} 30s linear infinite;
  will-change: transform;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  &:hover {
    animation-play-state: paused;
  }
`;

const TickerItem = styled.span`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
  font-weight: 800;
  font-size: 0.9rem;
`;

type CategoryKey =
  | 'Foundations'
  | 'Corporate & Individual'
  | 'Government'
  | 'Community & In‑Kind';

interface SupporterItem {
  name: string;
  descriptor?: string;
  url?: string;
  color: string;
}

type SupporterDirectory = Record<CategoryKey, SupporterItem[]>;

function PartnersSection(): JSX.Element {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.2 },
    );
    const section = document.querySelector('.partners-section');
    if (section) observer.observe(section);
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const data: SupporterDirectory = useMemo(
    () => ({
      Foundations: [
        { name: 'Helen V. Brach Foundation', color: COLORS.gogo_blue },
        {
          name: 'The Barry & Mimi Sternlicht Foundation',
          color: COLORS.gogo_purple,
        },
        { name: 'Lovett‑Woodsum Foundation', color: COLORS.gogo_teal },
        {
          name: 'Margaret & Daniel Loeb Family Foundation',
          color: COLORS.gogo_yellow,
        },
        { name: 'Cox‑Vadakan Foundation', color: COLORS.gogo_green },
        { name: 'The Howard & Paula Trienens Fund', color: COLORS.gogo_pink },
        { name: 'Shippy Foundation', color: '#60a5fa' },
      ],
      'Corporate & Individual': [
        { name: 'Daniel Lewis & Valerie Dillon', color: COLORS.gogo_purple },
        { name: 'Savage Content', color: COLORS.gogo_yellow },
        { name: 'Moss Foundation', color: COLORS.gogo_green },
        { name: 'MJ & Fred Wright', color: COLORS.gogo_teal },
        { name: 'Turner Investment Management', color: '#f59e0b' },
      ],
      Government: [
        {
          name: 'Office of Senator Elgie R. Sims, Jr.',
          descriptor: "Illinois' 17th District",
          color: '#86efac',
        },
        {
          name: 'Office of Senator Mattie Hunter',
          descriptor: "Illinois' 3rd District",
          color: '#93c5fd',
        },
        {
          name: 'Office of Senator Robert Peters',
          descriptor: "Illinois' 13th District",
          color: '#fda4af',
        },
      ],
      'Community & In‑Kind': [
        { name: 'McDermott Will & Emery', color: '#c4b5fd' },
      ],
    }),
    [],
  );

  // Partition donors into major vs other donors by category
  const majorCounts: Record<CategoryKey, number> = useMemo(
    () => ({
      Foundations: 7,
      'Corporate & Individual': 5,
      Government: 3,
      'Community & In‑Kind': 3,
    }),
    [],
  );

  const majorDonors: SupporterItem[] = useMemo(() => {
    return (Object.keys(data) as CategoryKey[]).flatMap((k) =>
      data[k].slice(0, majorCounts[k] || 0),
    );
  }, [data, majorCounts]);

  const otherDonorNames: string[] = useMemo(() => {
    const names = (Object.keys(data) as CategoryKey[]).flatMap((k) =>
      data[k].slice(majorCounts[k] || 0).map((i) => i.name),
    );
    // If not enough other donors exist, add placeholders
    const minOthers = 16;
    const placeholders: string[] = [];
    let counter = 1;
    while (names.length + placeholders.length < minOthers) {
      const next = counter + 1;
      placeholders.push(`Supporter ${counter}`);
      counter = next;
    }
    return [...names, ...placeholders];
  }, [data, majorCounts]);

  const tickerNames = useMemo(() => {
    const list = [...otherDonorNames];
    return [...list, ...list];
  }, [otherDonorNames]);

  const renderBadges = (items: SupporterItem[], delayBase = 0) =>
    items.map((item, idx) => (
      <Badge
        key={item.name}
        href={item.url || 'https://guitarsoverguns.org/supporters/'}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${item.name}${
          item.descriptor ? `, ${item.descriptor}` : ''
        }`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity .45s ease ${
            delayBase + idx * 0.05
          }s, transform .45s ease ${delayBase + idx * 0.05}s`,
        }}
      >
        <Dot $color={item.color} />
        <BadgeText>
          <BadgeTitle>{item.name}</BadgeTitle>
          {item.descriptor && <BadgeSub>{item.descriptor}</BadgeSub>}
        </BadgeText>
      </Badge>
    ));

  return (
    <PartnersSectionWrapper className="partners-section">
      <SectionContainer>
        <Heading>
          <Title>Our Supporters</Title>
          <SubTitle>
            Thank you to every donor and partner—your generosity makes Guitars
            Over Guns possible.
          </SubTitle>
        </Heading>

        <GridLabel>Major Supporters ($25,000+)</GridLabel>
        <Grid aria-live="polite">{renderBadges(majorDonors)}</Grid>

        <BetweenNote>
          The supporters below represent additional donors who make our work
          possible. Our $25,000+ list highlights a featured selection; please
          see the full roll at the link below.
        </BetweenNote>

        <TickerRow>
          <TickerWrapper aria-hidden>
            <TickerTrack>
              {tickerNames.map((label, index) => (
                <TickerItem key={`other-${index}-${label}`}>{label}</TickerItem>
              ))}
            </TickerTrack>
          </TickerWrapper>
          <div>
            <ViewAllLink
              href="https://guitarsoverguns.org/supporters/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View all supporters on guitars over guns website"
            >
              View all our supporters ↗
            </ViewAllLink>
            <DonateButton
              href="https://www.classy.org/give/352794/#!/donation/checkout"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Donate to Guitars Over Guns"
            >
              Donate
            </DonateButton>
          </div>
        </TickerRow>
      </SectionContainer>
    </PartnersSectionWrapper>
  );
}

export default PartnersSection;
