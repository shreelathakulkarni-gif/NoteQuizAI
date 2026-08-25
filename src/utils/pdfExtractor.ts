import * as pdfjsLib from 'pdfjs-dist';

// Set up pdfjs worker using standard CDN matching pdfjs-dist or unpkg
try {
  if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
} catch {
  // worker initialization fallback
}

export interface ExtractedPDFResult {
  text: string;
  pageCount: number;
  headings: string[];
  charCount: number;
  wordCount: number;
  previewSnippet: string;
}

/**
 * Extracts clean readable text from a PDF File or ArrayBuffer
 */
export async function extractTextFromPDF(file: File | ArrayBuffer): Promise<ExtractedPDFResult> {
  try {
    let arrayBuffer: ArrayBuffer;
    if (file instanceof File) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = file;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;
    const pageCount = pdfDocument.numPages;
    const pageTexts: string[] = [];
    const detectedHeadings: string[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageString = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          const str = item.str;
          if (!str.trim()) continue;

          // Check if item is potential heading (larger font or distinct line)
          if ('transform' in item && Array.isArray(item.transform)) {
            const fontSize = Math.abs(item.transform[0] || item.transform[3] || 12);
            if (fontSize >= 14 && str.length > 3 && str.length < 80) {
              if (!detectedHeadings.includes(str.trim())) {
                detectedHeadings.push(str.trim());
              }
            }
          }

          // Check vertical position change for line breaks
          const currentY = 'transform' in item && Array.isArray(item.transform) ? item.transform[5] : null;
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 8) {
            pageString += '\n';
          } else if (pageString && !pageString.endsWith(' ') && !pageString.endsWith('\n')) {
            pageString += ' ';
          }

          pageString += str;
          lastY = currentY;
        }
      }

      if (pageString.trim()) {
        pageTexts.push(`--- Page ${pageNum} ---\n${pageString.trim()}`);
      }
    }

    const fullText = pageTexts.join('\n\n');
    const cleanedText = fullText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    const wordCount = cleanedText ? cleanedText.split(/\s+/).length : 0;

    if (cleanedText.length < 50) {
      // Fallback: If minimal text extracted (e.g. scanned images), return clear indication
      return {
        text: cleanedText,
        pageCount,
        headings: detectedHeadings,
        charCount: cleanedText.length,
        wordCount,
        previewSnippet: cleanedText.slice(0, 300)
      };
    }

    return {
      text: cleanedText,
      pageCount,
      headings: detectedHeadings.slice(0, 10),
      charCount: cleanedText.length,
      wordCount,
      previewSnippet: cleanedText.slice(0, 400) + (cleanedText.length > 400 ? '...' : '')
    };
  } catch (error: any) {
    console.warn('Standard PDF parsing failed, trying text decoder fallback:', error);
    
    // Fallback: Try decoding raw strings from binary array buffer
    try {
      const buffer = file instanceof File ? await file.arrayBuffer() : file;
      const uint8 = new Uint8Array(buffer);
      let extracted = '';
      
      // Look for stream contents or plain ascii
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const raw = decoder.decode(uint8);
      
      // Simple regex extraction of text between stream objects or BT ... ET blocks
      const btMatches = raw.match(/BT[\s\S]*?ET/g);
      if (btMatches && btMatches.length > 0) {
        const textSnippets: string[] = [];
        for (const block of btMatches) {
          const tjMatches = block.match(/\((.*?)\)\s*Tj/g) || block.match(/\[(.*?)\]\s*TJ/g);
          if (tjMatches) {
            for (const tj of tjMatches) {
              const cleanStr = tj.replace(/^\(|\)\s*Tj$/g, '').replace(/^\[|\]\s*TJ$/g, '');
              textSnippets.push(cleanStr);
            }
          }
        }
        extracted = textSnippets.join(' ').replace(/\\(\d{3})/g, '').trim();
      }

      if (extracted.length > 60) {
        return {
          text: extracted,
          pageCount: 1,
          headings: ['Document Content'],
          charCount: extracted.length,
          wordCount: extracted.split(/\s+/).length,
          previewSnippet: extracted.slice(0, 300) + '...'
        };
      }
    } catch {
      // Fallback failed
    }

    throw new Error(error?.message || 'Could not parse the PDF file. Please ensure it is a valid, readable text PDF.');
  }
}
