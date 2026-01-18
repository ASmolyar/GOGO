import React from 'react';
import './PDFReport.css';
import PDFHeroPage from './pages/PDFHeroPage';
import PDFMissionPage from './pages/PDFMissionPage';
import PDFPopulationPage from './pages/PDFPopulationPage';
import PDFFinancialPage from './pages/PDFFinancialPage';
import PDFMethodPage from './pages/PDFMethodPage';
import PDFCurriculumPage from './pages/PDFCurriculumPage';
import PDFImpactPage from './pages/PDFImpactPage';
import PDFTestimonialPage from './pages/PDFTestimonialPage';
import PDFImpactLevelsPage from './pages/PDFImpactLevelsPage';
import PDFPartnersPage from './pages/PDFPartnersPage';
import PDFFooterPage from './pages/PDFFooterPage';
import {
  HeroContent,
  MissionContent,
  PopulationContent,
  FinancialContent,
  MethodContent,
  CurriculumContent,
  ImpactSectionContent,
  TestimonialsContent,
  ImpactLevelsContent,
  PartnersContent,
  FooterContent,
} from '../../services/impact.api';

export interface PDFReportProps {
  hero?: HeroContent | null | undefined;
  mission?: MissionContent | null | undefined;
  population?: PopulationContent | null | undefined;
  financial?: FinancialContent | null | undefined;
  method?: MethodContent | null | undefined;
  curriculum?: CurriculumContent | null | undefined;
  impactSection?: ImpactSectionContent | null | undefined;
  testimonials?: TestimonialsContent | null | undefined;
  impactLevels?: ImpactLevelsContent | null | undefined;
  partners?: PartnersContent | null | undefined;
  footer?: FooterContent | null | undefined;
}

/**
 * Main PDF Report component that renders all pages in fixed order.
 * Each page is exactly 8.5" × 11" (Letter size).
 */
export const PDFReport: React.FC<PDFReportProps> = ({
  hero,
  mission,
  population,
  financial,
  method,
  curriculum,
  impactSection,
  testimonials,
  impactLevels,
  partners,
  footer,
}) => {
  console.log('[PDFReport] Rendering with data:', {
    hero: !!hero,
    mission: !!mission,
    population: !!population,
    financial: !!financial,
    method: !!method,
    curriculum: !!curriculum,
    impactSection: !!impactSection,
    testimonials: !!testimonials,
    impactLevels: !!impactLevels,
    partners: !!partners,
    footer: !!footer,
  });

  return (
    <div className="pdf-report-container">
      {/* Page 1: Hero */}
      <PDFHeroPage data={hero} />

      {/* Page 2: Mission */}
      <PDFMissionPage data={mission} />

      {/* Page 3: Population */}
      <PDFPopulationPage data={population} />

      {/* Page 4: Financial */}
      <PDFFinancialPage data={financial} />

      {/* Page 5: Method */}
      <PDFMethodPage data={method} />

      {/* Page 6: Curriculum */}
      <PDFCurriculumPage data={curriculum} />

      {/* Page 7: Impact */}
      <PDFImpactPage data={impactSection} />

      {/* Page 8: Testimonial */}
      <PDFTestimonialPage data={testimonials} />

      {/* Page 9: Impact Levels */}
      <PDFImpactLevelsPage data={impactLevels} />

      {/* Page 10: Partners */}
      <PDFPartnersPage data={partners} />

      {/* Page 11: Footer */}
      <PDFFooterPage data={footer} />
    </div>
  );
};

export default PDFReport;

