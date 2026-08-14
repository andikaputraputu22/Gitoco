import { jsPDF } from "jspdf";
import { TEMPLATES, heroLine, projectHeading } from "@/lib/portfolio";
import type { PortfolioData, PortfolioProject, TemplateConfig } from "@/lib/portfolio";

/**
 * Print rendering of the live portfolio preview.
 *
 * This module owns NO design decisions and NO copy: content, section order,
 * section labels and colours all come from `lib/portfolio.ts`, the same module the
 * live preview renders from. What lives here is purely print mechanics — A4
 * geometry, page breaks, wrapping and the drawing primitives that reproduce each
 * template's identity (editorial rules, white cards, dark panels).
 */

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

const PAGE = { w: 210, h: 297 };
const M = { top: 20, bottom: 20, left: 20, right: 20 };
const CONTENT_W = PAGE.w - M.left - M.right;
const BOTTOM_LIMIT = PAGE.h - M.bottom - 8;
const MAX_BLOCK_H = PAGE.h - M.top - M.bottom - 10;
const MONO = "courier";

type RGB = [number, number, number];

function rgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function textColor(doc: jsPDF, hex: string) {
  const [r, g, b] = rgb(hex);
  doc.setTextColor(r, g, b);
}

function fillColor(doc: jsPDF, hex: string) {
  const [r, g, b] = rgb(hex);
  doc.setFillColor(r, g, b);
}

function drawColor(doc: jsPDF, hex: string) {
  const [r, g, b] = rgb(hex);
  doc.setDrawColor(r, g, b);
}

/** Shrinks a single-line string until it fits, so nothing can cross a margin. */
function fitText(doc: jsPDF, text: string, maxW: number, size: number, min = 6): number {
  let s = size;
  doc.setFontSize(s);
  while (s > min && doc.getTextWidth(text) > maxW) {
    s -= 0.2;
    doc.setFontSize(s);
  }
  return s;
}

interface Ctx {
  doc: jsPDF;
  cfg: TemplateConfig;
  /** serif templates print in Times, the others in Helvetica */
  body: "times" | "helvetica";
}

/** Section caption — the print equivalent of <SectionLabel> in the preview. */
function caption(ctx: Ctx, label: string, x: number, y: number, render: boolean): number {
  const { doc, cfg } = ctx;
  doc.setFont(MONO, "normal");
  doc.setFontSize(7.6);
  if (render) {
    textColor(doc, cfg.tokens.faint);
    doc.setCharSpace(0.5);
    doc.text(label.toUpperCase(), x, y);
    doc.setCharSpace(0);
  }
  return 3.4;
}

function paragraph(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  w: number,
  size: number,
  color: string,
  render: boolean,
  lead = 1.42,
): number {
  const { doc, body } = ctx;
  doc.setFont(body, "normal");
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(text, w) as string[];
  const lh = size * 0.3528 * lead;
  if (render) {
    textColor(doc, color);
    doc.text(lines, x, y);
  }
  return lines.length * lh;
}

function bullets(
  ctx: Ctx,
  items: string[],
  x: number,
  y: number,
  w: number,
  size: number,
  color: string,
  render: boolean,
): number {
  const { doc, body } = ctx;
  doc.setFont(body, "normal");
  doc.setFontSize(size);
  const lh = size * 0.3528 * 1.4;
  let cursor = y;
  for (const item of items) {
    const lines = doc.splitTextToSize(item, w - 4) as string[];
    if (render) {
      textColor(doc, color);
      doc.text("\u2022", x, cursor);
      doc.text(lines, x + 3.4, cursor);
    }
    cursor += lines.length * lh;
  }
  return cursor - y;
}

/** Wrapped pill row — Professional's skill chips and Modern's stack chips. */
function pills(
  ctx: Ctx,
  items: string[],
  x: number,
  y: number,
  maxW: number,
  opts: { bg: string; ink: string; mono?: boolean; size?: number },
  render: boolean,
): number {
  const { doc, body } = ctx;
  const size = opts.size ?? 8;
  doc.setFont(opts.mono ? MONO : body, "normal");
  doc.setFontSize(size);
  const padX = 2.4;
  const h = 5.4;
  const gap = 1.8;
  let cx = x;
  let cy = y;
  for (const item of items) {
    const w = doc.getTextWidth(item) + padX * 2;
    if (cx + w > x + maxW) {
      cx = x;
      cy += h + gap;
    }
    if (render) {
      fillColor(doc, opts.bg);
      doc.roundedRect(cx, cy - h + 1.6, w, h, 1.4, 1.4, "F");
      textColor(doc, opts.ink);
      doc.text(item, cx + padX, cy);
    }
    cx += w + gap;
  }
  return cy - y + h;
}

/**
 * One project block, measured and drawn through the same code path so a measured
 * height is always the height drawn. Layout follows the selected template.
 */
function projectBlock(
  ctx: Ctx,
  data: PortfolioData,
  p: PortfolioProject,
  index: number,
  startY: number,
  render: boolean,
): number {
  const { doc, cfg, body } = ctx;
  const k = cfg.tokens;
  const panel = k.surface !== null && cfg.id !== "minimal";
  const pad = panel ? 6 : 0;
  const x = M.left + pad;
  const w = CONTENT_W - pad * 2;
  let y = startY + (panel ? 8 : 0);

  // Modern prints the project index, like the preview does
  if (k.numbered) {
    doc.setFont(MONO, "normal");
    doc.setFontSize(7.6);
    if (render) {
      textColor(doc, k.faint);
      doc.text(String(index + 1).padStart(2, "0"), x, y);
    }
    y += 4.6;
  }

  // Title + GitHub link on one row (both surfaces put the link on the right)
  const titleSize = cfg.id === "modern" ? 14 : cfg.id === "professional" ? 12 : 13;
  doc.setFont(body, "bold");
  const linkLabel = cfg.labels.githubLink;
  doc.setFont(MONO, "normal");
  doc.setFontSize(7.8);
  const linkW = doc.getTextWidth(linkLabel);
  doc.setFont(body, "bold");
  doc.setFontSize(titleSize);
  const titleLines = doc.splitTextToSize(projectHeading(cfg, p), w - linkW - 6) as string[];
  if (render) {
    textColor(doc, k.ink);
    doc.text(titleLines, x, y);
    doc.setFont(MONO, "normal");
    doc.setFontSize(7.8);
    textColor(doc, cfg.id === "minimal" ? k.muted : k.accent);
    doc.textWithLink(linkLabel, x + w - linkW, y, { url: p.githubUrl });
  }
  y += titleLines.length * (titleSize * 0.3528 * 1.24) + 1.8;

  y += paragraph(ctx, p.blurb, x, y, w, 9.6, k.body, render);
  y += 2.6;

  // Professional is the only template that lists key features
  if (k.showFeatures && p.features.length) {
    y += caption(ctx, cfg.labels.features, x, y, render);
    y += 1;
    y += bullets(ctx, p.features, x, y, w, 9, k.faint, render);
    y += 2.4;
  }

  if (p.highlights.length) {
    y += caption(ctx, cfg.labels.highlights, x, y, render);
    y += 1;
    y += bullets(ctx, p.highlights, x, y, w, 9, k.faint, render);
    y += 2.4;
  }

  // Tech: chips in Professional, joined text in Minimal/Modern — as in the preview
  if (cfg.id === "professional") {
    if (render) {
      drawColor(doc, k.rule);
      doc.line(x, y - 1.4, x + w, y - 1.4);
    }
    y += 3;
    y += pills(ctx, p.tech, x, y, w, { bg: "#F1F5F9", ink: k.body, mono: true, size: 7.6 }, render);
  } else {
    doc.setFont(MONO, "normal");
    doc.setFontSize(8);
    const joined = cfg.id === "modern" ? p.tech.join(" / ") : p.tech.join(", ");
    const lines = doc.splitTextToSize(joined, w) as string[];
    if (render) {
      textColor(doc, k.faint);
      doc.text(lines, x, y);
    }
    y += lines.length * 3.9;
  }

  y += panel ? 6 : 0;
  return y - startY;
}

export function generatePortfolioPdf(data: PortfolioData): PdfResult {
  const cfg = TEMPLATES[data.template];
  const k = cfg.tokens;
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const ctx: Ctx = { doc, cfg, body: k.serif ? "times" : "helvetica" };

  doc.setProperties({
    title: `${data.name} — Developer Portfolio`,
    subject: data.title,
    author: data.name,
    creator: "GitFolio AI",
  });

  const paintPage = () => {
    fillColor(doc, k.page);
    doc.rect(0, 0, PAGE.w, PAGE.h, "F");
  };
  const newPage = () => {
    doc.addPage();
    paintPage();
  };
  paintPage();

  let y = M.top;

  // ---------------- Header (per template identity) ----------------
  if (cfg.id === "modern") {
    doc.setFont(MONO, "normal");
    doc.setFontSize(7.6);
    textColor(doc, k.accent);
    doc.setCharSpace(0.6);
    doc.text("AVAILABLE FOR HIRE", M.left, y);
    doc.setCharSpace(0);
    y += 10;
    doc.setFont(ctx.body, "bold");
    textColor(doc, k.ink);
    fitText(doc, data.name, CONTENT_W, 28, 15);
    doc.text(data.name, M.left, y);
    y += 9;
    y += paragraph(ctx, heroLine(data), M.left, y, CONTENT_W - 8, 10.4, k.body, true, 1.5);
    y += 5;
    y += pills(
      ctx,
      data.skills,
      M.left,
      y,
      CONTENT_W,
      { bg: k.pillBg!, ink: k.pillInk!, mono: true, size: 7.6 },
      true,
    );
    y += 10;
  } else if (cfg.id === "professional") {
    // white header band with a bottom rule, mirroring the preview
    fillColor(doc, k.surface!);
    doc.rect(0, 0, PAGE.w, 44, "F");
    drawColor(doc, k.rule);
    doc.line(0, 44, PAGE.w, 44);
    doc.setFont(ctx.body, "bold");
    textColor(doc, k.ink);
    fitText(doc, data.name, CONTENT_W, 20, 13);
    doc.text(data.name, M.left, 20);
    doc.setFont(ctx.body, "normal");
    doc.setFontSize(11);
    textColor(doc, k.accent);
    doc.text(data.title, M.left, 28);
    doc.setFont(MONO, "normal");
    textColor(doc, k.faint);
    const meta = `${data.location}    ${data.email}    ${data.handle}`;
    fitText(doc, meta, CONTENT_W, 8);
    doc.text(meta, M.left, 35.5);
    y = 56;
  } else {
    doc.setFont(MONO, "normal");
    doc.setFontSize(7.6);
    textColor(doc, k.faint);
    doc.setCharSpace(0.6);
    doc.text(data.location.toUpperCase(), M.left, y);
    doc.setCharSpace(0);
    y += 10;
    doc.setFont(ctx.body, "bold");
    textColor(doc, k.ink);
    fitText(doc, data.name, CONTENT_W, 26, 14);
    doc.text(data.name, M.left, y);
    y += 8;
    doc.setFont(ctx.body, "normal");
    doc.setFontSize(12);
    textColor(doc, k.muted);
    doc.text(data.title, M.left, y);
    y += 7;
    drawColor(doc, k.rule);
    doc.line(M.left, y, PAGE.w - M.right, y);
    y += 8;
  }

  /** Card wrapper used by Professional; the others draw straight onto the page. */
  const card = (h: number) => {
    if (!k.surface || cfg.id !== "professional") return;
    fillColor(doc, k.surface);
    drawColor(doc, k.rule);
    doc.roundedRect(M.left, y - 6, CONTENT_W, h + 12, 2.4, 2.4, "FD");
  };

  const ensure = (h: number) => {
    if (y + h > BOTTOM_LIMIT) {
      newPage();
      y = M.top;
    }
  };

  const pad = cfg.id === "professional" ? 6 : 0;
  const innerX = M.left + pad;
  const innerW = CONTENT_W - pad * 2;

  // ---------------- Summary ----------------
  if (cfg.id !== "modern") {
    const labelH = cfg.labels.summary ? 3.4 + 3.5 : 0;
    const bodyH = paragraph(ctx, data.summary, innerX, 0, innerW, 10, k.body, false, 1.5);
    ensure(labelH + bodyH + 14);
    card(labelH + bodyH);
    if (cfg.labels.summary) {
      y += caption(ctx, cfg.labels.summary, innerX, y, true);
      y += 3.5;
    }
    y += paragraph(ctx, data.summary, innerX, y, innerW, 10, k.body, true, 1.5);
    y += cfg.id === "professional" ? 14 : 11;
  }

  // ---------------- Skills ----------------
  if (cfg.labels.skills) {
    if (k.skillStyle === "pills") {
      const h = pills(ctx, data.skills, innerX, 0, innerW, { bg: k.pillBg!, ink: k.pillInk!, size: 8 }, false);
      ensure(h + 20);
      card(3.4 + 4.5 + h);
      y += caption(ctx, cfg.labels.skills, innerX, y, true);
      y += 5.5;
      y += pills(ctx, data.skills, innerX, y, innerW, { bg: k.pillBg!, ink: k.pillInk!, size: 8 }, true);
      y += 14;
    } else {
      const joined = data.skills.join("  ·  ");
      const h = paragraph(ctx, joined, innerX, 0, innerW, 10, k.body, false, 1.6);
      ensure(h + 16);
      y += caption(ctx, cfg.labels.skills, innerX, y, true);
      y += 4.5;
      y += paragraph(ctx, joined, innerX, y, innerW, 10, k.body, true, 1.6);
      y += 11;
    }
  }

  // ---------------- Work ----------------
  ensure(20);
  y += caption(ctx, cfg.labels.work, M.left, y, true);
  y += cfg.id === "minimal" ? 6 : 6.5;

  data.projects.forEach((p, i) => {
    const h = projectBlock(ctx, data, p, i, y, false);
    // Keep each project whole; 6mm guard keeps blocks off the page seam.
    if (y + h + 6 > BOTTOM_LIMIT && h <= MAX_BLOCK_H) {
      newPage();
      y = M.top;
    }
    if (k.surface && cfg.id !== "minimal") {
      fillColor(doc, k.surface);
      drawColor(doc, k.rule);
      doc.roundedRect(M.left, y, CONTENT_W, h, 2.4, 2.4, "FD");
    }
    projectBlock(ctx, data, p, i, y, true);
    y += h;
    if (cfg.id === "minimal") {
      y += 6;
      if (i < data.projects.length - 1) {
        drawColor(doc, k.rule);
        doc.line(M.left, y, PAGE.w - M.right, y);
        y += 6;
      }
    } else {
      y += 5;
    }
  });

  // ---------------- Contact ----------------
  y += cfg.id === "minimal" ? 6 : 7;
  ensure(34);
  if (cfg.id === "modern") {
    // Modern's contact is a statement heading, not a caption
    if (k.surface) {
      fillColor(doc, k.surface);
      drawColor(doc, k.rule);
      doc.roundedRect(M.left, y - 6, CONTENT_W, 30, 2.4, 2.4, "FD");
    }
    doc.setFont(ctx.body, "bold");
    doc.setFontSize(15);
    textColor(doc, k.ink);
    doc.text(cfg.labels.contact, M.left + 6, y + 2);
    y += 9;
    doc.setFont(ctx.body, "normal");
    doc.setFontSize(10);
    textColor(doc, k.body);
    doc.text(data.email, M.left + 6, y);
    y += 6;
    doc.setFont(MONO, "normal");
    doc.setFontSize(8.4);
    textColor(doc, k.accent);
    doc.textWithLink(data.githubLabel, M.left + 6, y, { url: data.githubUrl });
  } else {
    card(16);
    y += caption(ctx, cfg.labels.contact, innerX, y, true);
    y += 5;
    doc.setFont(ctx.body, "normal");
    doc.setFontSize(10);
    textColor(doc, k.body);
    const line =
      cfg.id === "professional"
        ? `${data.contactLine} — ${data.email}`
        : `${data.email} —`;
    doc.text(line, innerX, y);
    y += 5.6;
    doc.setFont(MONO, "normal");
    doc.setFontSize(8.6);
    textColor(doc, cfg.id === "professional" ? k.accent : k.muted);
    doc.textWithLink(data.githubLabel, innerX, y, { url: data.githubUrl });
  }

  // ---------------- Footer on every page ----------------
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    drawColor(doc, k.rule);
    doc.line(M.left, PAGE.h - 14, PAGE.w - M.right, PAGE.h - 14);
    doc.setFont(MONO, "normal");
    textColor(doc, k.faint);
    const footerLeft = `${data.name}  ·  ${data.portfolioUrl}`;
    fitText(doc, footerLeft, CONTENT_W - 22, 7.4, 5.5);
    doc.text(footerLeft, M.left, PAGE.h - 9.5);
    doc.setFontSize(7.4);
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
