import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { CurriculumContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFCurriculumPageProps {
  data: CurriculumContent | null | undefined;
}

/**
 * Page 6: Curriculum & Programs with disciplines list
 */
export const PDFCurriculumPage: React.FC<PDFCurriculumPageProps> = ({ data }) => {
  if (!data) return null;

  return (
    <PDFPageTemplate>
      {/* Title */}
      {data.title && (
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '28pt',
            fontWeight: 900,
            marginBottom: '0.3in',
            color: COLORS.gogo_blue,
            textTransform: 'uppercase',
          }}
        >
          {data.title}
        </h2>
      )}

      {/* Subtitle */}
      {data.subtitle && (
        <p
          style={{
            fontSize: '12pt',
            lineHeight: 1.6,
            color: data.subtitleColor || '#555',
            marginBottom: '0.4in',
          }}
        >
          {data.subtitle}
        </p>
      )}

      {/* Pedal Cards / Timeline Items */}
      {data.pedalCards && data.pedalCards.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25in' }}>
          {data.pedalCards.map((card, i) => (
            <div
              key={card.id || i}
              style={{
                borderLeft: `4px solid ${COLORS.gogo_blue}`,
                paddingLeft: '0.2in',
                paddingTop: '0.1in',
                paddingBottom: '0.1in',
              }}
            >
              <h4
                style={{
                  fontSize: '14pt',
                  fontWeight: 700,
                  marginBottom: '0.05in',
                  color: data.cardTitleColor || COLORS.gogo_blue,
                }}
              >
                {card.title}
              </h4>
              {card.text && (
                <p
                  style={{
                    fontSize: '11pt',
                    lineHeight: 1.5,
                    color: data.cardTextColor || '#666',
                    margin: 0,
                  }}
                >
                  {card.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Timeline Items (fallback if no pedal cards) */}
      {(!data.pedalCards || data.pedalCards.length === 0) && data.timelineItems && data.timelineItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25in' }}>
          {data.timelineItems.map((item, i) => (
            <div
              key={item.id || i}
              style={{
                borderLeft: `4px solid ${COLORS.gogo_blue}`,
                paddingLeft: '0.2in',
                paddingTop: '0.1in',
                paddingBottom: '0.1in',
              }}
            >
              <h4
                style={{
                  fontSize: '14pt',
                  fontWeight: 700,
                  marginBottom: '0.05in',
                  color: data.timelineItemTitleColor || COLORS.gogo_blue,
                }}
              >
                {item.title}
              </h4>
              {item.text && (
                <p
                  style={{
                    fontSize: '11pt',
                    lineHeight: 1.5,
                    color: data.timelineItemTextColor || '#666',
                    margin: 0,
                  }}
                >
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </PDFPageTemplate>
  );
};

export default PDFCurriculumPage;

