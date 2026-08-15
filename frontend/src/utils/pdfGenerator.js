import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportDashboardToPDF(elementId, username) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Report container element not found.');
  }

  // Temporary style adjustment for high quality canvas rendering
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0d1117',
    logging: false,
    windowWidth: 1200
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const widthOnPdf = imgWidth * ratio;
  const heightOnPdf = imgHeight * ratio;

  // Add pages if long content
  let heightLeft = imgHeight;
  let position = 0;
  
  const pageHeightInCanvas = (pdfHeight * imgWidth) / pdfWidth;

  while (heightLeft > 0) {
    const canvasPage = document.createElement('canvas');
    canvasPage.width = imgWidth;
    canvasPage.height = Math.min(imgHeight - position, pageHeightInCanvas);

    const ctx = canvasPage.getContext('2d');
    ctx.drawImage(
      canvas,
      0, position, imgWidth, canvasPage.height,
      0, 0, imgWidth, canvasPage.height
    );

    const pageImgData = canvasPage.toDataURL('image/png');
    if (position > 0) {
      pdf.addPage();
    }
    
    pdf.addImage(
      pageImgData,
      'PNG',
      0,
      0,
      pdfWidth,
      (canvasPage.height * pdfWidth) / imgWidth
    );

    position += pageHeightInCanvas;
    heightLeft -= pageHeightInCanvas;
  }

  pdf.save(`GitHub_Report_${username}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
