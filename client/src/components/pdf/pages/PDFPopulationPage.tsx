import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { PopulationContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFPopulationPageProps {
  data: PopulationContent | null | undefined;
}

/**
 * Page 3: Our Population with demographics and skills
 */
export const PDFPopulationPage: React.FC<PDFPopulationPageProps> = ({ data }) => {
  if (!data) return null;

  return (
    <PDFPageTemplate>
      {/* Title */}
      {data.sectionTitle && (
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '32pt',
            fontWeight: 900,
            marginBottom: '0.3in',
            color: COLORS.gogo_purple,
            textTransform: 'uppercase',
          }}
        >
          {data.sectionTitle}
        </h2>
      )}

      {/* Tagline/Description */}
      {data.title && (
        <p
          style={{
            fontSize: '16pt',
            lineHeight: 1.6,
            color: '#333',
            marginBottom: '0.5in',
            fontWeight: 500,
            fontStyle: 'italic',
          }}
        >
          {data.title}
        </p>
      )}

      {/* Demographics Section */}
      {data.demographicsData && data.demographicsData.length > 0 && (
        <>
          <h3
            style={{
              fontSize: '16pt',
              fontWeight: 700,
              marginBottom: '0.3in',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {data.demographicsTitle || 'STUDENT DEMOGRAPHICS'}
          </h3>

          <div style={{ marginBottom: '0.4in' }}>
            {data.demographicsData.map((item) => (
              <div key={item.id} style={{ marginBottom: '0.15in' }}>
                {/* Progress bar */}
                <div
                  style={{
                    height: '30px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${item.value}%`,
                      height: '100%',
                      background: item.color || COLORS.gogo_blue,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                {/* Label */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.05in',
                    fontSize: '11pt',
                    color: '#555',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontWeight: 700 }}>{item.value}%</span>
                </div>
              </div>
            ))}
          </div>

          {data.demographicsCaption && (
            <p
              style={{
                fontSize: '10pt',
                color: '#888',
                fontStyle: 'italic',
                marginBottom: '0.4in',
              }}
            >
              {data.demographicsCaption}
            </p>
          )}
        </>
      )}

      {/* Info Cards */}
      {(data.infoCard1Text || data.infoCard2Text) && (
        <div style={{ marginBottom: '0.4in' }}>
          {data.infoCard1Text && (
            <p
              style={{
                fontSize: '12pt',
                lineHeight: 1.6,
                color: '#555',
                marginBottom: '0.2in',
                padding: '0.2in',
                background: '#f0f4f8',
                borderRadius: '6px',
              }}
            >
              {data.infoCard1Text}
            </p>
          )}
          {data.infoCard2Text && (
            <p
              style={{
                fontSize: '12pt',
                lineHeight: 1.6,
                color: '#555',
                padding: '0.2in',
                background: '#f0f4f8',
                borderRadius: '6px',
              }}
            >
              {data.infoCard2Text}
            </p>
          )}
        </div>
      )}

      {/* Skills Section */}
      {data.skillsList && data.skillsList.length > 0 && (
        <>
          <h3
            style={{
              fontSize: '16pt',
              fontWeight: 700,
              marginBottom: '0.3in',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {data.skillsTitle || 'CORE SKILLS DEVELOPED'}
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.15in',
            }}
          >
            {data.skillsList.map((skill, i) => (
              <span
                key={i}
                style={{
                  padding: '0.1in 0.25in',
                  borderRadius: '20px',
                  border: `2px solid ${data.skillChipBorderColor || COLORS.gogo_green}`,
                  backgroundColor: data.skillChipBgColor || 'rgba(141, 221, 166, 0.1)',
                  color: data.skillChipTextColor || '#333',
                  fontSize: '10pt',
                  fontWeight: 600,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </>
      )}
    </PDFPageTemplate>
  );
};

export default PDFPopulationPage;

