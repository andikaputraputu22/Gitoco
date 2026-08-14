import { jsPDF } from "jspdf";
import type { TemplateId } from "@/lib/store";

/**
 * Client-side, template-aware portfolio PDF generation.
 *
 * This module is deliberately pure: it knows nothing about mock data, React or
 * localStorage. Feed it a `PortfolioDocument` and it draws a real vector PDF
 * (selectable text, true A4 geometry). To connect real portfolio data later,
 * build the same `PortfolioDocument` from the API response — nothing here changes.
 */

export interface PdfProject {
  name: string;
  title: string;
  description: string;
  tech: string[];
  highlights: string[];
  githubUrl: string;
}

export interface PortfolioDocument {
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  githubUrl: string;
  handle: string;
  portfolioUrl: string;
  skills: string[];
  projects: PdfProject[];
  template: TemplateId;
}

export interface PdfResult {
  blob: Blob;
  url: string;
  filename: string;
  pages: number;
}

export const PDF_STEPS = [
  "Preparing portfolio",
  "Formatting document",
  "Generating PDF",
  "PDF ready",
];

type RGB = [number, number, number];

interface Theme {
  body: "helvetica" | "times";
  heading: "helvetica" | "times";
  ink: RGB;
  muted: RGB;
  accent: RGB;
  rule: RGB;
  cardFill: RGB | null;
  numbered: boolean;
}

const MONO = "courier";

const THEMES: Record<TemplateId, Theme> = {
  minimal: {
    body: "times",
    heading: "times",
    ink: [17, 17, 17],
    muted: [102, 102, 102],
    accent: [17, 17, 17],
    rule: [219, 219, 219],
    cardFill: null,
    numbered: false,
  },
  professional: {
    body: "helvetica",
    heading: "helvetica",
    ink: [15, 23, 42],
    muted: [85, 99, 122],
    accent: [37, 99, 235],
    rule: [223, 231, 240],
    cardFill: [249, 251, 253],
    numbered: false,
  },
  modern: {
    body: "helvetica",
    heading: "helvetica",
    ink: [17, 24, 39],
    muted: [95, 110, 130],
    accent: [7, 89, 133],
    rule: [212, 221, 231],
    cardFill: null,
    numbered: true,
  },
};

const PAGE = { w: 210, h: 297 };
const M = { top: 20, bottom: 20, left: 20, right: 20 };
const CONTENT_W = PAGE.w - M.left - M.right;
/** Last usable baseline before the footer rule. */
const BOTTOM_LIMIT = PAGE.h - M.bottom - 8;
const MAX_BLOCK_H = PAGE.h - M.top - M.bottom - 10;

function ink(doc: jsPDF, c: RGB) {
  doc.setTextColor(c[0], c[1], c[2]);
}

/**
 * Shrinks the font size until `text` fits `maxW`, so single-line strings
 * (header meta, footer, contact) can never run past the margin.
 */
function fitText(doc: jsPDF, text: string, maxW: number, size: number, min = 6): number {
  let s = size;
  doc.setFontSize(s);
  while (s > min && doc.getTextWidth(text) > maxW) {
    s -= 0.2;
    doc.setFontSize(s);
  }
  return s;
}

/**
 * Draws one project block, or measures it when `render` is false.
 * Measuring and drawing share this single code path, so a measured height is
 * always the height actually drawn — that's what keeps blocks off page seams.
 */
function projectBlock(
  doc: jsPDF,
  t: Theme,
  p: PdfProject,
  startY: number,
  index: number,
  render: boolean,
): number {
  const pad = t.cardFill ? 5 : 0;
  const innerW = CONTENT_W - pad * 2;
  const x = M.left + pad;
  let y = startY + (t.cardFill ? 7 : 0);

  const heading = t.numbered ? `${String(index + 1).padStart(2, "0")}   ${p.title}` : p.title;

  doc.setFont(t.heading, "bold");
  doc.setFontSize(12.5);
  const titleLines = doc.splitTextToSize(heading, innerW) as string[];
  if (render) {
    ink(doc, t.ink);
    doc.text(titleLines, x, y);
  }
  y += titleLines.length * 5.4 + 1.8;

  doc.setFont(t.body, "normal");
  doc.setFontSize(9.6);
  const descLines = doc.splitTextToSize(p.description, innerW) as string[];
  if (render) {
    ink(doc, t.muted);
    doc.text(descLines, x, y);
  }
  y += descLines.length * 4.4 + 3;

  if (p.highlights.length) {
    doc.setFont(t.heading, "bold");
    doc.setFontSize(7.6);
    if (render) {
      ink(doc, t.accent);
      doc.text("ENGINEERING HIGHLIGHTS", x, y);
    }
    y += 4.2;
    doc.setFont(t.body, "normal");
    doc.setFontSize(9.2);
    for (const h of p.highlights) {
      const lines = doc.splitTextToSize(h, innerW - 4) as string[];
      if (render) {
        ink(doc, t.muted);
        doc.text("\u2022", x, y);
        doc.text(lines, x + 3.8, y);
      }
      y += lines.length * 4.2;
    }
    y += 2.4;
  }

  doc.setFont(MONO, "normal");
  doc.setFontSize(8.4);
  const techLines = doc.splitTextToSize(p.tech.join("  /  "), innerW) as string[];
  if (render) {
    ink(doc, t.ink);
    doc.text(techLines, x, y);
  }
  y += techLines.length * 4 + 1.6;

  doc.setFont(MONO, "normal");
  doc.setFontSize(8.2);
  if (render) {
    ink(doc, t.accent);
    doc.textWithLink(p.githubUrl, x, y, { url: p.githubUrl });
  }
  y += 4;

  if (t.cardFill) y += 4;
  return y - startY;
}

export function generatePortfolioPdf(data: PortfolioDocument): PdfResult {
  const t = THEMES[data.template];
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: `${data.name} — Developer Portfolio`,
    subject: data.title,
    author: data.name,
    creator: "GitFolio AI",
  });

  let y = M.top;

  // ---------- Header ----------
  if (data.template === "modern") {
    doc.setFillColor(11, 18, 32);
    doc.rect(0, 0, PAGE.w, 54, "F");
    doc.setFont(t.heading, "bold");
    doc.setTextColor(255, 255, 255);
    fitText(doc, data.name, CONTENT_W, 26, 14);
    doc.text(data.name, M.left, 25);
    doc.setFont(t.body, "normal");
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text(data.title, M.left, 33.5);
    doc.setFont(MONO, "normal");
    doc.setTextColor(125, 211, 252);
    const metaModern = `${data.email}    ${data.location}    github.com/${data.handle}`;
    fitText(doc, metaModern, CONTENT_W, 8.2);
    doc.text(metaModern, M.left, 42.5);
    y = 68;
  } else if (data.template === "professional") {
    doc.setFillColor(244, 247, 252);
    doc.rect(0, 0, PAGE.w, 46, "F");
    doc.setFont(t.heading, "bold");
    ink(doc, t.ink);
    fitText(doc, data.name, CONTENT_W, 22, 13);
    doc.text(data.name, M.left, 22);
    doc.setFont(t.body, "normal");
    doc.setFontSize(11);
    ink(doc, t.accent);
    doc.text(data.title, M.left, 30);
    doc.setFont(MONO, "normal");
    ink(doc, t.muted);
    const metaPro = `${data.email}   |   ${data.location}   |   github.com/${data.handle}`;
    fitText(doc, metaPro, CONTENT_W, 8.2);
    doc.text(metaPro, M.left, 38);
    y = 60;
  } else {
    doc.setFont(MONO, "normal");
    doc.setFontSize(8);
    ink(doc, t.muted);
    doc.text(data.location.toUpperCase(), M.left, y);
    y += 10;
    doc.setFont(t.heading, "bold");
    ink(doc, t.ink);
    fitText(doc, data.name, CONTENT_W, 28, 15);
    doc.text(data.name, M.left, y);
    y += 9;
    doc.setFont(t.body, "italic");
    doc.setFontSize(12.5);
    ink(doc, t.muted);
    doc.text(data.title, M.left, y);
    y += 7;
    doc.setDrawColor(t.rule[0], t.rule[1], t.rule[2]);
    doc.line(M.left, y, PAGE.w - M.right, y);
    y += 10;
  }

  const section = (label: string) => {
    if (y > BOTTOM_LIMIT - 26) {
      doc.addPage();
      y = M.top;
    }
    doc.setFont(t.heading, "bold");
    doc.setFontSize(8.4);
    ink(doc, t.accent);
    doc.text(label.toUpperCase(), M.left, y);
    y += 3;
    doc.setDrawColor(t.rule[0], t.rule[1], t.rule[2]);
    doc.line(M.left, y, PAGE.w - M.right, y);
    y += 6.5;
  };

  // ---------- Professional summary ----------
  section("Professional summary");
  doc.setFont(t.body, "normal");
  doc.setFontSize(10);
  ink(doc, t.muted);
  const summaryLines = doc.splitTextToSize(data.summary, CONTENT_W) as string[];
  doc.text(summaryLines, M.left, y);
  y += summaryLines.length * 4.7 + 9;

  // ---------- Skills ----------
  section("Skills");
  doc.setFont(MONO, "normal");
  doc.setFontSize(9);
  ink(doc, t.ink);
  const skillLines = doc.splitTextToSize(data.skills.join("  ·  "), CONTENT_W) as string[];
  doc.text(skillLines, M.left, y);
  y += skillLines.length * 4.4 + 9;

  // ---------- Featured projects ----------
  section("Featured projects");
  data.projects.forEach((p, i) => {
    const h = projectBlock(doc, t, p, y, i, false);
    // Keep a block whole: if it doesn't comfortably fit here but fits on a fresh
    // page, move it down. The 6mm guard keeps blocks off the page seam entirely.
    if (y + h + 6 > BOTTOM_LIMIT && h <= MAX_BLOCK_H) {
      doc.addPage();
      y = M.top;
    }
    if (t.cardFill) {
      doc.setFillColor(t.cardFill[0], t.cardFill[1], t.cardFill[2]);
      doc.setDrawColor(t.rule[0], t.rule[1], t.rule[2]);
      doc.roundedRect(M.left, y, CONTENT_W, h, 2, 2, "FD");
    }
    projectBlock(doc, t, p, y, i, true);
    y += h + (t.cardFill ? 5 : 7);
    if (!t.cardFill && i < data.projects.length - 1 && y < BOTTOM_LIMIT) {
      doc.setDrawColor(t.rule[0], t.rule[1], t.rule[2]);
      doc.line(M.left, y - 3.5, PAGE.w - M.right, y - 3.5);
    }
  });

  // ---------- Contact ----------
  if (y > BOTTOM_LIMIT - 36) {
    doc.addPage();
    y = M.top;
  }
  section("Contact");
  doc.setFont(t.body, "normal");
  doc.setFontSize(10);
  ink(doc, t.muted);
  doc.text("Available for engineering roles and freelance work.", M.left, y);
  y += 5.8;
  ink(doc, t.ink);
  doc.text(data.email, M.left, y);
  y += 5.8;
  doc.setFont(MONO, "normal");
  doc.setFontSize(9);
  ink(doc, t.accent);
  doc.textWithLink(data.githubUrl, M.left, y, { url: data.githubUrl });

  // ---------- Footer on every page ----------
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(t.rule[0], t.rule[1], t.rule[2]);
    doc.line(M.left, PAGE.h - 14, PAGE.w - M.right, PAGE.h - 14);
    doc.setFont(MONO, "normal");
    ink(doc, t.muted);
    const footerLeft = `${data.name}  ·  ${data.portfolioUrl}`;
    fitText(doc, footerLeft, CONTENT_W - 22, 7.6, 5.5);
    doc.text(footerLeft, M.left, PAGE.h - 9.5);
    doc.setFontSize(7.6);
    doc.text(`${i} / ${pages}`, PAGE.w - M.right, PAGE.h - 9.5, { align: "right" });
  }

  const blob = doc.output("blob");
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    blob,
    url: URL.createObjectURL(blob),
    filename: `${slug}-portfolio-${data.template}.pdf`,
    pages,
  };
}
