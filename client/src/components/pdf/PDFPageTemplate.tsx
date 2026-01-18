import React from 'react';

export interface PDFPageTemplateProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  noPadding?: boolean;
}

/**
 * Base template for all PDF pages.
 * Fixed dimensions: 8.5" × 11" (Letter size)
 */
export const PDFPageTemplate: React.FC<PDFPageTemplateProps> = ({
  children,
  className = '',
  style = {},
  noPadding = false,
}) => {
  return (
    <div
      className={`pdf-page ${className}`}
      style={{
        width: '8.5in',
        height: '11in',
        padding: noPadding ? '0' : '0.75in',
        background: 'white',
        pageBreakAfter: 'always',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PDFPageTemplate;



