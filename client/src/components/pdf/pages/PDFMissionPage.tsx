import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { MissionContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFMissionPageProps {
  data: MissionContent | null | undefined;
}

/**
 * Page 2: Mission Statement with stat cards
 */
export const PDFMissionPage: React.FC<PDFMissionPageProps> = ({ data }) => {
  if (!data) return null;

  const visibleStats = data.stats?.filter(s => s.visible !== false) || [];

  return (
    <PDFPageTemplate>
      {/* Title */}
      {data.title && (
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '32pt',
            fontWeight: 900,
            marginBottom: '0.4in',
            color: data.titleColor || COLORS.gogo_blue,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {data.title}
        </h2>
      )}

      {/* Decorative underline */}
      <div
        style={{
          width: '2.5in',
          height: '4px',
          background: data.titleColor || COLORS.gogo_blue,
          margin: '0 auto 0.6in auto',
        }}
      />

      {/* Mission Statement */}
      {data.statementText && (
        <div
          style={{
            fontSize: '16pt',
            lineHeight: 1.7,
            textAlign: 'center',
            color: '#333',
            marginBottom: '0.8in',
            padding: '0 0.5in',
            fontWeight: 500,
          }}
        >
          {data.statementText}
        </div>
      )}

      {/* Stats Grid */}
      {visibleStats.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.4in',
            marginTop: '0.5in',
          }}
        >
          {visibleStats.map((stat) => (
            <div
              key={stat.id}
              style={{
                background: '#f8f9fa',
                padding: '0.4in',
                borderRadius: '8px',
                borderLeft: `6px solid ${stat.color || COLORS.gogo_blue}`,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontFamily: "'Century Gothic', Arial, sans-serif",
                  fontSize: '42pt',
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: '0.15in',
                  color: stat.color || COLORS.gogo_blue,
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: '13pt',
                  color: '#555',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
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

export default PDFMissionPage;

