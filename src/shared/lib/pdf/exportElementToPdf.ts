type ExportElementToPdfOptions = {
  backgroundColor?: string;
  element: HTMLElement;
  fileName?: string;
  marginMm?: number;
};

const DEFAULT_FILE_NAME = 'report.pdf';
const DEFAULT_BACKGROUND_COLOR = '#FFFFFF';
const DEFAULT_MARGIN_MM = 8;

export async function exportElementToPdf(options: ExportElementToPdfOptions): Promise<void> {
  const {
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
    element,
    fileName = DEFAULT_FILE_NAME,
    marginMm = DEFAULT_MARGIN_MM,
  } = options;

  if (!element) {
    throw new Error('PDF export target is missing.');
  }

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    backgroundColor,
    scale: Math.min(window.devicePixelRatio || 1, 2),
    useCORS: true,
    windowHeight: element.scrollHeight,
    windowWidth: element.scrollWidth,
  });

  const pdf = new jsPDF({
    compress: true,
    format: 'a4',
    orientation: 'portrait',
    unit: 'mm',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const printableWidth = pageWidth - marginMm * 2;
  const printableHeight = pageHeight - marginMm * 2;

  const renderedHeight = (canvas.height * printableWidth) / canvas.width;
  const imageData = canvas.toDataURL('image/png');

  let remainingHeight = renderedHeight;
  let offsetY = marginMm;

  pdf.addImage(
    imageData,
    'PNG',
    marginMm,
    offsetY,
    printableWidth,
    renderedHeight,
    undefined,
    'FAST',
  );
  remainingHeight -= printableHeight;

  while (remainingHeight > 0) {
    pdf.addPage();
    offsetY = marginMm - (renderedHeight - remainingHeight);
    pdf.addImage(
      imageData,
      'PNG',
      marginMm,
      offsetY,
      printableWidth,
      renderedHeight,
      undefined,
      'FAST',
    );
    remainingHeight -= printableHeight;
  }

  pdf.save(fileName);
}
