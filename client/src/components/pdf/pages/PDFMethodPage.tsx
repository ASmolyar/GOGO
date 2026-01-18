import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { MethodContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFMethodPageProps {
  data: MethodContent | null | undefined;
}

/**
 * Page 5: Our Method with pillar cards
 */
export const PDFMethodPage: React.FC<PDFMethodPageProps> = ({ data }) => {
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
            color: COLORS.gogo_teal,
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
            fontSize: '13pt',
            lineHeight: 1.7,
            color: data.subtitleColor || '#555',
            marginBottom: '0.5in',
          }}
        >
          {data.subtitle}
        </p>
      )}

      {/* Method Items Grid */}
      {data.methodItems && data.methodItems.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.3in',
          }}
        >
          {data.methodItems.slice(0, 4).map((item, i) => (
            <div
              key={item.id || i}
              style={{
                background: data.cardBgColor || '#f8f9fa',
                padding: '0.35in',
                borderRadius: '8px',
                border: `1px solid ${data.cardBorderColor || '#e0e0e0'}`,
              }}
            >
              {/* Icon placeholder */}
              <div
                style={{
                  fontSize: '32pt',
                  color: COLORS.gogo_teal,
                  marginBottom: '0.15in',
                  textAlign: 'center',
                }}
              >
                ✦
              </div>

              {/* Text */}
              {item.text && (
                <p
                  style={{
                    fontSize: '11pt',
                    lineHeight: 1.5,
                    color: data.cardTitleColor || '#333',
                    margin: 0,
                    textAlign: 'center',
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

export default PDFMethodPage;

