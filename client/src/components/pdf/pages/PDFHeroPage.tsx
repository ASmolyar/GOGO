import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { HeroContent } from '../../../services/impact.api';

export interface PDFHeroPageProps {
  data: HeroContent | null | undefined;
}

/**
 * Page 1: Hero/Title Page with full-bleed background image
 */
export const PDFHeroPage: React.FC<PDFHeroPageProps> = ({ data }) => {
  if (!data) return null;

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : 'none',
    backgroundColor: data.backgroundColor || data.backgroundGradient || '#68369a',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <PDFPageTemplate noPadding className="pdf-hero-page" style={backgroundStyle}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5in 1in',
          textAlign: 'center',
          color: 'white',
        }}
      >
        {/* Year Badge */}
        {data.year && (
          <div
            style={{
              fontSize: '14pt',
              fontWeight: 700,
              letterSpacing: '2px',
              marginBottom: '0.5in',
              color: data.yearColor || 'white',
              opacity: 0.95,
            }}
          >
            {data.year}
          </div>
        )}

        {/* Main Title */}
        {data.title && (
          <h1
            style={{
              fontFamily: "'Century Gothic', Arial, sans-serif",
              fontSize: '52pt',
              fontWeight: 900,
              lineHeight: 1.1,
              margin: '0 0 0.3in 0',
              color: data.titleColor || 'white',
              letterSpacing: '-1px',
              textTransform: 'uppercase',
            }}
          >
            {data.title}
          </h1>
        )}

        {/* Decorative underline */}
        <div
          style={{
            width: '3in',
            height: '4px',
            background: data.titleUnderlineColor || 'white',
            margin: '0 auto 0.5in auto',
          }}
        />

        {/* Subtitle */}
        {data.subtitle && (
          <h2
            style={{
              fontFamily: "'Century Gothic', Arial, sans-serif",
              fontSize: '24pt',
              fontWeight: 600,
              margin: '0 0 0.5in 0',
              color: data.subtitleColor || 'rgba(255,255,255,0.95)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {data.subtitle}
          </h2>
        )}

        {/* Tagline */}
        {data.tagline && (
          <p
            style={{
              fontSize: '14pt',
              margin: '0 0 0.6in 0',
              color: data.taglineColor || 'rgba(255,255,255,0.9)',
              maxWidth: '6in',
              lineHeight: 1.6,
            }}
          >
            {data.tagline}
          </p>
        )}

        {/* Location Bubbles */}
        {data.bubbles && data.bubbles.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.4in',
              marginTop: '0.3in',
            }}
          >
            {data.bubbles.map((bubble, i) => (
              <span
                key={i}
                style={{
                  padding: '0.15in 0.4in',
                  borderRadius: '50px',
                  border: `2px solid ${data.bubbleBorderColor || 'rgba(255,255,255,0.3)'}`,
                  backgroundColor: data.bubbleBgColor || 'rgba(255,255,255,0.15)',
                  color: data.bubbleTextColor || 'white',
                  fontSize: '11pt',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              >
                {bubble}
              </span>
            ))}
          </div>
        )}
      </div>
    </PDFPageTemplate>
  );
};

export default PDFHeroPage;

