import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import { createRoot } from 'react-dom/client';
import PDFReport, { PDFReportProps } from '../components/pdf/PDFReport';

export interface GeneratePDFOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'letter' | 'a4';
  quality?: number;
}

/**
 * Generates a PDF from the impact report data by rendering the print template
 * and converting it to a PDF using html2canvas and jsPDF.
 * 
 * @param data - The section data to include in the PDF
 * @param options - PDF generation options
 * @returns Promise that resolves when the PDF is generated and downloaded
 */
export async function generateImpactReportPDF(
  data: PDFReportProps,
  options: GeneratePDFOptions = {}
): Promise<void> {
  const {
    filename = `GOGO-Impact-Report-${new Date().getFullYear()}.pdf`,
    orientation = 'portrait',
    format = 'letter',
    quality = 2,
  } = options;

  // Create a temporary container for rendering the print template
  // Keep it visible but overlaid to ensure proper rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '8.5in'; // Letter width
  container.style.height = 'auto';
  container.style.backgroundColor = 'white';
  container.style.zIndex = '99999';
  container.style.overflow = 'visible';
  container.style.padding = '0';
  container.style.margin = '0';
  
  // Add overlay to block user interaction
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.zIndex = '99998';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.color = 'white';
  overlay.style.fontSize = '24px';
  overlay.style.fontFamily = 'Arial, sans-serif';
  overlay.innerHTML = '<div>Generating PDF...<br><small style="font-size: 16px;">Please wait...</small></div>';
  
  document.body.appendChild(overlay);
  document.body.appendChild(container);

  try {
    // Log the data being passed to PDF generation
    console.log('[PDF Generator] Data being passed:', {
      hero: !!data.hero,
      mission: !!data.mission,
      population: !!data.population,
      financial: !!data.financial,
      method: !!data.method,
      curriculum: !!data.curriculum,
      impactSection: !!data.impactSection,
      testimonials: !!data.testimonials,
      impactLevels: !!data.impactLevels,
      partners: !!data.partners,
      footer: !!data.footer,
    });
    
    // Render the PDF report into the container
    const root = createRoot(container);
    
    // Wait for React to render
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(PDFReport, data)
      );
      // Give React more time to render
      setTimeout(resolve, 3000); // Increased from 1500ms to 3000ms
    });

    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Wait for any images to load
    const images = container.querySelectorAll('img');
    if (images.length > 0) {
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve(true);
              } else {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(true); // Continue even if image fails
              }
            })
        )
      );
    }

    // Additional wait for styles to fully apply
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get all PDF pages
    const pages = container.querySelectorAll('.pdf-page');
    
    console.log(`[PDF Generator] Found ${pages.length} pages to render`);
    console.log('[PDF Generator] Container HTML length:', container.innerHTML.length);
    console.log('[PDF Generator] First page content preview:', 
      pages[0] ? (pages[0] as HTMLElement).innerText.substring(0, 200) : 'NO PAGES');
    
    if (pages.length === 0) {
      console.error('[PDF Generator] Container HTML:', container.innerHTML.substring(0, 500));
      throw new Error('No pages found in PDF report. Make sure data is provided.');
    }

    // Initialize PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'in',
      format,
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Process each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      console.log(`[PDF Generator] Processing page ${i + 1}/${pages.length}`);

      // Capture the page as canvas with optimal settings
      const canvas = await html2canvas(page, {
        scale: quality,
        useCORS: true,
        logging: false, // Disable logging for cleaner output
        backgroundColor: '#ffffff',
        allowTaint: true,
        foreignObjectRendering: true, // Enable for better CSS support
        imageTimeout: 15000,
        removeContainer: false,
        windowWidth: page.scrollWidth,
        windowHeight: page.scrollHeight,
      });

      console.log(`[PDF Generator] Page ${i + 1} canvas size: ${canvas.width}x${canvas.height}`);

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      // Add new page if not the first
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF - fill the entire page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, pageHeight);
    }

    // Save the PDF
    pdf.save(filename);

    // Cleanup
    root.unmount();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Remove the temporary container and overlay
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }
}

/**
 * Estimates the time it will take to generate the PDF based on the number of sections.
 * Returns the estimated time in seconds.
 */
export function estimatePDFGenerationTime(sectionCount: number): number {
  // Roughly 1-2 seconds per section
  return Math.ceil(sectionCount * 1.5);
}

/**
 * Validates that the required data is present for PDF generation.
 * Returns an array of missing section names, or empty array if all is good.
 */
export function validatePDFData(data: PDFReportProps): string[] {
  const missing: string[] = [];
  
  // Check for at least some content
  const hasContent = 
    data.hero ||
    data.mission ||
    data.population ||
    data.financial ||
    data.method ||
    data.curriculum ||
    data.impactSection ||
    data.testimonials ||
    data.impactLevels ||
    data.partners ||
    data.footer;

  if (!hasContent) {
    missing.push('At least one section with content');
  }

  return missing;
}

export default generateImpactReportPDF;

