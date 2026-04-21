type ExportElementToPdfOptions = {
  backgroundColor?: string;
  blockGapMm?: number;
  element: HTMLElement;
  fileName?: string;
  marginMm?: number;
};

const DEFAULT_FILE_NAME = 'report.pdf';
const DEFAULT_BACKGROUND_COLOR = '#FFFFFF';
const DEFAULT_MARGIN_MM = 8;
const DEFAULT_BLOCK_GAP_MM = 4;

export async function exportElementToPdf(options: ExportElementToPdfOptions): Promise<void> {
  const {
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
    blockGapMm = DEFAULT_BLOCK_GAP_MM,
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

  const blocks = Array.from(element.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
  const renderTargets = blocks.length > 0 ? blocks : [element];

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
  const renderScale = Math.min(window.devicePixelRatio || 1, 2);

  let cursorY = marginMm;
  let isFirstBlock = true;

  for (const target of renderTargets) {
    const canvas = await html2canvas(target, {
      backgroundColor,
      scale: renderScale,
      useCORS: true,
      windowHeight: target.scrollHeight,
      windowWidth: target.scrollWidth,
    });
    const blockHeightMm = (canvas.height * printableWidth) / canvas.width;
    const imageData = canvas.toDataURL('image/png');

    if (blockHeightMm > printableHeight) {
      if (!isFirstBlock) {
        pdf.addPage();
      }
      cursorY = marginMm;

      let remaining = blockHeightMm;
      pdf.addImage(
        imageData,
        'PNG',
        marginMm,
        cursorY,
        printableWidth,
        blockHeightMm,
        undefined,
        'FAST',
      );
      remaining -= printableHeight;

      while (remaining > 0) {
        pdf.addPage();
        const offset = marginMm - (blockHeightMm - remaining);
        pdf.addImage(
          imageData,
          'PNG',
          marginMm,
          offset,
          printableWidth,
          blockHeightMm,
          undefined,
          'FAST',
        );
        remaining -= printableHeight;
      }

      cursorY = marginMm + (printableHeight - Math.abs(remaining)) + blockGapMm;
      isFirstBlock = false;
      continue;
    }

    if (!isFirstBlock && cursorY + blockHeightMm > pageHeight - marginMm) {
      pdf.addPage();
      cursorY = marginMm;
    }

    pdf.addImage(
      imageData,
      'PNG',
      marginMm,
      cursorY,
      printableWidth,
      blockHeightMm,
      undefined,
      'FAST',
    );
    cursorY += blockHeightMm + blockGapMm;
    isFirstBlock = false;
  }

  pdf.save(fileName);
}
