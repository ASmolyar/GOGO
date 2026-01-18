import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { ImpactLevelsContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFImpactLevelsPageProps {
  data: ImpactLevelsContent | null | undefined;
}

/**
 * Page 9: Impact Levels / Donation Tiers
 */
export const PDFImpactLevelsPage: React.FC<PDFImpactLevelsPageProps> = ({ data }) => {
  if (!data) return null;

  return (
    <PDFPageTemplate>
      {/* Title */}
      {data.header?.title && (
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '28pt',
            fontWeight: 900,
            marginBottom: '0.2in',
            color: COLORS.gogo_yellow,
            textTransform: 'uppercase',
          }}
        >
          {data.header.title}
        </h2>
      )}

      {/* Subtitle */}
      {data.header?.subtitle && (
        <p
          style={{
            fontSize: '13pt',
            lineHeight: 1.6,
            color: data.header.subtitleColor || '#555',
            marginBottom: '0.4in',
          }}
        >
          {data.header.subtitle}
        </p>
      )}

      {/* Impact Levels List */}
      {data.levels && data.levels.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25in' }}>
          {data.levels.map((level, i) => (
            <div
              key={level.id || i}
              style={{
                borderLeft: `5px solid ${data.amountColor || COLORS.gogo_yellow}`,
                paddingLeft: '0.2in',
                paddingTop: '0.15in',
                paddingBottom: '0.15in',
                background: data.cardBgColor || '#f8f9fa',
                borderRadius: '4px',
              }}
            >
              {/* Level Amount */}
              <h4
                style={{
                  fontSize: '14pt',
                  fontWeight: 700,
                  marginBottom: '0.05in',
                  color: data.amountColor || COLORS.gogo_yellow,
                }}
              >
                {level.amount}
              </h4>

              {/* Description */}
              {level.description && (
                <p
                  style={{
                    fontSize: '11pt',
                    lineHeight: 1.5,
                    color: data.descriptionColor || '#666',
                    margin: 0,
                  }}
                >
                  {level.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA Button Text */}
      {data.cta?.text && (
        <div
          style={{
            marginTop: '0.4in',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '0.15in 0.5in',
              background: data.cta.bgColor || COLORS.gogo_yellow,
              color: data.cta.textColor || '#000',
              fontWeight: 700,
              fontSize: '14pt',
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {data.cta.text}
          </div>
          {data.cta.url && (
            <p
              style={{
                fontSize: '10pt',
                color: '#888',
                marginTop: '0.1in',
              }}
            >
              {data.cta.url}
            </p>
          )}
        </div>
      )}
    </PDFPageTemplate>
  );
};

export default PDFImpactLevelsPage;

