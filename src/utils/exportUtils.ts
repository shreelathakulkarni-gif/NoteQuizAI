import jsPDF from 'jspdf';
import { NotesData, Flashcard, QuizQuestion } from '../types';

export interface PDFExportOptions {
  theme?: 'sage' | 'academic' | 'monochrome' | 'warm';
  pageSize?: 'a4' | 'letter';
  includeOverview?: boolean;
  includeDetailedNotes?: boolean;
  includeKeyPoints?: boolean;
  includeTerms?: boolean;
  includeCheckboxes?: boolean;
  includeFlashcards?: boolean;
  includeQuizQuestions?: boolean;
  flashcards?: Flashcard[];
  quizQuestions?: QuizQuestion[];
  studentName?: string;
}

/**
 * Copy formatted notes to clipboard
 */
export async function copyNotesToClipboard(notes: NotesData, title: string): Promise<boolean> {
  try {
    let text = `# ${title}\n\n`;
    text += `## Overview\n${notes.overview}\n\n`;
    
    text += `## Detailed Notes\n\n`;
    notes.detailedNotes.forEach((section) => {
      text += `### ${section.heading}\n`;
      if (section.subheading) {
        text += `*${section.subheading}*\n\n`;
      }
      section.bulletPoints.forEach((bp) => {
        text += `- ${bp}\n`;
      });
      if (section.definitions && section.definitions.length > 0) {
        text += `\n**Definitions:**\n`;
        section.definitions.forEach((def) => {
          text += `- **${def.term}**: ${def.definition}\n`;
        });
      }
      if (section.examples && section.examples.length > 0) {
        text += `\n**Examples:**\n`;
        section.examples.forEach((ex) => {
          text += `- ${ex}\n`;
        });
      }
      text += `\n`;
    });

    text += `## Key Points\n`;
    notes.keyPoints.forEach((kp, i) => {
      text += `${i + 1}. [ ] ${kp}\n`;
    });
    text += `\n`;

    text += `## Important Terms\n`;
    notes.importantTerms.forEach((item) => {
      text += `* **${item.term}**: ${item.definition}\n`;
    });

    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

/**
 * Download notes as a beautifully styled, print-ready PDF using jsPDF
 */
export function downloadNotesAsPDF(
  notes: NotesData, 
  title: string, 
  options: PDFExportOptions = {}
) {
  const {
    theme = 'sage',
    pageSize = 'a4',
    includeOverview = true,
    includeDetailedNotes = true,
    includeKeyPoints = true,
    includeTerms = true,
    includeCheckboxes = true,
    includeFlashcards = false,
    includeQuizQuestions = false,
    flashcards = [],
    quizQuestions = [],
    studentName = ''
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: pageSize === 'letter' ? 'letter' : 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 20;

  // Theme color definitions
  const themeColors = {
    sage: {
      primary: [95, 116, 100],      // #5f7464
      primaryDark: [61, 74, 62],    // #3d4a3e
      accent: [226, 230, 223],      // #e2e6df
      accentLight: [243, 244, 238], // #f3f4ee
      textDark: [40, 50, 42],
      textMuted: [100, 116, 105],
      border: [203, 219, 204],
      calloutBg: [246, 248, 246]
    },
    academic: {
      primary: [37, 99, 235],       // Royal Blue
      primaryDark: [30, 58, 138],   // Navy Blue
      accent: [219, 234, 254],      // Sky
      accentLight: [240, 249, 255],
      textDark: [15, 23, 42],       // Slate 900
      textMuted: [100, 116, 139],   // Slate 500
      border: [203, 213, 225],
      calloutBg: [248, 250, 252]
    },
    monochrome: {
      primary: [30, 30, 30],        // Dark Ink
      primaryDark: [0, 0, 0],
      accent: [220, 220, 220],
      accentLight: [245, 245, 245],
      textDark: [20, 20, 20],
      textMuted: [90, 90, 90],
      border: [180, 180, 180],
      calloutBg: [250, 250, 250]
    },
    warm: {
      primary: [180, 83, 9],        // Amber 700
      primaryDark: [120, 53, 15],   // Amber 900
      accent: [254, 243, 199],      // Amber 100
      accentLight: [254, 252, 232],
      textDark: [69, 26, 3],
      textMuted: [146, 64, 14],
      border: [251, 191, 36],
      calloutBg: [255, 251, 235]
    }
  };

  const colors = themeColors[theme] || themeColors.sage;

  // Track page numbers
  const addFooter = (pageNum: number, totalPagesPlaceholder: boolean = false) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    
    // Bottom dividing rule
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    
    // Left footer: document title
    const shortTitle = title.length > 45 ? title.slice(0, 42) + '...' : title;
    doc.text(`${shortTitle} • NoteQuiz AI Offline Study Guide`, margin, pageHeight - 7);
    
    // Right footer: page number
    doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 7);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 18) {
      doc.addPage();
      cursorY = 20;
    }
  };

  // 1. TOP BANNER HEADER
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTEQUIZ AI  |  STUDY MATERIAL & EXAM PREPARATION GUIDE', margin, 7.5);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Printed: ${dateStr}`, pageWidth - margin - 28, 7.5);

  // 2. DOCUMENT TITLE & METADATA
  cursorY = 24;
  doc.setTextColor(colors.primaryDark[0], colors.primaryDark[1], colors.primaryDark[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const splitTitle = doc.splitTextToSize(title, contentWidth);
  doc.text(splitTitle, margin, cursorY);
  cursorY += splitTitle.length * 7.5 + 3;

  // Metadata badge line
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  const metaText = `Depth: ${notes.noteLength.toUpperCase()}  |  Sections: ${notes.detailedNotes?.length || 0}  |  Key Takeaways: ${notes.keyPoints?.length || 0}${studentName ? `  |  Student: ${studentName}` : ''}`;
  doc.text(metaText, margin, cursorY);
  cursorY += 6;

  // Horizontal Accent Divider
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 7;

  // SECTION HELPER
  const renderSectionHeader = (sectionTitle: string, iconText: string = '■') => {
    checkPageBreak(20);
    doc.setFillColor(colors.accentLight[0], colors.accentLight[1], colors.accentLight[2]);
    doc.roundedRect(margin, cursorY, contentWidth, 7.5, 1.5, 1.5, 'F');
    
    // Colored left indicator strip
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(margin, cursorY, 3, 7.5, 1, 1, 'F');

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primaryDark[0], colors.primaryDark[1], colors.primaryDark[2]);
    doc.text(`${iconText}  ${sectionTitle.toUpperCase()}`, margin + 6, cursorY + 5.2);
    cursorY += 11;
  };

  // 3. OVERVIEW & SUMMARY SECTION
  if (includeOverview && notes.overview) {
    renderSectionHeader('Executive Overview & Summary', '◆');
    
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
    
    const splitOverview = doc.splitTextToSize(notes.overview, contentWidth - 4);
    checkPageBreak(splitOverview.length * 4.5 + 4);

    // Callout box for overview
    doc.setFillColor(colors.calloutBg[0], colors.calloutBg[1], colors.calloutBg[2]);
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(0.3);
    const boxHeight = splitOverview.length * 4.5 + 6;
    doc.roundedRect(margin, cursorY - 2, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.text(splitOverview, margin + 4, cursorY + 2.5);
    cursorY += boxHeight + 6;
  }

  // 4. DETAILED CONCEPTS & BREAKDOWNS
  if (includeDetailedNotes && notes.detailedNotes && notes.detailedNotes.length > 0) {
    renderSectionHeader('Core Concepts & Detailed Notes', '◆');

    notes.detailedNotes.forEach((sec, idx) => {
      checkPageBreak(18);

      // Concept Title
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      const headingText = `${idx + 1}. ${sec.heading}`;
      const splitHeading = doc.splitTextToSize(headingText, contentWidth);
      doc.text(splitHeading, margin, cursorY);
      cursorY += splitHeading.length * 5 + 1.5;

      // Subheading if present
      if (sec.subheading) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
        const splitSub = doc.splitTextToSize(sec.subheading, contentWidth - 4);
        doc.text(splitSub, margin + 2, cursorY);
        cursorY += splitSub.length * 4.2 + 2.5;
      }

      // Bullet points
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);

      sec.bulletPoints.forEach((bp) => {
        const bulletPrefix = includeCheckboxes ? '[  ] ' : '•  ';
        const splitBp = doc.splitTextToSize(`${bulletPrefix}${bp}`, contentWidth - 6);
        checkPageBreak(splitBp.length * 4.2 + 2);
        
        doc.text(splitBp, margin + 4, cursorY);
        cursorY += splitBp.length * 4.2 + 1.5;
      });

      // Definitions inside section
      if (sec.definitions && sec.definitions.length > 0) {
        cursorY += 1.5;
        sec.definitions.forEach((d) => {
          checkPageBreak(12);
          doc.setFillColor(colors.accentLight[0], colors.accentLight[1], colors.accentLight[2]);
          doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
          doc.setLineWidth(0.2);

          const fullDef = `Definition: ${d.term} — ${d.definition}`;
          const splitDef = doc.splitTextToSize(fullDef, contentWidth - 10);
          const defBoxHeight = splitDef.length * 4 + 4;

          doc.roundedRect(margin + 4, cursorY - 1, contentWidth - 8, defBoxHeight, 1, 1, 'FD');
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.primaryDark[0], colors.primaryDark[1], colors.primaryDark[2]);
          doc.text(splitDef, margin + 7, cursorY + 2.5);
          cursorY += defBoxHeight + 2;
        });
      }

      // Examples inside section
      if (sec.examples && sec.examples.length > 0) {
        sec.examples.forEach((ex) => {
          checkPageBreak(10);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
          const splitEx = doc.splitTextToSize(`Example: ${ex}`, contentWidth - 8);
          doc.text(splitEx, margin + 6, cursorY);
          cursorY += splitEx.length * 4 + 1.5;
        });
      }

      cursorY += 4;
    });
  }

  // 5. HIGH-YIELD KEY REVISION POINTS WITH PRINTABLE CHECKBOXES
  if (includeKeyPoints && notes.keyPoints && notes.keyPoints.length > 0) {
    renderSectionHeader('High-Yield Takeaways (Active Recall Checklist)', '✓');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);

    notes.keyPoints.forEach((kp, idx) => {
      checkPageBreak(12);

      // Checkbox square
      if (includeCheckboxes) {
        doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setLineWidth(0.4);
        doc.rect(margin + 2, cursorY - 3, 3.5, 3.5);
      }

      const pointText = `${idx + 1}. ${kp}`;
      const splitPoint = doc.splitTextToSize(pointText, contentWidth - 10);
      doc.text(splitPoint, margin + (includeCheckboxes ? 8 : 4), cursorY);
      cursorY += splitPoint.length * 4.2 + 2.5;
    });

    cursorY += 4;
  }

  // 6. IMPORTANT TERMS & VOCABULARY GLOSSARY
  if (includeTerms && notes.importantTerms && notes.importantTerms.length > 0) {
    renderSectionHeader('Glossary of Key Terms & Terminology', '📖');

    notes.importantTerms.forEach((item) => {
      checkPageBreak(14);

      // Term box
      doc.setFillColor(colors.calloutBg[0], colors.calloutBg[1], colors.calloutBg[2]);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(0.2);

      const termHeading = `• ${item.term}`;
      const defContent = item.definition + (item.context ? ` [Context: ${item.context}]` : '');
      const splitDef = doc.splitTextToSize(defContent, contentWidth - 10);
      const boxHeight = splitDef.length * 4 + 7;

      doc.roundedRect(margin, cursorY - 2, contentWidth, boxHeight, 1, 1, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primaryDark[0], colors.primaryDark[1], colors.primaryDark[2]);
      doc.text(termHeading, margin + 4, cursorY + 2);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
      doc.text(splitDef, margin + 4, cursorY + 6.5);

      cursorY += boxHeight + 2.5;
    });

    cursorY += 4;
  }

  // 7. OPTIONAL: FLASHCARDS QUICK REFERENCE TABLE
  if (includeFlashcards && flashcards && flashcards.length > 0) {
    renderSectionHeader(`Flashcard Study Sheets (${flashcards.length} Cards)`, '🗂');

    flashcards.forEach((fc, idx) => {
      checkPageBreak(16);
      doc.setFillColor(colors.accentLight[0], colors.accentLight[1], colors.accentLight[2]);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(0.2);

      const splitFront = doc.splitTextToSize(`Q${idx + 1}: ${fc.front}`, (contentWidth / 2) - 6);
      const splitBack = doc.splitTextToSize(`A: ${fc.back}`, (contentWidth / 2) - 6);
      const rowHeight = Math.max(splitFront.length, splitBack.length) * 4 + 6;

      doc.roundedRect(margin, cursorY - 1, contentWidth, rowHeight, 1, 1, 'FD');
      
      // Question column
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primaryDark[0], colors.primaryDark[1], colors.primaryDark[2]);
      doc.text(splitFront, margin + 3, cursorY + 3);

      // Divider line in middle
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.line(margin + (contentWidth / 2), cursorY - 1, margin + (contentWidth / 2), cursorY + rowHeight - 1);

      // Answer column
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
      doc.text(splitBack, margin + (contentWidth / 2) + 3, cursorY + 3);

      cursorY += rowHeight + 2;
    });
  }

  // 8. OPTIONAL: QUIZ ASSESSMENT QUESTIONS & ANSWER KEY
  if (includeQuizQuestions && quizQuestions && quizQuestions.length > 0) {
    renderSectionHeader(`Practice Quiz Assessment (${quizQuestions.length} Questions)`, '✍');

    quizQuestions.forEach((q, idx) => {
      checkPageBreak(22);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primaryDark[0], colors.primaryDark[1], colors.primaryDark[2]);
      const splitQ = doc.splitTextToSize(`${idx + 1}. ${q.question}`, contentWidth - 4);
      doc.text(splitQ, margin + 2, cursorY);
      cursorY += splitQ.length * 4.2 + 2;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);

      q.options.forEach((opt, oIdx) => {
        const optionLabel = String.fromCharCode(65 + oIdx);
        const optText = `[  ]  ${optionLabel}. ${opt}`;
        const splitOpt = doc.splitTextToSize(optText, contentWidth - 10);
        doc.text(splitOpt, margin + 6, cursorY);
        cursorY += splitOpt.length * 3.8 + 1;
      });

      // Explanation key
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      const answerKey = `Correct: ${String.fromCharCode(65 + q.correctAnswerIndex)} • Note: ${q.explanation}`;
      const splitExp = doc.splitTextToSize(answerKey, contentWidth - 8);
      doc.text(splitExp, margin + 6, cursorY);
      cursorY += splitExp.length * 3.5 + 3.5;
    });
  }

  // Add footer numbers to all created pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i);
  }

  // Save PDF with sanitized name
  const safeFilename = title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) + '_Study_Guide.pdf';
  doc.save(safeFilename);
  return safeFilename;
}

/**
 * Download notes as Markdown
 */
export function downloadNotesAsMarkdown(notes: NotesData, title: string) {
  let text = `# ${title}\n\n`;
  text += `*Generated by NoteQuiz AI on ${new Date().toLocaleDateString()}*\n\n`;
  text += `## Overview\n${notes.overview}\n\n`;
  text += `## Detailed Notes\n\n`;
  notes.detailedNotes.forEach((sec) => {
    text += `### ${sec.heading}\n`;
    if (sec.subheading) text += `*${sec.subheading}*\n\n`;
    sec.bulletPoints.forEach((bp) => {
      text += `- [ ] ${bp}\n`;
    });
    if (sec.definitions && sec.definitions.length > 0) {
      text += `\n**Key Definitions:**\n`;
      sec.definitions.forEach((d) => {
        text += `- **${d.term}**: ${d.definition}\n`;
      });
    }
    if (sec.examples && sec.examples.length > 0) {
      text += `\n**Examples:**\n`;
      sec.examples.forEach((e) => {
        text += `- ${e}\n`;
      });
    }
    text += `\n`;
  });
  text += `## Key Points\n`;
  notes.keyPoints.forEach((kp, i) => {
    text += `${i + 1}. [ ] ${kp}\n`;
  });
  text += `\n## Important Terms\n`;
  notes.importantTerms.forEach((it) => {
    text += `- **${it.term}**: ${it.definition}\n`;
  });

  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Notes.md`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Print current notes using browser print dialog with styling
 */
export function printNotes() {
  window.print();
}

/**
 * Export flashcards to CSV/Text
 */
export function exportFlashcards(flashcards: Flashcard[], title: string) {
  let csv = 'Front,Back,Topic,Status\n';
  flashcards.forEach((fc) => {
    const cleanFront = `"${fc.front.replace(/"/g, '""')}"`;
    const cleanBack = `"${fc.back.replace(/"/g, '""')}"`;
    const cleanTopic = `"${fc.topic.replace(/"/g, '""')}"`;
    const status = fc.isRevision ? 'Needs Revision' : fc.isKnown ? 'Mastered' : 'Unreviewed';
    csv += `${cleanFront},${cleanBack},${cleanTopic},${status}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Flashcards.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export const downloadFlashcardsAsCSV = exportFlashcards;
