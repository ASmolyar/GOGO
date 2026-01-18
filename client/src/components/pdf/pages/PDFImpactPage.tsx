import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { ImpactSectionContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFImpactPageProps {
  data: ImpactSectionContent | null | undefined;
}

/**
 * Page 7: Impact Metrics with large stat cards
 */
export const PDFImpactPage: React.FC<PDFImpactPageProps> = ({ data }) => {
  if (!data) return null;

  return (
    <PDFPageTemplate>
      {/* Title */}
      {data.statsTitle && (
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '32pt',
            fontWeight: 900,
            marginBottom: '0.5in',
            color: data.statsTitleColor || COLORS.gogo_green,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {data.statsTitle}
        </h2>
      )}

      {/* Large Impact Stat Cards */}
      {data.turntableStats && data.turntableStats.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4in',
            alignItems: 'center',
          }}
        >
          {data.turntableStats.slice(0, 3).map((stat, i) => (
            <div
              key={stat.id || i}
              style={{
                width: '80%',
                background: '#f8f9fa',
                padding: '0.5in',
                borderRadius: '12px',
                textAlign: 'center',
                border: `3px solid ${stat.colorA || COLORS.gogo_green}`,
              }}
            >
              <div
                style={{
                  fontFamily: "'Century Gothic', Arial, sans-serif",
                  fontSize: '52pt',
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: '0.15in',
                  color: stat.colorA || COLORS.gogo_green,
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: '16pt',
                  color: data.statCaptionColor || '#555',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </PDFPageTemplate>
  );
};

export default PDFImpactPage;

