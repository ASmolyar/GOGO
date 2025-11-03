import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  FC,
} from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
import photo9 from '../../assets/missionPhotos/Photo9.jpg';
import photo10 from '../../assets/missionPhotos/Photo10.jpg';
import photo11 from '../../assets/missionPhotos/Photo11.jpg';
import photo12 from '../../assets/missionPhotos/Photo12.jpg';
import photo13 from '../../assets/missionPhotos/Photo13.jpg';
import photo14 from '../../assets/missionPhotos/Photo14.jpg';

// Label colors for TurntableStat
const TURNTABLE_LABEL_COLORS: Array<{ a: string; b: string }> = [
  { a: COLORS.gogo_yellow, b: COLORS.gogo_pink },
  { a: COLORS.gogo_teal, b: COLORS.gogo_blue },
  { a: COLORS.gogo_purple, b: COLORS.gogo_green },
  { a: COLORS.gogo_pink, b: COLORS.gogo_yellow },
];

// Ambient gradient animation
const ambientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// (removed: pulse/countUp animations as stats were removed)

// Add these new keyframes at the top with other animations
const blobAnimation = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
`;

const blobAnimation2 = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-30px, 50px) scale(0.9);
  }
  66% {
    transform: translate(20px, -20px) scale(1.1);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
`;

// Spotify-inspired audio wave animation
const audioWave = keyframes`
  0% { height: 5px; }
  20% { height: 20px; }
  40% { height: 10px; }
  60% { height: 25px; }
  80% { height: 15px; }
  100% { height: 5px; }
`;

// Subtle rotating gradient animation for accents
const gradientRotate = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// New styled components for updated sections
const ImpactContainer = styled.section`
  padding: 3rem 0;
  background: linear-gradient(180deg, #171717 0%, #121212 100%);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${COLORS.gogo_blue}88,
      ${COLORS.gogo_pink}88,
      ${COLORS.gogo_purple}88,
      ${COLORS.gogo_green}88
    );
    z-index: 1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      ${COLORS.gogo_purple}10,
      transparent 70%
    );
    z-index: 0;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const GradientBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    ${COLORS.gogo_blue}22 0%,
    ${COLORS.gogo_purple}22 30%,
    ${COLORS.gogo_pink}22 60%,
    transparent 90%
  );
  background-size: 100% 100%;
  z-index: 0;
  filter: blur(60px);
  opacity: 0.5;
  pointer-events: none;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.02em;
`;

const Subtitle = styled.div`
  font-size: 1.3rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StatsTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 900;
  color: white;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  padding: 1.2rem 1.2rem 1.6rem;
  border-radius: 16px;
  background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.03) 0 2px,
      rgba(0, 0, 0, 0) 2px 6px
    ),
    linear-gradient(180deg, rgba(18, 18, 18, 0.9), rgba(12, 12, 12, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  text-align: center;
`;

// Turntable stats styling
const TurntableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const TurntableCard = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 1.25rem 1.25rem 1.5rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  user-select: none;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.04)
    );
  }
`;

// Outcomes highlights chips styling (under records)
const HighlightsContainer = styled.div`
  margin-top: 1.75rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0.02)
  );
  border: 1px solid rgba(255, 255, 255, 0.07);
`;

const HighlightsTitle = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 800;
  letter-spacing: 0.02em;
  margin-bottom: 0.75rem;
`;

const HighlightsSubtitle = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.98rem;
  margin-bottom: 1rem;
`;

const HighlightsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
`;

const HighlightChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: white;
  font-weight: 700;
  font-size: 0.92rem;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    color: ${COLORS.gogo_blue};
  }

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.14);
  }
`;

const HighlightCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const HighlightCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  transition: transform 0.25s ease, background 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.14);
  }
`;

const HighlightCardTitle = styled.div`
  color: #fff;
  font-weight: 800;
  margin-bottom: 0.35rem;
  letter-spacing: 0.01em;
`;

const HighlightCardText = styled.div`
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.95rem;
  line-height: 1.5;
`;

const Deck = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  height: auto;
  border-radius: 14px;
  background: linear-gradient(145deg, #1b1b1b, #101010);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  display: grid;
  place-items: center;
  margin: 0 auto;
  max-width: 240px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Record = styled.div`
  --spin-speed: 4.5s;
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(
      closest-side,
      rgba(0, 0, 0, 0) 77%,
      rgba(0, 0, 0, 0.6) 78%,
      rgba(0, 0, 0, 0) 79%
    ),
    repeating-radial-gradient(
      circle at center,
      #121212 0px,
      #121212 2px,
      #0c0c0c 2px,
      #0c0c0c 4px
    );
  animation: ${spin} var(--spin-speed) linear infinite;
  animation-play-state: paused;
  will-change: transform;

  &.playing {
    animation-play-state: running;
  }
`;

const RecordLabel = styled.div<{ $colorA: string; $colorB: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    ${(p) => p.$colorA},
    ${(p) => p.$colorB}
  );
  color: white;
  font-weight: 1100;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.35);
`;

const Spindle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 3px;
  transform: translate(-50%, -50%);
  background: #d9d9d9;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #111, 0 0 0 3px rgba(255, 255, 255, 0.08);
`;

const Tonearm = styled.div<{ $engaged: boolean }>`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 160px;
  height: 160px;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    right: 8px;
    top: 8px;
    width: 96px;
    height: 6px;
    background: linear-gradient(90deg, #bfbfbf, #6f6f6f);
    border-radius: 6px;
    transform-origin: calc(100% - 8px) 50%;
    transform: rotate(${(p) => (p.$engaged ? '-28deg' : '0deg')});
    transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  &::after {
    content: '';
    position: absolute;
    right: 94px;
    top: 4px;
    width: 14px;
    height: 14px;
    background: #eee;
    border-radius: 50%;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
  }
`;

const StatCaption = styled.div`
  margin-top: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.4;
`;

// Removed confetti

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
  text-align: center;

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

// (removed: PercentageCircle/PercentageText as stats were removed)

// (removed: vinyl stat visualization)

const StatDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  z-index: 1;
  position: relative;
`;

const SubsectionTitle = styled.h3`
  font-size: 2rem;
  color: white;
  margin: 4rem 0 1.5rem;
  position: relative;
  padding-left: 1rem;
  display: inline-block;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${COLORS.gogo_blue};
    border-radius: 4px;
  }
`;

const SubsectionContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const MeasurementCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const MeasurementTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${COLORS.gogo_yellow};
  margin-bottom: 1.2rem;
  position: relative;
  padding-bottom: 1rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: ${COLORS.gogo_yellow}66;
    border-radius: 3px;
  }
`;

const MeasurementList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const MeasurementItem = styled.li`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.8rem;
  padding-left: 1.8rem;
  position: relative;
  line-height: 1.5;

  &:before {
    content: '•';
    color: ${COLORS.gogo_teal};
    position: absolute;
    left: 0;
    font-size: 1.5rem;
    line-height: 1;
  }

  &:hover {
    color: white;
    transform: translateX(3px);
    transition: all 0.2s ease;
  }
`;

// Background shimmer effect
const shimmerEffect = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const Blob = styled.div<{
  color: string;
  size: string;
  top: string;
  left: string;
  delay: string;
}>`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  background: ${(props) => props.color};
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.3;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  animation: ${blobAnimation} 15s ease-in-out infinite;
  animation-delay: ${(props) => props.delay};
  z-index: 0;
`;

const Blob2 = styled(Blob)`
  animation: ${blobAnimation2} 20s ease-in-out infinite;
`;

// Update the MeasurementContainer with Spotify-like styling
const MeasurementContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #1e1e1e 0%, #121212 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 20% 25%,
      rgba(109, 174, 132, 0.15) 0%,
      transparent 50%
    );
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 80% 75%,
      rgba(30, 215, 96, 0.15) 0%,
      transparent 50%
    );
    z-index: 0;
  }
`;

const MeasurementWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SpotifyCard = styled.div`
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(25, 25, 25, 0.9) 0%,
    rgba(18, 18, 18, 0.8) 100%
  );
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    border-color: rgba(30, 215, 96, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #1ed760, #169c46);
    opacity: 0.7;
    z-index: 1;
  }
`;

// Change MeasurementHeader to have Spotify-like left alignment with accent bar
const MeasurementHeader = styled.div`
  text-align: left;
  margin-top: -2rem;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: linear-gradient(180deg, #1ed760, #169c46);
    border-radius: 4px;
  }
`;

// Update MeasureTitle to have Spotify-like typography
const MeasureTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
  line-height: 1.1;

  .highlight {
    color: #1ed760;
    position: relative;
    z-index: 1;
    font-style: italic;
  }

  .regular {
    opacity: 0.9;
  }
`;

const SpotifySubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 70vw;
  margin-top: 0.5rem;
  line-height: 1.6;
`;

const AudioWaveContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 30px;
  gap: 3px;
  margin: 1.5rem 0;
`;

const AudioBar = styled.div<{ $index: number }>`
  width: 4px;
  background: linear-gradient(to top, #1ed760, #169c46);
  border-radius: 2px;
  height: 5px;
  animation: ${audioWave} 1.5s ease infinite;
  animation-delay: ${(props) => props.$index * 0.1}s;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SpotifyGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SpotifyMethodsList = styled.div`
  margin-bottom: 2rem;
`;

const SpotifyMethod = styled.div`
  background: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border-left: 3px solid rgba(30, 215, 96, 0.5);

  &:hover {
    background: rgba(40, 40, 40, 0.6);
    transform: translateX(5px);
    border-left-color: #1ed760;
  }
`;

const MethodName = styled.h4`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  letter-spacing: 0.02em;

  svg {
    margin-right: 0.5rem;
    color: #1ed760;
  }
`;

const MethodDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ToolsSection = styled.div`
  background: rgba(30, 30, 30, 0.5);
  border-radius: 12px;
  padding: 1.5rem;

  h3 {
    color: white;
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.8rem;
  }
`;

const ToolItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    .tool-name {
      color: #1ed760;
    }
  }
`;

const ToolIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1ed760, #169c46);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  svg {
    color: white;
    width: 16px;
    height: 16px;
  }
`;

const ToolInfo = styled.div`
  flex: 1;
`;

const ToolName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.2s ease;
`;

const ToolDescription = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: 0.2rem;
`;

// Top/bottom image belts with brand duotone treatment
const BeltContainer = styled.div`
  overflow: hidden;
  position: relative;
  padding: 1.25rem 0;
  z-index: 0;
`;

const BeltTrack = styled.div<{ $direction: 'left' | 'right' }>`
  display: inline-flex;
  width: max-content;
  will-change: transform;
  animation: ${(p) =>
      p.$direction === 'left' ? 'scroll-left' : 'scroll-right'}
    28s linear infinite;

  @keyframes scroll-left {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
  @keyframes scroll-right {
    from {
      transform: translateX(-50%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const BeltCard = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 0.8rem;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #111;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.05) brightness(0.9) sepia(12%)
      hue-rotate(320deg) saturate(110%);
    mix-blend-mode: screen;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      ${COLORS.gogo_blue}33,
      ${COLORS.gogo_purple}22
    );
    pointer-events: none;
  }
`;

// Outcomes and PYD capacities
const OutcomesContainer = styled.section`
  background: linear-gradient(180deg, #121212 0%, #0e0e0e 100%);
  position: relative;
  padding: 4rem 0 1rem;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 50%;
    height: 70%;
    background: radial-gradient(circle, ${COLORS.gogo_blue}22, transparent 70%);
  }
`;

const CapacitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
`;

const CapacityCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.25rem;
  min-height: 130px;
  transition: transform 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const CapacityTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: white;
  font-weight: 800;
  letter-spacing: 0.02em;
`;

const CapacityText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95rem;
  line-height: 1.5;
`;

const OutcomesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const OutcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const OutcomeNumber = styled.div`
  font-size: 2.4rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
`;

const OutcomeLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
`;

// (removed guitar-specific styled components)

// SVG Icon components for method icons
function InsightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16.5V8.5M12 8.5L15 11.5M12 8.5L9 11.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArtisticIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12H4.5M4.5 12C5.88071 12 7 10.8807 7 9.5C7 8.11929 5.88071 7 4.5 7C3.11929 7 2 8.11929 2 9.5C2 10.8807 3.11929 12 4.5 12ZM19.5 12H22M19.5 12C18.1193 12 17 10.8807 17 9.5C17 8.11929 18.1193 7 19.5 7C20.8807 7 22 8.11929 22 9.5C22 10.8807 20.8807 12 19.5 12ZM12 19.5V22M12 19.5C10.6193 19.5 9.5 18.3807 9.5 17C9.5 15.6193 10.6193 14.5 12 14.5C13.3807 14.5 14.5 15.6193 14.5 17C14.5 18.3807 13.3807 19.5 12 19.5ZM12 4.5V2M12 4.5C13.3807 4.5 14.5 5.61929 14.5 7C14.5 8.38071 13.3807 9.5 12 9.5C10.6193 9.5 9.5 8.38071 9.5 7C9.5 5.61929 10.6193 4.5 12 4.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AcademicIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 14L3 8.5L12 3L21 8.5L12 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 13.5L12 19L21 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18.5L12 24L21 18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrackingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 17L4 12L9 7M15 7L20 12L15 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Hoisted out of ImpactSection to satisfy react/no-unstable-nested-components
const TurntableStat: FC<{ n: number; l: string; i: number }> =
  function TurntableStat({ n, l, i }) {
    const storageKey = `turntable:${l}`;
    const [playing, setPlaying] = useState(false);
    const recordRef = useRef<HTMLDivElement | null>(null);
    const [speedMs, setSpeedMs] = useState(4500);
    const [hovered, setHovered] = useState(false);

    const toggle = useCallback(() => setPlaying((p) => !p), []);

    const onHover = useCallback(() => {
      setHovered(true);
      setPlaying(true);
    }, []);
    const onLeave = useCallback(() => {
      setHovered(false);
      setPlaying(false);
    }, []);

    const onWheel = useCallback((e: React.WheelEvent) => {
      setSpeedMs((prev) => {
        const next = Math.min(
          7000,
          Math.max(1200, prev + (e.deltaY > 0 ? 350 : -350)),
        );
        return next;
      });
    }, []);

    useEffect(() => {
      if (recordRef.current) {
        recordRef.current.style.setProperty('--spin-speed', `${speedMs}ms`);
      }
    }, [speedMs]);

    // Load persisted state (speed only)
    useEffect(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as { speedMs?: number };
          if (typeof parsed.speedMs === 'number') setSpeedMs(parsed.speedMs);
        }
      } catch {
        /* no-op */
      }
    }, [storageKey]);

    // Persist on change (speed only)
    useEffect(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ speedMs }));
      } catch {
        /* no-op */
      }
    }, [speedMs, storageKey]);

    return (
      <TurntableCard
        role="group"
        aria-label={`${n}% ${l}`}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <Deck onWheel={onWheel}>
          <Record
            ref={recordRef}
            className={playing ? 'playing' : ''}
            onClick={toggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggle();
            }}
            aria-pressed={playing}
          >
            <RecordLabel
              $colorA={
                TURNTABLE_LABEL_COLORS[i % TURNTABLE_LABEL_COLORS.length].a
              }
              $colorB={
                TURNTABLE_LABEL_COLORS[i % TURNTABLE_LABEL_COLORS.length].b
              }
            >
              {n}
              <span style={{ fontSize: '0.7rem', marginLeft: 2 }}>%</span>
            </RecordLabel>
            <Spindle />
          </Record>
          <Tonearm $engaged={hovered || playing} />
        </Deck>
        <StatCaption>{l}</StatCaption>
      </TurntableCard>
    );
  };

function ImpactSection(): JSX.Element {
  const [inView, setInView] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Create refs for each impact stat
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef(null);
  const stringsRef = useRef<HTMLDivElement[] | null[]>([]);

  // (removed guitar refs/geometry)

  // (removed impactData)

  // Function to animate progress circles - wrap in useCallback
  // (removed animateProgress)

  // Intersection observer to trigger header animation when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.unobserve(entries[0].target);

          // Animate header with staggered entrance
          if (headerRef.current) {
            const items = headerRef.current.querySelectorAll('.animate-item');
            if (items && items.length > 0) {
              animate(items, {
                opacity: [0, 1],
                translateY: [30, 0],
                delay: stagger(150),
                duration: 800,
                easing: 'easeOutCubic',
              });
            }
          }
        }
      },
      { threshold: 0.2 },
    );

    // Save current section reference to avoid issues in cleanup
    const currentSection = sectionRef.current;

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.disconnect();
      }
    };
  }, []);

  // (removed count up logic)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setExpanded(entry.isIntersecting);
      },
      { threshold: 0.5 },
    );
    if (measureRef.current) observer.observe(measureRef.current);
    return () => observer.disconnect();
  }, []);

  // Build a sine-like path for a string with damping over time
  /* const buildSinePath = useCallback(
    (y0: number, amp: number, tSeconds: number, freqHz: number): string => {
      const damping = 3.2; // exponential damping factor
      const width = endX - startX;
      const wavesAlong = 2; // number of spatial waves along the length
      const samples = 40;
      const A = amp * Math.exp(-damping * tSeconds);
      let d = `M ${startX} ${y0}`;
      for (let i = 1; i <= samples; i += 1) {
        const x = startX + (i * width) / samples;
        const kx = 2 * Math.PI * wavesAlong * ((x - startX) / width);
        const y = y0 + A * Math.sin(kx - 2 * Math.PI * freqHz * tSeconds);
        d += ` L ${x} ${y}`;
      }
      return d;
    },
    [endX, startX],
  ); */

  /* const animateString = useCallback(
    (index: number, intensity: number = 14) => {
      const path = stringPathRefs.current[index];
      if (!path) return;

      // Cancel previous animation for this string
      const prev = stringAnimsRef.current[index];
      if (prev && typeof prev.pause === 'function') prev.pause();

      const baseY = stringY[index] ?? 140;
      const freqHz = 5 - index * 0.5; // higher strings vibrate faster
      const duration = 1400;
      const animState = { elapsedMs: 0 } as { elapsedMs: number };
      const anim = animate(animState, {
        elapsedMs: [0, duration],
        duration,
        easing: 'linear',
        update: () => {
          const tSeconds = animState.elapsedMs / 1000;
          const d = buildSinePath(baseY, intensity, tSeconds, freqHz);
          path.setAttribute('d', d);
        },
        complete: () => {
          // settle back to straight line
          path.setAttribute('d', `M ${startX} ${baseY} L ${endX} ${baseY}`);
        },
      });
      stringAnimsRef.current[index] = anim as any;
    },
    [buildSinePath, endX, startX, stringY],
  ); */

  /* const handleGuitarMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!guitarSvgRef.current) return;
      const rect = guitarSvgRef.current.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const prevY = lastMouseYRef.current;
      const now = performance.now();
      if (prevY != null) {
        stringY.forEach((y, i) => {
          const crossed =
            (prevY - y) * (mouseY - y) <= 0 && Math.abs(mouseY - y) < 16;
          if (crossed && now - lastTriggerTimesRef.current[i] > 180) {
            lastTriggerTimesRef.current[i] = now;
            animateString(i, 12);
          }
        });
      }
      lastMouseYRef.current = mouseY;
    },
    [animateString, stringY],
  ); */

  /* const handleStringVibrate = useCallback(() => {
    // apply a quick wobble to all strings
    stringsRef.current.forEach((el, i) => {
      if (!el) return;
      animate(el, {
        rotateZ: [0, i % 2 === 0 ? 4 : -4, 0],
        duration: 240,
        easing: 'easeOutSine',
      });
    });
  }, []); */

  const impactStats = [
    { n: 94, l: 'made or maintained academic gains' },
    { n: 85, l: 'showed measurable growth across PYD capacities' },
    { n: 90, l: 'felt their mentor can be counted on for help' },
    { n: 87, l: 'felt encouraged to work through difficult challenges' },
  ];

  return (
    <>
      <ImpactContainer ref={sectionRef}>
        <SectionContainer>
          <BeltContainer style={{ marginBottom: '1.5rem' }}>
            <BeltTrack $direction="left">
              {[photo1, photo2, photo3, photo4, photo5, photo6, photo7]
                .concat([
                  photo1,
                  photo2,
                  photo3,
                  photo4,
                  photo5,
                  photo6,
                  photo7,
                ])
                .map((src, i) => (
                  <BeltCard
                    key={`top-belt-${src}-${String(i).padStart(2, '0')}`}
                  >
                    <img
                      src={src}
                      alt="Program"
                      loading="lazy"
                      decoding="async"
                    />
                  </BeltCard>
                ))}
            </BeltTrack>
          </BeltContainer>

          <StatsGrid
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              margin: '0.5rem 0 1rem',
            }}
          >
            <StatsTitle style={{ margin: '0.25rem 0 0.75rem' }}>
              IN 2024-2025...
            </StatsTitle>
          </StatsGrid>
          <TurntableGrid>
            {impactStats.map(({ n, l }, idx) => (
              <TurntableStat key={l} n={n} l={l} i={idx} />
            ))}
          </TurntableGrid>
          <HighlightsContainer aria-label="Program capacities">
            <HighlightsTitle>Core Capacities We Build</HighlightsTitle>
            <HighlightsSubtitle>
              Growth we cultivate through mentorship, music-making, and
              healing-centered practice.
            </HighlightsSubtitle>
            <HighlightsRow>
              {[
                { t: 'Academic Self‑Efficacy', Icon: AcademicIcon },
                { t: 'Positive Identity', Icon: InsightIcon },
                { t: 'Self‑Management', Icon: TrackingIcon },
                { t: 'Social Skills', Icon: InsightIcon },
                { t: 'Contribution', Icon: ArtisticIcon },
              ].map(({ t, Icon }) => (
                <HighlightChip key={t}>
                  <Icon />
                  <span>{t}</span>
                </HighlightChip>
              ))}
            </HighlightsRow>
            <HighlightCardsGrid>
              {[
                {
                  title: 'Trusting Relationships',
                  text: 'Caring adult mentors expand students’ support networks and sense of belonging.',
                },
                {
                  title: 'Creative Mastery',
                  text: 'High-quality arts education builds persistence, collaboration, and leadership.',
                },
                {
                  title: 'Skill Development',
                  text: 'Goal-setting and feedback translate into academic confidence and achievement.',
                },
                {
                  title: 'Healing-Centered Practice',
                  text: 'Trauma-informed approaches help students regulate, reflect, and thrive.',
                },
              ].map(({ title, text }) => (
                <HighlightCard key={title}>
                  <HighlightCardTitle>{title}</HighlightCardTitle>
                  <HighlightCardText>{text}</HighlightCardText>
                </HighlightCard>
              ))}
            </HighlightCardsGrid>
          </HighlightsContainer>
          <BeltContainer style={{ marginTop: '1.5rem' }}>
            <BeltTrack $direction="right">
              {[photo8, photo9, photo10, photo11, photo12, photo13, photo14]
                .concat([
                  photo8,
                  photo9,
                  photo10,
                  photo11,
                  photo12,
                  photo13,
                  photo14,
                ])
                .map((src, i) => (
                  <BeltCard
                    key={`bottom-belt-${src}-${String(i).padStart(2, '0')}`}
                  >
                    <img
                      src={src}
                      alt="Program"
                      loading="lazy"
                      decoding="async"
                    />
                  </BeltCard>
                ))}
            </BeltTrack>
          </BeltContainer>
        </SectionContainer>
      </ImpactContainer>

      {/* Outcomes section replaced by expanded highlights in Impact */}

      {/* New Spotify-inspired measurement section */}
      <MeasurementContainer ref={measureRef}>
        <MeasurementWrapper>
          <MeasurementHeader>
            <MeasureTitle>
              <span className="regular">How do we </span>
              <span className="highlight">measure impact</span>
              <span className="regular">?</span>
            </MeasureTitle>
            <SpotifySubtitle style={{ marginTop: '0.1rem' }}>
              We use Hello Insight, a nationally recognized evaluation tool, to
              track students&apos; self-reported growth across 6 Positive Youth
              Development (PYD) pillars. Guitars Over Guns mentors use
              healing-centered, culturally affirming PYD practices in program
              sessions.
            </SpotifySubtitle>

            <AudioWaveContainer>
              {[...Array(18)].map((_, i) => {
                const position = i.toString().padStart(2, '0');
                return (
                  <AudioBar
                    key={`audio-bar-position-${position}`}
                    $index={i}
                  />
                );
              })}
            </AudioWaveContainer>
          </MeasurementHeader>

          <SpotifyGrid>
            <div>
              <SpotifyCard>
                <h4
                  style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    margin: '0 0 0.4rem 0',
                    letterSpacing: '0.02em',
                  }}
                >
                  Our Method Provides
                </h4>
                <div
                  style={{
                    width: '80px',
                    height: '2.5px',
                    background:
                      'linear-gradient(90deg, #1ed760,rgb(20, 105, 50))',
                    borderRadius: '2px',
                    marginBottom: '1.3rem',
                  }}
                />
                <SpotifyMethodsList>
                  <SpotifyMethod>
                    <MethodName>
                      <InsightIcon /> Trusting relationships with caring adults
                    </MethodName>
                    <MethodDescription>
                      Our model pairs youth with a caring adult mentor. Mentees
                      self-report the number of supportive adults in their lives
                      who support their growth and expand their interests
                    </MethodDescription>
                  </SpotifyMethod>

                  <SpotifyMethod>
                    <MethodName>
                      <ArtisticIcon /> High-quality, no-cost arts education
                      during typically unsupervised hours
                    </MethodName>
                    <MethodDescription>
                      Custom assessment tools that track students&apos; artistic
                      growth across multiple dimensions including technical
                      skills, creativity, and performance abilities.
                    </MethodDescription>
                  </SpotifyMethod>

                  <SpotifyMethod>
                    <MethodName>
                      <AcademicIcon /> Skill Development
                    </MethodName>
                    <MethodDescription>
                      Tracking academic performance metrics in collaboration
                      with schools to measure the program&apos;s impact on
                      educational outcomes.
                    </MethodDescription>
                  </SpotifyMethod>

                  <SpotifyMethod>
                    <MethodName>
                      <TrackingIcon /> Trauma-informed mental health support
                    </MethodName>
                    <MethodDescription>
                      Following students&apos; progress over multiple years to
                      assess long-term program impact and personal development
                      trajectories.
                    </MethodDescription>
                  </SpotifyMethod>
                </SpotifyMethodsList>

                <SpotifySubtitle
                  style={{
                    fontSize: '1rem',
                    marginTop: '2rem',
                    maxWidth: '100%',
                  }}
                >
                  By investing in the mental health and creative capacities of
                  our young people, we create space for each student to work
                  hard and own their path in life.
                </SpotifySubtitle>
              </SpotifyCard>
            </div>

            <div>
              <ToolsSection>
                <h3>Measurement & Evaluation Tools</h3>

                <ToolItem>
                  <ToolIcon>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 11L11.5 14L16 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName className="tool-name">
                      Hello Insight SEL & PYD Evaluation Platform
                    </ToolName>
                    <ToolDescription>
                      Primary assessment tool for all students
                    </ToolDescription>
                  </ToolInfo>
                </ToolItem>

                <ToolItem>
                  <ToolIcon>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 10H5V18H8M8 10V18M8 10V6C8 4.89543 8.89543 4 10 4H11.5C12.6046 4 13.5 4.89543 13.5 6V10M8 14H13.5M13.5 10H16.5M13.5 10V14M16.5 10H19.5V14M16.5 10V6C16.5 4.89543 17.3954 4 18.5 4H20C21.1046 4 22 4.89543 22 6V10M19.5 14H16.5M19.5 14V18H16.5V14"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName className="tool-name">
                      Satisfaction Surveys
                    </ToolName>
                    <ToolDescription>
                      Student, parent, and partner feedback
                    </ToolDescription>
                  </ToolInfo>
                </ToolItem>

                <ToolItem>
                  <ToolIcon>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 16.5L12 21.5L21 16.5M3 12L12 17L21 12M3 7.5L12 12.5L21 7.5L12 2.5L3 7.5Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName className="tool-name">
                      Artistic Progress Reports
                    </ToolName>
                    <ToolDescription>
                      Quarterly assessments using the artistic scale measurement
                    </ToolDescription>
                  </ToolInfo>
                </ToolItem>

                <ToolItem>
                  <ToolIcon>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.4 8.5H15.6M8.4 11.5H12M15 16H9C7.34315 16 6 14.6569 6 13V7C6 5.34315 7.34315 4 9 4H15C16.6569 4 18 5.34315 18 7V13C18 14.6569 16.6569 16 15 16ZM13.5 16V19.5C13.5 19.7761 13.2761 20 13 20H11C10.7239 20 10.5 19.7761 10.5 19.5V16H13.5Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName className="tool-name">
                      Academic Achievement Data
                    </ToolName>
                    <ToolDescription>
                      As observed from school records
                    </ToolDescription>
                  </ToolInfo>
                </ToolItem>
              </ToolsSection>

              <SpotifySubtitle
                style={{
                  fontSize: '0.95rem',
                  margin: '1.5rem 0',
                  textAlign: 'center',
                }}
              >
                GOGO largely supports kids affected by systemic challenges that
                reduce their access to opportunities
              </SpotifySubtitle>
            </div>
          </SpotifyGrid>
        </MeasurementWrapper>
      </MeasurementContainer>

      {/* Who We Serve moved higher in ImpactReportPage */}
    </>
  );
}

export default memo(ImpactSection);
