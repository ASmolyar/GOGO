import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { TestimonialsContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFTestimonialPageProps {
  data: TestimonialsContent | null | undefined;
}

/**
 * Page 8: Student Voice with centered quote
 */
export const PDFTestimonialPage: React.FC<PDFTestimonialPageProps> = ({ data }) => {
  if (!data) return null;

  return (
    <PDFPageTemplate>
      {/* Eyebrow */}
      {data.eyebrowText && (
        <div
          style={{
            fontSize: '12pt',
            fontWeight: 600,
            marginBottom: '0.3in',
            color: data.eyebrowColor || COLORS.gogo_pink,
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: '2px',
          }}
        >
          {data.eyebrowText}
        </div>
      )}

      {/* Name / Title */}
      {data.name && (
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '28pt',
            fontWeight: 900,
            marginBottom: '0.8in',
            color: COLORS.gogo_pink,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {data.name}
        </h2>
      )}

      {/* Large Centered Quote */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '5in',
          padding: '0 1in',
        }}
      >
        {data.quoteText && (
          <blockquote
            style={{
              fontSize: '18pt',
              lineHeight: 1.8,
              fontStyle: 'italic',
              color: data.quoteTextColor || '#333',
              textAlign: 'center',
              margin: '0 0 0.6in 0',
              maxWidth: '5.5in',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontSize: '60pt',
                color: data.quoteMarkColor || COLORS.gogo_pink,
                opacity: 0.3,
                position: 'absolute',
                left: '-0.3in',
                top: '-0.2in',
                fontFamily: 'Georgia, serif',
              }}
            >
              "
            </span>
            {data.quoteText}
            <span
              style={{
                fontSize: '60pt',
                color: data.quoteMarkColor || COLORS.gogo_pink,
                opacity: 0.3,
                position: 'absolute',
                right: '-0.3in',
                bottom: '-0.4in',
                fontFamily: 'Georgia, serif',
              }}
            >
              "
            </span>
          </blockquote>
        )}

        {/* Attribution */}
        {data.attributionText && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '14pt',
              fontWeight: 700,
              color: data.attributionColor || COLORS.gogo_pink,
              marginTop: '0.3in',
            }}
          >
            — {data.attributionText}
          </div>
        )}
      </div>
    </PDFPageTemplate>
  );
};

export default PDFTestimonialPage;

