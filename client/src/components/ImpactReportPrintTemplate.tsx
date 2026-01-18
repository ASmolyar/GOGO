import React from 'react';
import './ImpactReportPrintTemplate.css';
import COLORS from '../../assets/colors';
import {
  HeroContent,
  MissionContent,
  PopulationContent,
  FinancialContent,
  MethodContent,
  CurriculumContent,
  ImpactSectionContent,
  TestimonialsContent,
  FlexAContent,
  FlexBContent,
  FlexCContent,
  ImpactLevelsContent,
  PartnersContent,
  FooterContent,
} from '../services/impact.api';

export interface PrintTemplateProps {
  hero?: HeroContent | null;
  mission?: MissionContent | null;
  population?: PopulationContent | null;
  financial?: FinancialContent | null;
  method?: MethodContent | null;
  curriculum?: CurriculumContent | null;
  impactSection?: ImpactSectionContent | null;
  testimonials?: TestimonialsContent | null;
  flexA?: FlexAContent | null;
  flexB?: FlexBContent | null;
  flexC?: FlexCContent | null;
  impactLevels?: ImpactLevelsContent | null;
  partners?: PartnersContent | null;
  footer?: FooterContent | null;
  sectionOrder?: string[];
  disabledSections?: string[];
}

/**
 * A print-optimized template for generating PDFs of the impact report.
 * Renders all content as static HTML with beautiful visuals, excluding interactive elements.
 */
export const ImpactReportPrintTemplate: React.FC<PrintTemplateProps> = ({
  hero,
  mission,
  population,
  financial,
  method,
  curriculum,
  impactSection,
  testimonials,
  flexA,
  flexB,
  flexC,
  impactLevels,
  partners,
  footer,
  sectionOrder = [],
  disabledSections = [],
}) => {
  // Debug: Log what data we're receiving
  console.log('[PrintTemplate] Received data:', {
    hero: !!hero,
    mission: !!mission,
    population: !!population,
    financial: !!financial,
    method: !!method,
    curriculum: !!curriculum,
    impactSection: !!impactSection,
    testimonials: !!testimonials,
    flexA: !!flexA,
    flexB: !!flexB,
    flexC: !!flexC,
    impactLevels: !!impactLevels,
    partners: !!partners,
    footer: !!footer,
    sectionOrder,
    disabledSections,
  });
  
  const isSectionDisabled = (key: string) => disabledSections.includes(key);

  // Helper to render decorative gradient bar
  const GradientBar = ({ colors }: { colors: string[] }) => (
    <div className="print-gradient-bar">
      {colors.map((color, i) => (
        <div key={i} style={{ backgroundColor: color, flex: 1 }} />
      ))}
    </div>
  );

  // Hero Section
  const renderHero = () => {
    if (!hero || isSectionDisabled('hero')) return null;
    return (
      <div className="print-section print-hero" style={{ background: hero.backgroundGradient || hero.backgroundColor || COLORS.gogo_purple }}>
        <div className="print-hero-content">
          {hero.year && <div className="print-hero-year" style={{ color: hero.yearColor || 'white' }}>{hero.year}</div>}
          {hero.title && <h1 className="print-hero-title" style={{ color: hero.titleColor || 'white' }}>{hero.title}</h1>}
          {hero.subtitle && <h2 className="print-hero-subtitle" style={{ color: hero.subtitleColor || 'rgba(255,255,255,0.9)' }}>{hero.subtitle}</h2>}
          {hero.tagline && <p className="print-hero-tagline" style={{ color: hero.taglineColor || 'rgba(255,255,255,0.8)' }}>{hero.tagline}</p>}
          {hero.bubbles && hero.bubbles.length > 0 && (
            <div className="print-hero-bubbles">
              {hero.bubbles.map((bubble, i) => (
                <span 
                  key={i} 
                  className="print-hero-bubble"
                  style={{
                    backgroundColor: hero.bubbleBgColor || 'rgba(255,255,255,0.1)',
                    color: hero.bubbleTextColor || 'white',
                    borderColor: hero.bubbleBorderColor || 'rgba(255,255,255,0.2)',
                  }}
                >
                  {bubble}
                </span>
              ))}
            </div>
          )}
        </div>
        <GradientBar colors={[COLORS.gogo_blue, COLORS.gogo_teal, COLORS.gogo_green, COLORS.gogo_yellow, COLORS.gogo_pink]} />
      </div>
    );
  };

  // Mission Section
  const renderMission = () => {
    if (!mission || isSectionDisabled('mission')) return null;
    return (
      <div className="print-section print-mission">
        <div className="print-container">
          {mission.title && (
            <h2 className="print-section-title" style={{ color: mission.titleColor || COLORS.gogo_blue }}>
              {mission.title}
            </h2>
          )}
          {mission.statementText && (
            <div className="print-mission-statement">
              <p style={{ color: mission.statementTextColor || '#333' }}>{mission.statementText}</p>
            </div>
          )}
          {mission.stats && mission.stats.length > 0 && (
            <div className="print-stats-grid">
              {mission.stats.filter(s => s.visible !== false).map((stat, i) => (
                <div key={stat.id} className="print-stat-card" style={{ borderLeftColor: stat.color || COLORS.gogo_blue }}>
                  <div className="print-stat-number" style={{ color: stat.color || COLORS.gogo_blue }}>
                    {stat.number}
                  </div>
                  <div className="print-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Population Section
  const renderPopulation = () => {
    if (!population || isSectionDisabled('population')) return null;
    return (
      <div className="print-section print-population">
        <div className="print-container">
          {population.sectionTitle && (
            <h2 className="print-section-title">{population.sectionTitle}</h2>
          )}
          {population.title && (
            <h3 className="print-subsection-title">{population.title}</h3>
          )}
          <div className="print-population-content">
            {population.infoCard1Text && (
              <div className="print-info-card" style={{ backgroundColor: population.infoCardBgColor || 'rgba(0,0,0,0.05)' }}>
                <p>{population.infoCard1Text}</p>
              </div>
            )}
            {population.infoCard2Text && (
              <div className="print-info-card" style={{ backgroundColor: population.infoCardBgColor || 'rgba(0,0,0,0.05)' }}>
                <p>{population.infoCard2Text}</p>
              </div>
            )}
          </div>
          {/* Demographics */}
          {population.demographicsData && population.demographicsData.length > 0 && (
            <div className="print-demographics">
              <h4>{population.demographicsTitle || 'Demographics'}</h4>
              <div className="print-demo-list">
                {population.demographicsData.map((item) => (
                  <div key={item.id} className="print-demo-item">
                    <div className="print-demo-bar" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    <div className="print-demo-label">
                      <span>{item.label}</span>
                      <span className="print-demo-value">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
              {population.demographicsCaption && (
                <p className="print-caption">{population.demographicsCaption}</p>
              )}
            </div>
          )}
          {/* Skills */}
          {population.skillsList && population.skillsList.length > 0 && (
            <div className="print-skills">
              <h4>{population.skillsTitle || 'Skills Development'}</h4>
              <div className="print-skills-list">
                {population.skillsList.map((skill, i) => (
                  <span 
                    key={i} 
                    className="print-skill-chip"
                    style={{
                      backgroundColor: population.skillChipBgColor || 'rgba(29, 185, 84, 0.1)',
                      borderColor: population.skillChipBorderColor || COLORS.gogo_green,
                      color: population.skillChipTextColor || '#333',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Financial Section
  const renderFinancial = () => {
    if (!financial || isSectionDisabled('financial') || financial.visible === false) return null;
    
    console.log('[PrintTemplate] Financial data:', financial);
    
    return (
      <div className="print-section print-financial">
        <div className="print-container">
          {financial.title && (
            <h2 className="print-section-title">{financial.title}</h2>
          )}
          {financial.subtitle && (
            <p className="print-subtitle" style={{ color: financial.subtitleColor || '#666' }}>
              {financial.subtitle}
            </p>
          )}
          {/* KPI Cards */}
          {((financial.kpiRevenueLabel && financial.revenueData && financial.revenueData.length > 0) ||
            (financial.kpiExpensesLabel && financial.expensesData && financial.expensesData.length > 0) ||
            (financial.kpiNetLabel && financial.netData && financial.netData.length > 0)) && (
            <div className="print-kpi-grid">
              {financial.kpiRevenueLabel && financial.revenueData && financial.revenueData.length > 0 && (
                <div className="print-kpi-card">
                  <div className="print-kpi-label">{financial.kpiRevenueLabel}</div>
                  <div className="print-kpi-value" style={{ color: financial.kpiValueColor || COLORS.gogo_green }}>
                    ${(financial.revenueData[financial.revenueData.length - 1]?.y || 0).toLocaleString()}
                  </div>
                </div>
              )}
              {financial.kpiExpensesLabel && financial.expensesData && financial.expensesData.length > 0 && (
                <div className="print-kpi-card">
                  <div className="print-kpi-label">{financial.kpiExpensesLabel}</div>
                  <div className="print-kpi-value" style={{ color: financial.kpiValueColor || COLORS.gogo_blue }}>
                    ${(financial.expensesData[financial.expensesData.length - 1]?.y || 0).toLocaleString()}
                  </div>
                </div>
              )}
              {financial.kpiNetLabel && financial.netData && financial.netData.length > 0 && (
                <div className="print-kpi-card">
                  <div className="print-kpi-label">{financial.kpiNetLabel}</div>
                  <div className="print-kpi-value" style={{ color: financial.kpiValueColor || COLORS.gogo_purple }}>
                    ${(financial.netData[financial.netData.length - 1]?.y || 0).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Pie Charts */}
          {financial.revenueBreakdown && financial.revenueBreakdown.length > 0 && (
            <div className="print-pie-section">
              <h4>{financial.revenuePieTitle || 'Revenue Breakdown'}</h4>
              <div className="print-pie-legend">
                {financial.revenueBreakdown.map((item) => (
                  <div key={item.id} className="print-pie-item">
                    <span className="print-pie-color" style={{ backgroundColor: item.color }} />
                    <span className="print-pie-label">{item.label}</span>
                    <span className="print-pie-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {financial.expenseBreakdown && financial.expenseBreakdown.length > 0 && (
            <div className="print-pie-section">
              <h4>{financial.expensePieTitle || 'Expense Breakdown'}</h4>
              <div className="print-pie-legend">
                {financial.expenseBreakdown.map((item) => (
                  <div key={item.id} className="print-pie-item">
                    <span className="print-pie-color" style={{ backgroundColor: item.color }} />
                    <span className="print-pie-label">{item.label}</span>
                    <span className="print-pie-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Method Section
  const renderMethod = () => {
    if (!method || isSectionDisabled('method')) return null;
    return (
      <div className="print-section print-method">
        <div className="print-container">
          {method.title && (
            <h2 className="print-section-title">{method.title}</h2>
          )}
          {method.description && (
            <p className="print-description">{method.description}</p>
          )}
          {method.pillars && method.pillars.length > 0 && (
            <div className="print-pillars-grid">
              {method.pillars.map((pillar, i) => (
                <div key={i} className="print-pillar-card">
                  {pillar.icon && <div className="print-pillar-icon">✦</div>}
                  {pillar.title && <h4>{pillar.title}</h4>}
                  {pillar.description && <p>{pillar.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Curriculum Section
  const renderCurriculum = () => {
    if (!curriculum || isSectionDisabled('curriculum')) return null;
    return (
      <div className="print-section print-curriculum">
        <div className="print-container">
          {curriculum.title && (
            <h2 className="print-section-title">{curriculum.title}</h2>
          )}
          {curriculum.description && (
            <p className="print-description">{curriculum.description}</p>
          )}
          {curriculum.disciplines && curriculum.disciplines.length > 0 && (
            <div className="print-disciplines">
              {curriculum.disciplines.map((disc, i) => (
                <div key={i} className="print-discipline">
                  <h4>{disc.name}</h4>
                  {disc.description && <p>{disc.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Impact Section
  const renderImpactSection = () => {
    if (!impactSection || isSectionDisabled('impactSection')) return null;
    return (
      <div className="print-section print-impact">
        <div className="print-container">
          {impactSection.title && (
            <h2 className="print-section-title">{impactSection.title}</h2>
          )}
          {impactSection.stats && impactSection.stats.length > 0 && (
            <div className="print-impact-stats">
              {impactSection.stats.map((stat, i) => (
                <div key={i} className="print-impact-stat">
                  <div className="print-impact-number" style={{ color: stat.color || COLORS.gogo_blue }}>
                    {stat.value}
                  </div>
                  <div className="print-impact-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Testimonials Section
  const renderTestimonials = () => {
    if (!testimonials || isSectionDisabled('testimonials')) return null;
    return (
      <div className="print-section print-testimonials">
        <div className="print-container">
          {testimonials.title && (
            <h2 className="print-section-title">{testimonials.title}</h2>
          )}
          {testimonials.quote && (
            <blockquote className="print-quote">
              <p>{testimonials.quote}</p>
              {testimonials.author && (
                <footer className="print-quote-author">
                  — {testimonials.author}
                  {testimonials.role && <span className="print-quote-role">, {testimonials.role}</span>}
                </footer>
              )}
            </blockquote>
          )}
        </div>
      </div>
    );
  };

  // FlexA Section
  const renderFlexA = () => {
    if (!flexA || isSectionDisabled('flexA')) return null;
    return (
      <div className="print-section print-flex">
        <div className="print-container">
          {flexA.title && <h2 className="print-section-title">{flexA.title}</h2>}
          {flexA.content && <div className="print-flex-content" dangerouslySetInnerHTML={{ __html: flexA.content }} />}
        </div>
      </div>
    );
  };

  // FlexB Section
  const renderFlexB = () => {
    if (!flexB || isSectionDisabled('flexB')) return null;
    return (
      <div className="print-section print-flex">
        <div className="print-container">
          {flexB.title && <h2 className="print-section-title">{flexB.title}</h2>}
          {flexB.content && <div className="print-flex-content" dangerouslySetInnerHTML={{ __html: flexB.content }} />}
        </div>
      </div>
    );
  };

  // FlexC Section
  const renderFlexC = () => {
    if (!flexC || isSectionDisabled('flexC')) return null;
    return (
      <div className="print-section print-flex">
        <div className="print-container">
          {flexC.title && <h2 className="print-section-title">{flexC.title}</h2>}
          {flexC.content && <div className="print-flex-content" dangerouslySetInnerHTML={{ __html: flexC.content }} />}
        </div>
      </div>
    );
  };

  // Impact Levels Section
  const renderImpactLevels = () => {
    if (!impactLevels || isSectionDisabled('impactLevels')) return null;
    return (
      <div className="print-section print-impact-levels">
        <div className="print-container">
          {impactLevels.title && (
            <h2 className="print-section-title">{impactLevels.title}</h2>
          )}
          {impactLevels.subtitle && (
            <p className="print-subtitle">{impactLevels.subtitle}</p>
          )}
          {impactLevels.levels && impactLevels.levels.length > 0 && (
            <div className="print-levels">
              {impactLevels.levels.map((level, i) => (
                <div key={i} className="print-level">
                  <h4 style={{ color: level.color || COLORS.gogo_blue }}>{level.name}</h4>
                  {level.description && <p>{level.description}</p>}
                  {level.metrics && level.metrics.length > 0 && (
                    <ul className="print-level-metrics">
                      {level.metrics.map((metric, j) => (
                        <li key={j}>{metric}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Partners Section
  const renderPartners = () => {
    if (!partners || isSectionDisabled('partners')) return null;
    return (
      <div className="print-section print-partners">
        <div className="print-container">
          {partners.title && (
            <h2 className="print-section-title">{partners.title}</h2>
          )}
          {partners.description && (
            <p className="print-description">{partners.description}</p>
          )}
          {partners.partnersList && partners.partnersList.length > 0 && (
            <div className="print-partners-grid">
              {partners.partnersList.map((partner, i) => (
                <div key={i} className="print-partner">
                  {partner.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Footer Section
  const renderFooter = () => {
    if (!footer || isSectionDisabled('footer')) return null;
    return (
      <div className="print-section print-footer">
        <div className="print-container">
          <GradientBar colors={[COLORS.gogo_blue, COLORS.gogo_pink, COLORS.gogo_purple, COLORS.gogo_teal, COLORS.gogo_yellow, COLORS.gogo_green]} />
          <div className="print-footer-content">
            {footer.organizationName && (
              <h3>{footer.organizationName}</h3>
            )}
            {footer.contactEmail && (
              <p>Email: {footer.contactEmail}</p>
            )}
            {footer.contactPhone && (
              <p>Phone: {footer.contactPhone}</p>
            )}
            {footer.address && (
              <p>Address: {footer.address}</p>
            )}
            {footer.website && (
              <p>Website: {footer.website}</p>
            )}
            {footer.copyrightText && (
              <p className="print-copyright">{footer.copyrightText}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Section renderer
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    hero: renderHero,
    mission: renderMission,
    population: renderPopulation,
    financial: renderFinancial,
    method: renderMethod,
    curriculum: renderCurriculum,
    impactSection: renderImpactSection,
    testimonials: renderTestimonials,
    flexA: renderFlexA,
    flexB: renderFlexB,
    flexC: renderFlexC,
    impactLevels: renderImpactLevels,
    partners: renderPartners,
    footer: renderFooter,
  };

  return (
    <div className="print-template">
      {/* Render sections in order */}
      {sectionOrder.length > 0 ? (
        sectionOrder.map((key) => {
          const renderer = sectionRenderers[key];
          return renderer ? <React.Fragment key={key}>{renderer()}</React.Fragment> : null;
        })
      ) : (
        // Default order if no sectionOrder provided
        <>
          {renderHero()}
          {renderMission()}
          {renderPopulation()}
          {renderFinancial()}
          {renderMethod()}
          {renderCurriculum()}
          {renderImpactSection()}
          {renderTestimonials()}
          {renderFlexA()}
          {renderFlexB()}
          {renderFlexC()}
          {renderImpactLevels()}
          {renderPartners()}
          {renderFooter()}
        </>
      )}
    </div>
  );
};

export default ImpactReportPrintTemplate;

