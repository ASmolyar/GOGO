import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { FooterContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFFooterPageProps {
  data: FooterContent | null | undefined;
}

/**
 * Page 11: Contact & Footer
 */
export const PDFFooterPage: React.FC<PDFFooterPageProps> = ({ data }) => {
  if (!data) return null;

  return (
    <PDFPageTemplate>
      {/* Gradient Bar */}
      <div
        style={{
          display: 'flex',
          height: '0.15in',
          width: '100%',
          marginBottom: '1.5in',
        }}
      >
        <div style={{ flex: 1, background: COLORS.gogo_blue }} />
        <div style={{ flex: 1, background: COLORS.gogo_pink }} />
        <div style={{ flex: 1, background: COLORS.gogo_purple }} />
        <div style={{ flex: 1, background: COLORS.gogo_teal }} />
        <div style={{ flex: 1, background: COLORS.gogo_yellow }} />
        <div style={{ flex: 1, background: COLORS.gogo_green }} />
      </div>

      {/* Content Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '6in',
        }}
      >
        {/* Organization Name */}
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '36pt',
            fontWeight: 900,
            marginBottom: '0.6in',
            color: COLORS.gogo_blue,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          GUITARS OVER GUNS
        </h2>

        {/* Description / Contact Information */}
        <div
          style={{
            fontSize: '13pt',
            lineHeight: 2,
            color: data.descriptionColor || '#555',
            marginBottom: '0.8in',
          }}
        >
          {data.description && (
            <div style={{ marginBottom: '0.3in' }}>
              {data.description}
            </div>
          )}
          {data.mailingAddress?.enabled && data.mailingAddress?.text && (
            <div style={{ color: data.mailingAddress.textColor || '#555' }}>
              {data.mailingAddress.text}
            </div>
          )}
        </div>

        {/* Copyright */}
        {data.bottomBar?.copyrightText && (
          <p
            style={{
              fontSize: '10pt',
              color: data.bottomBar.copyrightColor || '#888',
              marginTop: '1in',
            }}
          >
            {data.bottomBar.copyrightText}
          </p>
        )}
      </div>

      {/* Bottom Gradient Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.75in',
          left: '0.75in',
          right: '0.75in',
          display: 'flex',
          height: '0.15in',
        }}
      >
        <div style={{ flex: 1, background: COLORS.gogo_green }} />
        <div style={{ flex: 1, background: COLORS.gogo_yellow }} />
        <div style={{ flex: 1, background: COLORS.gogo_teal }} />
        <div style={{ flex: 1, background: COLORS.gogo_purple }} />
        <div style={{ flex: 1, background: COLORS.gogo_pink }} />
        <div style={{ flex: 1, background: COLORS.gogo_blue }} />
      </div>
    </PDFPageTemplate>
  );
};

export default PDFFooterPage;

