import React from 'react';
import { PDFPageTemplate } from '../PDFPageTemplate';
import { FinancialContent } from '../../../services/impact.api';
import COLORS from '../../../../assets/colors';

export interface PDFFinancialPageProps {
  data: FinancialContent | null | undefined;
}

/**
 * Page 4: Financial Overview with KPIs and breakdowns
 */
export const PDFFinancialPage: React.FC<PDFFinancialPageProps> = ({ data }) => {
  if (!data || data.visible === false) return null;

  // Get latest values from time series data (arrays of numbers)
  const latestRevenue = data.revenueData && data.revenueData.length > 0
    ? data.revenueData[data.revenueData.length - 1] || 0
    : 0;
  const latestExpenses = data.expenseData && data.expenseData.length > 0
    ? data.expenseData[data.expenseData.length - 1] || 0
    : 0;
  const netValue = latestRevenue - latestExpenses;

  return (
    <PDFPageTemplate>
      {/* Title */}
      {data.title && (
        <h2
          style={{
            fontFamily: "'Century Gothic', Arial, sans-serif",
            fontSize: '32pt',
            fontWeight: 900,
            marginBottom: '0.2in',
            color: COLORS.gogo_green,
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
            lineHeight: 1.6,
            color: '#666',
            marginBottom: '0.5in',
          }}
        >
          {data.subtitle}
        </p>
      )}

      {/* KPI Cards */}
      {(data.kpiRevenueLabel || data.kpiExpensesLabel || data.kpiNetLabel) && (
        <>
          <h3
            style={{
              fontSize: '14pt',
              fontWeight: 700,
              marginBottom: '0.3in',
              color: '#333',
              textTransform: 'uppercase',
            }}
          >
            LATEST REVENUE
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.3in',
              marginBottom: '0.5in',
            }}
          >
            {data.kpiRevenueLabel && (
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '0.3in',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '10pt',
                    color: '#666',
                    marginBottom: '0.1in',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {data.kpiRevenueLabel}
                </div>
                <div
                  style={{
                    fontFamily: "'Century Gothic', Arial, sans-serif",
                    fontSize: '28pt',
                    fontWeight: 900,
                    color: data.kpiValueColor || COLORS.gogo_green,
                  }}
                >
                  ${latestRevenue.toLocaleString()}
                </div>
              </div>
            )}

            {data.kpiExpensesLabel && (
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '0.3in',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '10pt',
                    color: '#666',
                    marginBottom: '0.1in',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {data.kpiExpensesLabel}
                </div>
                <div
                  style={{
                    fontFamily: "'Century Gothic', Arial, sans-serif",
                    fontSize: '28pt',
                    fontWeight: 900,
                    color: data.kpiValueColor || COLORS.gogo_blue,
                  }}
                >
                  ${latestExpenses.toLocaleString()}
                </div>
              </div>
            )}

            {data.kpiNetLabel && (
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '0.3in',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '10pt',
                    color: '#666',
                    marginBottom: '0.1in',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {data.kpiNetLabel}
                </div>
                <div
                  style={{
                    fontFamily: "'Century Gothic', Arial, sans-serif",
                    fontSize: '28pt',
                    fontWeight: 900,
                    color: netValue >= 0 ? data.kpiNetPositiveColor || COLORS.gogo_green : data.kpiNetNegativeColor || COLORS.gogo_pink,
                  }}
                >
                  ${netValue.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Revenue Breakdown ("Where Money Comes From") */}
      {data.comesFromData && data.comesFromData.length > 0 && (
        <div style={{ marginBottom: '0.4in' }}>
          <h3
            style={{
              fontSize: '14pt',
              fontWeight: 700,
              marginBottom: '0.2in',
              color: '#333',
              textTransform: 'uppercase',
            }}
          >
            {data.comesFromTitle || 'REVENUE BREAKDOWN'}
          </h3>

          {data.comesFromData.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.1in',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: item.color,
                  borderRadius: '3px',
                  marginRight: '0.15in',
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: '11pt',
                  color: '#555',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: '12pt',
                  fontWeight: 700,
                  color: '#333',
                }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Expense Breakdown ("Where Money Goes") */}
      {data.goesToData && data.goesToData.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: '14pt',
              fontWeight: 700,
              marginBottom: '0.2in',
              color: '#333',
              textTransform: 'uppercase',
            }}
          >
            {data.goesToTitle || 'EXPENSE BREAKDOWN'}
          </h3>

          {data.goesToData.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.1in',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: item.color,
                  borderRadius: '3px',
                  marginRight: '0.15in',
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: '11pt',
                  color: '#555',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: '12pt',
                  fontWeight: 700,
                  color: '#333',
                }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      )}
    </PDFPageTemplate>
  );
};

export default PDFFinancialPage;

