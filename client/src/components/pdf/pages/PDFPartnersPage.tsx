import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { PartnersContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFPartnersPageProps {
  data: PartnersContent | null | undefined;
}

/**
 * Page 10: Our Supporters / Partners Grid
 */
export const PDFPartnersPage: React.FC<PDFPartnersPageProps> = ({ data }) => {
  if (!data) return null;

  return (
    <PDFPageTemplate>
      {/* Title */}
      {data.title && (
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '32pt',
            fontWeight: 900,
            marginBottom: '0.3in',
            color: COLORS.gogo_blue,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {data.title}
        </h2>
      )}

      {/* Subtitle */}
      {data.subtitle && (
        <p
          style={{
            fontSize: '13pt',
            lineHeight: 1.6,
            color: data.subtitleColor || '#555',
            marginBottom: '0.5in',
            textAlign: 'center',
          }}
        >
          {data.subtitle}
        </p>
      )}

      {/* Partners Grid */}
      {data.partners && data.partners.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.25in',
          }}
        >
          {data.partners.map((partner, i) => (
            <div
              key={partner.id || i}
              style={{
                background: data.badgeBgColor || '#f8f9fa',
                padding: '0.3in',
                borderRadius: data.badgeBorderRadius ? `${data.badgeBorderRadius}px` : '6px',
                textAlign: 'center',
                border: `1px solid ${data.badgeBorderColor || '#e0e0e0'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '0.8in',
              }}
            >
              <span
                style={{
                  fontSize: '11pt',
                  fontWeight: 600,
                  color: data.badgeTitleColor || '#333',
                }}
              >
                {partner.name}
              </span>
              {partner.descriptor && (
                <span
                  style={{
                    fontSize: '9pt',
                    color: data.badgeDescriptorColor || '#666',
                    marginTop: '0.05in',
                  }}
                >
                  {partner.descriptor}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </PDFPageTemplate>
  );
};

export default PDFPartnersPage;

